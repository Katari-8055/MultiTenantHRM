import { asyncHandler } from "../utils/AsyncHandler.js";
import prisma from "../utils/client.js";

//---------------------------------------Get User Notifications---------------------------------------//
export const getUserNotifications = asyncHandler(async (req, res, next) => {
    const { employeeId } = req; // Extracted from auth middleware

    if (!employeeId) {
        return res.status(401).json({ message: "Unauthorized. User ID not found." });
    }

    const notifications = await prisma.notification.findMany({
        where: {
            userId: employeeId
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 20 // Limit to 20 for initial load
    });

    res.status(200).json({ success: true, notifications });
});

//---------------------------------------Mark Notification as Read---------------------------------------//
export const markNotificationRead = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { employeeId } = req;

    const notification = await prisma.notification.findFirst({
        where: { id, userId: employeeId }
    });

    if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
    }

    const updatedNotification = await prisma.notification.update({
        where: { id },
        data: { read: true }
    });

    res.status(200).json({ success: true, notification: updatedNotification });
});

//---------------------------------------Mark All as Read---------------------------------------//
export const markAllNotificationsRead = asyncHandler(async (req, res, next) => {
    const { employeeId } = req;

    await prisma.notification.updateMany({
        where: { userId: employeeId, read: false },
        data: { read: true }
    });

    res.status(200).json({ success: true, message: "All notifications marked as read" });
});
