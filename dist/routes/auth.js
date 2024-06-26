"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const middleware_1 = require("../middlewares/middleware");
const router = (0, express_1.Router)();
router.post('/signup', user_1.Register);
router.post('/signin', user_1.Login);
router.post('/email-verification/:token', user_1.emailVerfication);
router.patch('/change-password', middleware_1.verifyTokenMiddleware, user_1.editPassword);
exports.default = router;
