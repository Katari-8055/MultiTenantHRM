import express from 'express';
import { AuthenticateMiddleware } from '../middlewares/AuthMiddleware.js';
import { getUserNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification, clearAllNotifications } from '../Controllers/NotificationController.js';

const router = express.Router();

// Get all notifications for the logged-in user
router.get('/', AuthenticateMiddleware, getUserNotifications);

// Mark a single notification as read
router.patch('/:id/read', AuthenticateMiddleware, markNotificationRead);

// Mark all notifications as read for the logged-in user
router.patch('/read-all', AuthenticateMiddleware, markAllNotificationsRead);

// Clear all notifications
router.delete('/clear-all', AuthenticateMiddleware, clearAllNotifications);

// Delete a single notification
router.delete('/:id', AuthenticateMiddleware, deleteNotification);

export default router;
