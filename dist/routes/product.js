"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const product_1 = require("../controllers/product");
router.post('/add', product_1.AddNew);
router.get('/all', product_1.GetAll);
exports.default = router;
