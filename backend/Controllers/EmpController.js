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
