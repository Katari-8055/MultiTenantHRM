import { asyncHandler } from "../utils/AsyncHandler.js";
import prisma from "../utils/client.js";

//-----------------------------------------------------Get Manager Projects-----------------------------------------------------//

export const getManagerProjects = asyncHandler(async (req, res, next) => {
    const { tenantId, employeeId } = req;

    if (!tenantId || !employeeId) {
        return res.status(400).json({ message: "tenantId and employeeId are required" });
    }

    const projects = await prisma.project.findMany({
        where: {
            tenantId,
            managerId: employeeId
        },
        include: {
            members: {
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

    res.status(200).json({ success: true, projects });
});

//-----------------------------------------------------Update Project Status-----------------------------------------------------//

export const updateProjectStatus = asyncHandler(async (req, res, next) => {
    const { tenantId, employeeId } = req;
    const { projectId } = req.params;
    const { status } = req.body;

    if (!tenantId || !employeeId || !projectId || !status) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Ensure the project belongs to this manager
    const projectInfo = await prisma.project.findFirst({
        where: { id: projectId, tenantId, managerId: employeeId }
    });

    if (!projectInfo) {
        return res.status(403).json({ message: "Project not found or unauthorized to update" });
    }

    const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: { status },
        include: {
            members: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    role: true
                }
            }
        }
    });

    res.status(200).json({ success: true, message: "Project status updated", project: updatedProject });
});

//-----------------------------------------------------Get Manager Dashboard Stats-----------------------------------------------------//

export const getManagerDashboardStats = asyncHandler(async (req, res, next) => {
    const { tenantId, employeeId } = req;

    if (!tenantId || !employeeId) {
        return res.status(400).json({ message: "tenantId and employeeId are required" });
    }

    // 1. Total Projects Managed
    const totalProjects = await prisma.project.count({
        where: { tenantId, managerId: employeeId }
    });

    // 2. Completed Projects
    const completedProjects = await prisma.project.count({
        where: { tenantId, managerId: employeeId, status: 'COMPLETED' }
    });

    // 3. Unique Team Members
    const projectsWithMembers = await prisma.project.findMany({
        where: { tenantId, managerId: employeeId },
        select: { members: { select: { id: true } } }
    });
    const uniqueMemberIds = new Set();
    projectsWithMembers.forEach(proj => {
        proj.members.forEach(member => uniqueMemberIds.add(member.id));
    });
    const teamMembersCount = uniqueMemberIds.size;

    // 4. Pending Leave Requests (where managerStatus is PENDING)
    const pendingLeaves = await prisma.leave.count({
        where: { tenantId, managerId: employeeId, managerStatus: 'PENDING' }
    });

    // 5. Chart Data (Projects grouped by Status)
    const projectStatusCounts = await prisma.project.groupBy({
        by: ['status'],
        where: { tenantId, managerId: employeeId },
        _count: { status: true }
    });

    let projectChartData = [];
    if (projectStatusCounts.length > 0) {
        projectChartData = projectStatusCounts.map(item => ({
            name: item.status,
            value: item._count.status
        }));
    } else {
        projectChartData = [
            { name: "ONGOING", value: 0 },
            { name: "COMPLETED", value: 0 },
            { name: "PENDING", value: 0 },
            { name: "CANCELLED", value: 0 }
        ];
    }

    // 6. Recent Leave Requests Feed
    const recentLeaves = await prisma.leave.findMany({
        where: { tenantId, managerId: employeeId },
        take: 5,
        orderBy: { appliedAt: 'desc' },
        include: {
            employee: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true
                }
            }
        }
    });

    const recentLeavesFormatted = recentLeaves.map(leave => ({
        id: leave.id,
        firstName: leave.employee.firstName,
        lastName: leave.employee.lastName,
        email: leave.employee.email,
        type: leave.type,
        startDate: leave.startDate,
        endDate: leave.endDate,
        appliedAt: leave.appliedAt,
        status: leave.managerStatus // showing manager's decision status
    }));

    res.status(200).json({
        success: true,
        stats: {
            totalProjects,
            completedProjects,
            teamMembersCount,
            pendingLeaves
        },
        chartData: projectChartData,
        recentActivity: recentLeavesFormatted
    });
});
