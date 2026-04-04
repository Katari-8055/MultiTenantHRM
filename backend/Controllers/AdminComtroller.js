import { asyncHandler } from "../utils/AsyncHandler.js";
import prisma from "../utils/client.js";


//-------------------------------------Add Department-----------------------------------//

export const addDepartment = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const tenantId = req.tenantId;

    const department = await prisma.department.create({
        data: {
            name,
            tenant: {
                connect: { id: tenantId }
            }
        }
    });

    if (req.io) {
        req.io.to(`tenant_${tenantId}`).emit("refresh-data", { type: 'departments' });
        req.io.to(`tenant_${tenantId}`).emit("refresh-data", { type: 'stats' });
    }

    res.status(201).json({
        success: true,
        message: "Department added successfully",
        department
    });
    
})


//----------------------------------------------Get Department------------------------------------//

export const getDepartment = asyncHandler(async (req, res, next) => {
    const tenantId = req.tenantId;
    const departments = await prisma.department.findMany({
        where: {
            tenantId
        },
        include: {
            employees: {
                select: {
                    id: true,
                    firstName : true,
                    email : true,
                    role : true
                }
            }
        }
    });
    res.status(200).json({
        success: true,
        departments
    });
});



//--------------------------------------------------------Get Employee------------------------------------//

export const getEmployee = asyncHandler(async (req, res, next) => {
  const tenantId = req.tenantId;

  const employee = await prisma.tenant.findUnique({
    where: {
      id: tenantId,
    },
    include: {
      employees: {
        include: {
          department: true, 
        },
      },
    },
  });

  res.json({
    success: true,
    employees: employee?.employees ?? [],
  });
});

//--------------------------------------------------------Delete Department------------------------------------//


//-------------------------------------Add Projects-----------------------------------//


export const addProject = asyncHandler(async (req, res, next) => {
  const { name, client, status, managerId, deadline, memberIds } = req.body;

  const tenantId = req.tenantId;
  if (!tenantId) {
    return next(new Error("Tenant ID missing in request", 400));
  }

 const project = await prisma.project.create({
  data: {
    name,
    client,
    status,
    deadline: deadline ? new Date(deadline) : null,
    tenant: { connect: { id: tenantId } },
    manager: { connect: { id: managerId } },
    members: {
      connect: memberIds?.map((id) => ({ id })) || [],
    },
  },
  include: {
    manager: { select: { id: true, firstName: true, lastName: true, email: true } },
    members: { select: { id: true, firstName: true, lastName: true, email: true } },
  },
});

  if (req.io) {
      req.io.to(`tenant_${tenantId}`).emit("refresh-data", { type: 'projects' });
      req.io.to(`tenant_${tenantId}`).emit("refresh-data", { type: 'stats' });
  }

  return res.status(201).json({
    message: "Project created successfully",
    project,
  });
});


//-------------------------------------Get Projects-----------------------------------//

export const getProject = asyncHandler(async (req, res, next) => {
  const tenantId = req.tenantId;

  const projects = await prisma.project.findMany({
    where: { tenantId },
    include: {
      manager: {
        select: { firstName: true, lastName: true, email: true }
      },
      members: {
        select: { firstName: true, lastName: true, email: true }
      },
    }
  });

  res.status(200).json({
    success: true,
    projects
  });
});


//-------------------------------------Delete Projects-----------------------------------//

export const deleteProject = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const tenantId = req.tenantId;
  await prisma.project.delete({
    where: { id: projectId }
  })

  if (req.io && tenantId) {
      req.io.to(`tenant_${tenantId}`).emit("refresh-data", { type: 'projects' });
      req.io.to(`tenant_${tenantId}`).emit("refresh-data", { type: 'stats' });
  }

  res.status(200).json({
    success: true,
    message: "Project deleted successfully"
  })
  
})



//-------------------------------------Admin Dashboard Stats-----------------------------------//

export const getDashboardStats = asyncHandler(async (req, res, next) => {
  const tenantId = req.tenantId;

  // Counts
  const employeeCount = await prisma.employee.count({ where: { tenantId } });
  const departmentCount = await prisma.department.count({ where: { tenantId } });
  const projectCount = await prisma.project.count({ where: { tenantId } });
  const pendingLeaveCount = await prisma.leave.count({ 
      where: { 
          tenantId,
          status: 'PENDING'
      } 
  });

  // Department distribution for charts
  const departmentStats = await prisma.department.findMany({
      where: { tenantId },
      include: {
          _count: {
              select: { employees: true }
          }
      }
  });

  const chartData = departmentStats.map(dept => ({
      name: dept.name,
      value: dept._count.employees
  }));

  // Recent Employees (Activity)
  const recentEmployees = await prisma.employee.findMany({
      where: { tenantId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
          firstName: true,
          email: true,
          role: true,
          createdAt: true
      }
  });

  res.status(200).json({
      success: true,
      stats: {
          totalEmployees: employeeCount,
          totalDepartments: departmentCount,
          totalProjects: projectCount,
          pendingLeaves: pendingLeaveCount
      },
      chartData,
      recentActivity: recentEmployees
  });
});

//-------------------------------------Get Employee By ID-----------------------------------//

export const getEmployeeById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const tenantId = req.tenantId;

  const employee = await prisma.employee.findFirst({
    where: { 
      id,
      tenantId 
    },
    include: {
      department: true
    }
  });

  if (!employee) {
    return res.status(404).json({ success: false, message: "Employee not found" });
  }

  res.status(200).json({
    success: true,
    employee
  });
});

//-------------------------------------Update Employee-----------------------------------//

export const updateEmployee = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const tenantId = req.tenantId;
  const { 
    firstName, 
    lastName, 
    phone, 
    gender, 
    dateOfBirth, 
    position, 
    salary, 
    dateOfJoining, 
    employmentType, 
    status, 
    departmentId 
  } = req.body;

  // Verify the employee belongs to this tenant
  const existingEmployee = await prisma.employee.findFirst({
    where: { id, tenantId }
  });

  if (!existingEmployee) {
    return res.status(404).json({ success: false, message: "Employee not found" });
  }

  const updatedEmployee = await prisma.employee.update({
    where: { id },
    data: {
      firstName,
      lastName,
      phone,
      gender,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      position,
      salary: salary ? parseFloat(salary) : undefined,
      dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : undefined,
      employmentType,
      status,
      departmentId: departmentId || undefined
    },
    include: {
      department: true
    }
  });

  if (req.io) {
      req.io.to(`tenant_${tenantId}`).emit("refresh-data", { type: 'employees' });
  }

  res.status(200).json({
    success: true,
    message: "Employee updated successfully",
    employee: updatedEmployee
  });
});