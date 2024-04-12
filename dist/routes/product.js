"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const product_1 = require("../controllers/product");
const middleware_1 = require("../middlewares/middleware");
router.post('/add', middleware_1.verifyTokenMiddleware, product_1.AddNew);
router.get('/all', product_1.GetAll);
exports.default = router;
