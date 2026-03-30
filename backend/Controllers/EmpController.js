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
    const newLeave = await prisma.leave.create({
        data: {
            tenantId,
            employeeId,
            type,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            appliedAt: new Date()
        }
    })
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
                    status: true,
                        hr: {
                            select: {
                                firstName: true,
                            }
                        }   
                }
            }
        }
    })

    return res.status(200).json({ leaves: leave?.leaves || [] });
});