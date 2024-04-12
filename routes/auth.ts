import { Router } from "express";
import {Register,Login} from '../controllers/user';
const router:Router =Router(); 
router.post('/signup',Register);
router.post('/signin',Login);

export default router;