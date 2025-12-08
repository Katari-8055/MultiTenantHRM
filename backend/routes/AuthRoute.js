import express from 'express';  
import { addEmployee, employeeLogin, getMe, login, register, registerEmployeesBulk, setEmployeePassword } from '../Controllers/AuthController.js';
import { AuthenticateMiddleware, authorize } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.post('/addEmployee', AuthenticateMiddleware, authorize('ADMIN', 'HR'), addEmployee);
router.post('/setPassword', setEmployeePassword);
router.post('/employeeLogin', employeeLogin);
router.get('/me', AuthenticateMiddleware, getMe);
router.post('/addInBulk', registerEmployeesBulk)

export default router;