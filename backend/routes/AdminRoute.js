import express from 'express';
import { AuthenticateMiddleware } from '../middlewares/AuthMiddleware.js';
import { addDepartment, addProject, deleteProject, getDepartment, getEmployee, getProject } from '../Controllers/AdminComtroller.js';
import { getEmpProjects } from '../Controllers/EmpController.js';


const router = express.Router();

router.post('/addDepartment',AuthenticateMiddleware, addDepartment);
router.get('/getDepartment',AuthenticateMiddleware,getDepartment);
router.get('/getEmployee',AuthenticateMiddleware,getEmployee);
router.post('/addProject',AuthenticateMiddleware, addProject);
router.get('/getProject',AuthenticateMiddleware,getProject);
router.delete('/deleteProject/:projectId',AuthenticateMiddleware,deleteProject);

router.get('/getEmpProject',AuthenticateMiddleware,getEmpProjects);



export default router;