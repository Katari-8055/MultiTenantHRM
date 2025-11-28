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
