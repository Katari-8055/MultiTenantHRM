import { asyncHandler } from "../utils/AsyncHandler.js";
import prisma from "../utils/client.js";

export const getEmpProjects = asyncHandler(async (req, res, next) => {
    const { tenantId, employeeId } = req;

    if (!tenantId || !employeeId) {
        return res.status(400).json({ message: "tenantId and employeeId are required" });
    }

    const projects = await prisma.employee.findFirst({
        where: { id: employeeId, tenantId },
        select: {
            projects: {
                select: {
                    id: true,
                    name: true,
                    client: true,
                    description: true,
                    status: true,
                    deadline: true,
                    createdAt: true,
                    updatedAt: true,
                    manager: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    },
                    members: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                }
            }
        }
    });

    res.status(200).json({ projects: projects?.projects || [] });
});

//---------------------------------------Leave Added---------------------------------------//

export const applyLeave = asyncHandler(async (req, res, next) => {
    const { tenantId, employeeId } = req;
    const { type, startDate, endDate, reason } = req.body;
    if (!tenantId || !employeeId) {
        return res.status(400).json({ message: "tenantId and employeeId are required" });
    }

    // Find the employee's manager via their first project assignment
    // Employee model has NO managerId – manager relationship flows through Projects
    const project = await prisma.project.findFirst({
        where: {
            tenantId,
            members: { some: { id: employeeId } }
        },
        select: { managerId: true }
    });

    const resolvedManagerId = project?.managerId || null;

    const newLeave = await prisma.leave.create({
        data: {
            tenantId,
            employeeId,
            managerId: resolvedManagerId,
            type,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            appliedAt: new Date()
        },
        include: {
            employee: { select: { firstName: true, lastName: true } }
        }
    });

    // Notify the manager if there is one
    if (resolvedManagerId) {
        const notification = await prisma.notification.create({
            data: {
                userId: resolvedManagerId,
                title: "New Leave Application",
                message: `${newLeave.employee.firstName} ${newLeave.employee.lastName || ''} has applied for ${type} leave.`,
                type: "LEAVE"
            }
        });

        if (req.io) {
            req.io.to(resolvedManagerId).emit("new-notification", notification);
            req.io.to(`tenant_${tenantId}`).emit("refresh-data", { type: 'leaves' });
            req.io.to(`tenant_${tenantId}`).emit("refresh-data", { type: 'stats' });
        }
    } else if (req.io) {
        req.io.to(`tenant_${tenantId}`).emit("refresh-data", { type: 'leaves' });
        req.io.to(`tenant_${tenantId}`).emit("refresh-data", { type: 'stats' });
    }

    res.status(201).json({ message: "Leave applied successfully", leave: newLeave });

});


//---------------------------------------Get Leave---------------------------------------//

export const getLeaves = asyncHandler(async (req, res, next) => {
    const { tenantId, employeeId } = req;
    if (!tenantId || !employeeId) {
        return res.status(400).json({ message: "tenantId and employeeId are required" });
    }

    const leave = await prisma.employee.findFirst({
        where: { id: employeeId, tenantId },
        select: {
            leaves:{
                select: {
                    id: true,
                    type: true,
                    startDate: true,
                    endDate: true,
                    reason: true,
                    appliedAt: true,
                    managerStatus: true,
                    hrStatus: true,
                    status: true,
                        hr: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        },
                        manager: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                }
            }
        }
    })

    return res.status(200).json({ leaves: leave?.leaves || [] });
});

//---------------------------------------Get Employee Tasks---------------------------------------//

export const getEmpTasks = asyncHandler(async (req, res, next) => {
    const { tenantId, employeeId } = req;
    if (!tenantId || !employeeId) {
        return res.status(400).json({ message: "tenantId and employeeId are required" });
    }

    const tasks = await prisma.task.findMany({
        where: {
            tenantId,
            assigneeId: employeeId
        },
        include: {
            creator: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    role: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    res.status(200).json({ success: true, tasks });
});

//---------------------------------------Update Task Status (Employee)---------------------------------------//

export const updateEmpTaskStatus = asyncHandler(async (req, res, next) => {
    const { tenantId, employeeId } = req;
    const { taskId } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: "Status is required" });
    }

    const task = await prisma.task.findFirst({
        where: { id: taskId, tenantId, assigneeId: employeeId }
    });

    if (!task) {
        return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: { status },
        include: {
            creator: {
                select: { id: true, firstName: true, lastName: true, email: true }
            },
            assignee: {
                select: { firstName: true, lastName: true }
            }
        }
    });

    // Notify the creator (e.g. Manager/Admin) about the status update
    // Notify the creator (e.g. Manager/Admin) about the status update
    const notification = await prisma.notification.create({
        data: {
            userId: updatedTask.creatorId,
            title: "Task Status Updated",
            message: `${updatedTask.assignee.firstName} ${updatedTask.assignee.lastName || ''} updated the status of task: ${updatedTask.title} to ${status}`,
            type: "TASK"
        }
    });

    if (req.io) {
        req.io.to(updatedTask.creatorId).emit("new-notification", notification);
        req.io.to(`tenant_${tenantId}`).emit("refresh-data", { type: 'tasks' });
        req.io.to(`tenant_${tenantId}`).emit("refresh-data", { type: 'stats' });
    }



    res.status(200).json({ success: true, message: "Task status updated successfully", task: updatedTask });
});

//---------------------------------------Employee Dashboard Stats---------------------------------------//

export const getEmpDashboardStats = asyncHandler(async (req, res, next) => {
    const { tenantId, employeeId } = req;

    if (!tenantId || !employeeId) {
        return res.status(400).json({ message: "tenantId and employeeId are required" });
    }

    // Counts
    const taskCount = await prisma.task.count({
        where: {
            tenantId,
            assigneeId: employeeId,
            status: { in: ['TODO', 'IN_PROGRESS'] }
        }
    });

    const projectCount = await prisma.project.count({
        where: {
            tenantId,
            members: { some: { id: employeeId } }
        }
    });

    const leaveStats = await prisma.leave.findMany({
        where: { tenantId, employeeId },
        select: { status: true }
    });

    const pendingLeaves = leaveStats.filter(l => l.status === 'PENDING').length;
    const approvedLeaves = leaveStats.filter(l => l.status === 'APPROVED').length;

    // Recent Tasks
    const recentTasks = await prisma.task.findMany({
        where: { tenantId, assigneeId: employeeId },
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: {
            creator: {
                select: { firstName: true, lastName: true }
            }
        }
    });

    // Active Projects
    const activeProjects = await prisma.project.findMany({
        where: {
            tenantId,
            members: { some: { id: employeeId } },
            status: 'ONGOING'
        },
        take: 3,
        include: {
            manager: {
                select: { firstName: true, lastName: true }
            }
        }
    });

    res.status(200).json({
        success: true,
        stats: {
            pendingTasks: taskCount,
            activeProjects: projectCount,
            pendingLeaves: pendingLeaves,
            approvedLeaves: approvedLeaves
        },
        recentTasks,
        activeProjects
    });
});