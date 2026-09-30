import { asyncHandler } from "../utils/AsyncHandler.js";
import prisma from "../utils/client.js";
import { parsePagination } from "../utils/pagination.js";
import { getCache, setCache, invalidateTenantDashboardCache } from "../config/redis.js";


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

  await invalidateTenantDashboardCache(tenantId);

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
  const { page, limit, skip } = parsePagination(req.query);

  const cacheKey = `dept:${tenantId}:${page}:${limit}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return res.status(200).json(cached);
  }

  const where = { tenantId };
  const [total, departments] = await Promise.all([
    prisma.department.count({ where }),
    prisma.department.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        employees: {
          select: {
            id: true,
            firstName: true,
            email: true,
            role: true
          }
        }
      }
    })
  ]);

  const totalPages = Math.ceil(total / limit) || 1;
  const responseData = {
    success: true,
    items: departments,
    departments,
    total,
    page,
    totalPages
  };

  await setCache(cacheKey, responseData, 300);

  res.status(200).json(responseData);
});



//--------------------------------------------------------Get Employee------------------------------------//

export const getEmployee = asyncHandler(async (req, res, next) => {
  const tenantId = req.tenantId;
  const { page, limit, skip } = parsePagination(req.query);

  const cacheKey = `emp:${tenantId}:${page}:${limit}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  const where = { tenantId };
  const [total, employees] = await Promise.all([
    prisma.employee.count({ where }),
    prisma.employee.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        gender: true,
        position: true,
        salary: true,
        dateOfJoining: true,
        employmentType: true,
        status: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        tenantId: true,
        departmentId: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
  ]);

  const totalPages = Math.ceil(total / limit) || 1;
  const responseData = {
    success: true,
    items: employees,
    employees,
    total,
    page,
    totalPages
  };

  await setCache(cacheKey, responseData, 300);

  res.json(responseData);
});

//--------------------------------------------------------Delete Department------------------------------------//


//-------------------------------------Add Projects-----------------------------------//


export const addProject = asyncHandler(async (req, res, next) => {
  const { name, client, status, managerId, deadline, memberIds } = req.body;

  const tenantId = req.tenantId;
  if (!tenantId) {
    return res.status(400).json({ message: "Tenant ID missing in request" });
  }

  if (!name || !client || !managerId) {
    return res.status(400).json({ message: "Project name, client, and managerId are required." });
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

  await invalidateTenantDashboardCache(tenantId);

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
  const { page, limit, skip } = parsePagination(req.query);

  const cacheKey = `project:${tenantId}:${page}:${limit}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return res.status(200).json(cached);
  }

  const where = { tenantId };
  const [total, projects] = await Promise.all([
    prisma.project.count({ where }),
    prisma.project.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        manager: {
          select: { firstName: true, lastName: true, email: true }
        },
        members: {
          select: { firstName: true, lastName: true, email: true }
        },
      }
    })
  ]);

  const totalPages = Math.ceil(total / limit) || 1;
  const responseData = {
    success: true,
    items: projects,
    projects,
    total,
    page,
    totalPages
  };

  await setCache(cacheKey, responseData, 300);

  res.status(200).json(responseData);
});


//-------------------------------------Delete Projects-----------------------------------//

export const deleteProject = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const tenantId = req.tenantId;

  if (!tenantId) {
    return res.status(401).json({ success: false, message: "Tenant ID missing in request" });
  }

  const result = await prisma.project.deleteMany({
    where: {
      id: projectId,
      tenantId
    }
  });

  if (result.count === 0) {
    return res.status(404).json({ success: false, message: "Project not found or unauthorized to delete" });
  }

  await invalidateTenantDashboardCache(tenantId);

  if (req.io) {
    req.io.to(`tenant_${tenantId}`).emit("refresh-data", { type: 'projects' });
    req.io.to(`tenant_${tenantId}`).emit("refresh-data", { type: 'stats' });
  }

  res.status(200).json({
    success: true,
    message: "Project deleted successfully"
  });
});



//-------------------------------------Admin Dashboard Stats-----------------------------------//

export const getDashboardStats = asyncHandler(async (req, res, next) => {
  const tenantId = req.tenantId;

  // Check cache first
  const cacheKey = `dashboard:admin:${tenantId}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return res.status(200).json(cached);
  }

  // Execute all independent dashboard queries concurrently
  const [
    employeeCount,
    departmentCount,
    projectCount,
    pendingLeaveCount,
    departmentStats,
    recentEmployees
  ] = await Promise.all([
    prisma.employee.count({ where: { tenantId } }),
    prisma.department.count({ where: { tenantId } }),
    prisma.project.count({ where: { tenantId } }),
    prisma.leave.count({
      where: {
        tenantId,
        status: 'PENDING'
      }
    }),
    prisma.department.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: { employees: true }
        }
      }
    }),
    prisma.employee.findMany({
      where: { tenantId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        firstName: true,
        email: true,
        role: true,
        createdAt: true
      }
    })
  ]);

  const chartData = departmentStats.map(dept => ({
    name: dept.name,
    value: dept._count.employees
  }));

  const responseData = {
    success: true,
    stats: {
      totalEmployees: employeeCount,
      totalDepartments: departmentCount,
      totalProjects: projectCount,
      pendingLeaves: pendingLeaveCount
    },
    chartData,
    recentActivity: recentEmployees
  };

  // Cache for 5 minutes (300 seconds)
  await setCache(cacheKey, responseData, 300);

  res.status(200).json(responseData);
});

