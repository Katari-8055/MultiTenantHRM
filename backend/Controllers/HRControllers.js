import { asyncHandler } from "../utils/AsyncHandler.js";
import prisma from "../utils/client.js";

//-----------------------------------------------------get Leave Requeste-----------------------------------------------------//

export const getHRLeaves = asyncHandler(async (req, res) => {
    const { tenentId } = req;

    const leave = await prisma.leave.findMany({
        where: {
            tenentId: tenentId
        },
        include: {
            employee: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    role: true
                }
            }
        }
    });

    res.status(200).json({
        success: true,
        leave
    });
});

//-----------------------------------------------------Update Leave Status-----------------------------------------------------//


export const updateLeaveStatus = asyncHandler(async (req, res) => {
  const { leaveId, status } = req.body;
  const { tenantId, employeeId } = req;

  if (!leaveId || !status) {
    return res.status(400).json({ message: "leaveId and status required" });
  }

  const leave = await prisma.leave.update({
    where: {
      id: leaveId,
      tenantId,
    },
    data: {
      status,
      hrId: employeeId,
      decisionAt: new Date(),
    },
    include: {
      employee: true,
    },
  });

  // 🔔 CREATE NOTIFICATION
  const notification = await prisma.notification.create({
    data: {
      userId: leave.employeeId,
      title: "Leave Status Updated",
      message: `Your leave has been ${status}`,
      type: "LEAVE",
    },
  });

  // ⚡ Emit real-time event
  req.io.to(leave.employeeId).emit("leave-updated", {
    leave,
    notification,
  });

  res.json({ message: "Leave updated", leave });
});

