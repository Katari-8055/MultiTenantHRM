import express from 'express';
import { AuthenticateMiddleware } from '../middlewares/AuthMiddleware.js';
import { addDepartment, getDepartment } from '../Controllers/AdminComtroller.js';


const router = express.Router();

router.post('/addDepartment',AuthenticateMiddleware, addDepartment);
router.get('/getDepartment',AuthenticateMiddleware,getDepartment);


export default router;