//-------------------------------------Get Employee By ID-----------------------------------//

export const getEmployeeById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const tenantId = req.tenantId;

  const cacheKey = `emp:${tenantId}:${id}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return res.status(200).json(cached);
  }

  const employee = await prisma.employee.findFirst({
    where: {
      id,
      tenantId
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      dateOfBirth: true,
      gender: true,
      position: true,
      salary: true,
      dateOfJoining: true,
      employmentType: true,
      status: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      tenantId: true,
      departmentId: true,
      department: true,
    }
  });

  if (!employee) {
    return res.status(404).json({ success: false, message: "Employee not found" });
  }

  const responseData = {
    success: true,
    employee
  };

  await setCache(cacheKey, responseData, 300);

  res.status(200).json(responseData);
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

  if (departmentId) {
    const validDepartment = await prisma.department.findFirst({
      where: { id: departmentId, tenantId }
    });

    if (!validDepartment) {
      return res.status(404).json({ success: false, message: "Department not found or does not belong to your company" });
    }
  }

  const validGender = (gender && ['MALE', 'FEMALE', 'OTHER'].includes(String(gender).toUpperCase())) ? String(gender).toUpperCase() : undefined;

  const updatedEmployee = await prisma.employee.update({
    where: { id },
    data: {
      firstName: firstName || undefined,
      lastName: lastName !== undefined && lastName !== '' ? lastName : undefined,
      phone: phone !== undefined && phone !== '' ? phone : undefined,
      gender: validGender,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      position: position !== undefined && position !== '' ? position : undefined,
      salary: salary ? parseFloat(salary) : undefined,
      dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : undefined,
      employmentType: employmentType || undefined,
      status: status || undefined,
      departmentId: departmentId || undefined
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      dateOfBirth: true,
      gender: true,
      position: true,
      salary: true,
      dateOfJoining: true,
      employmentType: true,
      status: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      tenantId: true,
      departmentId: true,
      department: true,
    }
  });

  await invalidateTenantDashboardCache(tenantId);

  if (req.io) {
    req.io.to(`tenant_${tenantId}`).emit("refresh-data", { type: 'employees' });
    req.io.to(`tenant_${tenantId}`).emit("refresh-data", { type: 'stats' });
  }

  res.status(200).json({
    success: true,
    message: "Employee updated successfully",
    employee: updatedEmployee
  });
});