import express from 'express';
import { AuthenticateMiddleware, authorize } from '../middlewares/AuthMiddleware.js';
import { addDepartment, addProject, deleteProject, getDepartment, getEmployee, getProject } from '../Controllers/AdminComtroller.js';
import { applyLeave, getEmpProjects, getLeaves } from '../Controllers/EmpController.js';
import { getHRLeaves, updateLeaveStatus } from '../Controllers/HRControllers.js';


const router = express.Router();

router.post('/addDepartment',AuthenticateMiddleware, addDepartment);
router.get('/getDepartment',AuthenticateMiddleware,getDepartment);
router.get('/getEmployee',AuthenticateMiddleware,getEmployee);
router.post('/addProject',AuthenticateMiddleware, addProject);
router.get('/getProject',AuthenticateMiddleware,getProject);
router.delete('/deleteProject/:projectId',AuthenticateMiddleware,deleteProject);

router.get('/getEmpProject',AuthenticateMiddleware,getEmpProjects);
router.post('/applyLeave',AuthenticateMiddleware, applyLeave);
router.get('/getLeaves',AuthenticateMiddleware, getLeaves);

router.get('/getHRLeave',AuthenticateMiddleware,authorize('ADMIN', 'HR'), getHRLeaves);
router.post('/updateLeaveStatus',AuthenticateMiddleware,authorize('ADMIN', 'HR'), updateLeaveStatus);



export default router;