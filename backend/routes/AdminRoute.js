import express from 'express';
import { AuthenticateMiddleware } from '../middlewares/AuthMiddleware.js';
import { addDepartment, getDepartment, getEmployee } from '../Controllers/AdminComtroller.js';


const router = express.Router();

router.post('/addDepartment',AuthenticateMiddleware, addDepartment);
router.get('/getDepartment',AuthenticateMiddleware,getDepartment);
router.get('/getEmployee',AuthenticateMiddleware,getEmployee);



export default router;