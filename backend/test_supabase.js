import pg from 'pg';

const urls = [
  {
    name: 'Direct Supabase URL (db.<project>.supabase.co:5432)',
    url: 'postgresql://postgres:Katari%408055@db.gdevnyquoyfwzgypwkbi.supabase.co:5432/postgres'
  },
  {
    name: 'Session Pooler URL (aws-0-ap-south-1.pooler.supabase.com:5432)',
    url: 'postgresql://postgres.gdevnyquoyfwzgypwkbi:Katari%408055@aws-0-ap-south-1.pooler.supabase.com:5432/postgres'
  },
  {
    name: 'Transaction Pooler URL (aws-0-ap-south-1.pooler.supabase.com:6543)',
    url: 'postgresql://postgres.gdevnyquoyfwzgypwkbi:Katari%408055@aws-0-ap-south-1.pooler.supabase.com:6543/postgres'
  }
];

async function testConnections() {
  for (const item of urls) {
    console.log(`Testing: ${item.name}...`);
    const client = new pg.Client({
      connectionString: item.url,
      connectionTimeoutMillis: 5000,
      ssl: { rejectUnauthorized: false }
    });
    try {
      await client.connect();
      const res = await client.query('SELECT NOW()');
      console.log(`✅ SUCCESS! Connected to ${item.name}. DB Time:`, res.rows[0].now);
      await client.end();
    } catch (err) {
      console.log(`❌ FAILED for ${item.name}:`, err.message);
    }
  }
}

testConnections();
