import { Router } from "express";
import {Register,Login,emailVerfication,editPassword} from '../controllers/user';
import { verifyTokenMiddleware } from "../middlewares/middleware";

const router:Router =Router(); 
router.post('/signup',Register);
router.post('/signin',Login);
router.post('/email-verification/:token',emailVerfication);
router.patch('/change-password',verifyTokenMiddleware,editPassword);

export default router;