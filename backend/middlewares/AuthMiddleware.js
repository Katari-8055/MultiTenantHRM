import jwt from "jsonwebtoken";

export const AuthenticateMiddleware = (req, res, next) => {

  const token = req.cookies.token || '';

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Save tenantId if available
    if (decoded.tenantId) req.tenantId = decoded.tenantId;

    // Save role for RBAC
    req.userRole = decoded.role; 

    // Save employeeId if available
    if (decoded.employeeId) req.employeeId = decoded.employeeId;

    next();

  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}


export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.userRole)) {
            return res.status(403).json({ message: "Forbidden: You don't have permission" });
        }
        next();
    };
};

