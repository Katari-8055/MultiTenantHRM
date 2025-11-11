import express from 'express';
import { AuthenticateMiddleware } from '../middlewares/AuthMiddleware.js';
import { addDepartment } from '../Controllers/AdminComtroller.js';


const router = express.Router();

router.post('/addDepartment',AuthenticateMiddleware, addDepartment);


export default router;