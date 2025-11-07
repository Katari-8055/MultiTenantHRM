import { asyncHandler } from "../utils/AsyncHandler.js";
import prisma from "../utils/client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

    const token = jwt.sign({ tenantId: tenant.id }, process.env.JWT_SECRET, {expiresIn: '1d' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ message: "Login successful", tenant, token });
})
