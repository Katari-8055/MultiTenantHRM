import { Queue, Worker } from 'bullmq';
import config from '../config/config.js';
import { sendEmail } from './MailServices.js';

// Construct Redis connection options for BullMQ & ioredis
const getRedisConnection = () => {
  if (config.redis?.url) {
    try {
      const parsedUrl = new URL(config.redis.url);
      return {
        host: parsedUrl.hostname,
        port: Number(parsedUrl.port) || 6379,
        password: parsedUrl.password || undefined,
        maxRetriesPerRequest: null,
      };
    } catch (e) {
      // Fallback if URL parsing fails
    }
  }

  return {
    host: config.redis?.host || '127.0.0.1',
    port: config.redis?.port || 6379,
    ...(config.redis?.password && { password: config.redis.password }),
    maxRetriesPerRequest: null,
  };
};

const connection = getRedisConnection();

let emailQueue = null;
let emailWorker = null;

try {
  // Initialize BullMQ Queue
  emailQueue = new Queue('email-queue', { connection });

  // Initialize BullMQ Worker to process queued email jobs
  emailWorker = new Worker(
    'email-queue',
    async (job) => {
      const { to, subject, text } = job.data;
      console.log(`📩 [BullMQ] Processing email job #${job.id} for ${to} (Attempt ${job.attemptsMade + 1}/${job.opts.attempts})...`);
      await sendEmail(to, subject, text);
    },
    { connection }
  );

  // Worker Event Listeners
  emailWorker.on('completed', (job) => {
    console.log(`✅ [BullMQ] Email job #${job.id} to ${job.data.to} delivered successfully.`);
  });

  emailWorker.on('failed', (job, err) => {
    if (job) {
      const maxAttempts = job.opts.attempts || 3;
      if (job.attemptsMade >= maxAttempts) {
        console.error(
          `❌ [BullMQ Permanent Failure] Job #${job.id} to ${job.data.to} failed after max ${job.attemptsMade} attempts. Final Error: ${err.message}`
        );
      } else {
        console.warn(
          `⚠️ [BullMQ Retry Warning] Job #${job.id} to ${job.data.to} failed attempt ${job.attemptsMade}/${maxAttempts}. Error: ${err.message}`
        );
      }
    } else {
      console.error(`❌ [BullMQ Worker Error]: ${err.message}`);
    }
  });

  emailWorker.on('error', (err) => {
    console.warn(`⚠️ [BullMQ Worker Connection]: ${err.message}`);
  });

  emailQueue.on('error', (err) => {
    console.warn(`⚠️ [BullMQ Queue Connection]: ${err.message}`);
  });
} catch (error) {
  console.warn(`⚠️ [BullMQ Initialization Warning] Could not initialize BullMQ queue: ${error.message}`);
}

/**
 * Enqueues an email sending job into BullMQ asynchronously.
 * Decouples SMTP processing from the HTTP request lifecycle so database
 * operations succeed immediately regardless of email server latency or outages.
 *
 * @param {Object} payload - { to, subject, text }
 */
export const addEmailJob = async ({ to, subject, text }) => {
  try {
    if (!emailQueue) {
      console.warn('⚠️ [Email Queue] BullMQ queue uninitialized. Executing direct background send.');
      setImmediate(() => {
        sendEmail(to, subject, text).catch((err) => {
          console.error(`❌ [Direct Async Email Error] Failed to send email to ${to}: ${err.message}`);
        });
      });
      return;
    }

    const job = await emailQueue.add(
      'send-invitation-email',
      { to, subject, text },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000, // 3s, 6s, 12s
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );

    console.log(`📦 [BullMQ] Enqueued email invitation job #${job.id} for ${to}`);
  } catch (err) {
    console.error(`⚠️ [BullMQ Enqueue Warning] Could not enqueue email job for ${to}: ${err.message}`);
    // Safe fallback direct async send so HTTP requests never fail
    setImmediate(() => {
      sendEmail(to, subject, text).catch((directErr) => {
        console.error(`❌ [Direct Async Email Error] Failed to send email to ${to}: ${directErr.message}`);
      });
    });
  }
};
