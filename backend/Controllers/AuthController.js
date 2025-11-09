import { asyncHandler } from "../utils/AsyncHandler.js";
import prisma from "../utils/client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../Services/MailServices.js";

//---------------------------------------------Register Tenant---------------------------------------------//

export const register = asyncHandler(async (req, res, next) => {
    const { name, email, password, domain } = req.body;


    const tenant = await prisma.tenant.findUnique({
        where: { email }
    });

    if (tenant) {
        return res.status(400).json({ message: "Tenant with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newTenant = await prisma.tenant.create({
        data: {
            name,
            email,
            password: hashedPassword,
            domain
        }
    });

    res.status(201).json({ message: "Tenant registered successfully", tenant: newTenant });
});


//---------------------------------------------Login Tenant---------------------------------------------//

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const tenant = await prisma.tenant.findUnique({
        where: { email }
    })
    if (!tenant) {
        return res.json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, tenant.password);
    if (!isMatch) {
        return res.json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ tenantId: tenant.id, role: tenant.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ message: "Login successful", tenant, token });
})



//---------------------------------------------Adding Employee By Tenant---------------------------------------------//

export const addEmployee = asyncHandler(async (req, res, next) => {
    const { firstName, email, role } = req.body;
    const tenantId = req.tenantId;

    const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId }
    });

    const existingEmployee = await prisma.employee.findUnique({
        where: { email }
    })

    if (existingEmployee) {
        return res.status(400).json({ message: "Employee with this email already exists" });
    }

    if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const newEmployee = await prisma.employee.create({
        data: {
            firstName,
            email,
            role,
            tenantId: tenant.id,
            setupToken: token,
            setupTokenExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24),
        }
    });

    const link = `http://localhost:5173/api/employee/setpassword?token=${token}`;

    await sendEmail(
        newEmployee.email,
        "Welcome to HR Management System",
        `Hello ${newEmployee.firstName},\n\nYour account has been created under the  department.\nPlease set your password using the link below:\n\n${link}\n\nThis link will expire in 24 hours.`
    );


    return res.json({
        success: true,
        message: "Employee added successfully and verification link sent.",
        employee: newEmployee,
    });

});

//---------------------------------------------------Set Password---------------------------------------------------//

export const setEmployeePassword = asyncHandler(async (req, res, next) => {
  const { token, password } = req.body;

  const employee = await prisma.employee.findFirst({
    where: {
      AND: [
        { setupToken: token },
        { setupTokenExpiry: { gt: new Date() } }
      ]
    }
  });

  if (!employee) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.employee.update({
    where: { id: employee.id },
    data: {
      password: hashedPassword,
      setupToken: null,
      setupTokenExpiry: null,
    }
  });

  res.status(200).json({ message: "Password set successfully" });
});


//------------------------------------------Login------------------------------------------------//

export const employeeLogin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const employee = await prisma.employee.findUnique({
        where: { email }
    })

    if (!employee) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ tenantId: employee.tenantId, employeeId: employee.id, role: employee.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token',token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
    })

    res.json({ message: "Login successful", employee, token });
})