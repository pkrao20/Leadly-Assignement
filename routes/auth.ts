import { Router } from "express";
import {Register,Login,emailVerfication} from '../controllers/user';
const router:Router =Router(); 
router.post('/signup',Register);
router.post('/signin',Login);
router.post('/email-verification/:token',emailVerfication);


export default router;