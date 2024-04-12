import { Router } from "express";
const router:Router = Router();
import { AddNew ,GetAll} from "../controllers/product";
router.post('/add',AddNew);

router.get('/all',GetAll);

export default router;