import express from 'express';  
import { addEmployee, employeeLogin, login, register, setEmployeePassword } from '../Controllers/AuthController.js';
import { AuthenticateMiddleware, authorize } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.post('/addEmployee', AuthenticateMiddleware, authorize('TENANT_ADMIN', 'HR'), addEmployee);
router.post('/setPassword', setEmployeePassword);
router.post('/employeeLogin', employeeLogin);

export default router;