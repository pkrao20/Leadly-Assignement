import { Router } from "express";
const router:Router = Router();
import { AddNew ,GetAll} from "../controllers/product";
import { verifyTokenMiddleware } from "../middlewares/middleware";
router.post('/add',verifyTokenMiddleware,AddNew);

router.get('/all',GetAll);

export default router;