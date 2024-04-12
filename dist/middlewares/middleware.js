"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
function verifyTokenMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({ errors: { token: 'Not Authorized' } });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = yield user_1.default.findOne({ _id: decoded.id });
            if (!user) {
                return res.status(404).json({ errors: { token: 'User not found' } });
            }
            req.user = user;
            next();
        }
        catch (error) {
            return res.status(401).json({ errors: { token: 'Invalid token' } });
        }
    });
}
exports.verifyTokenMiddleware = verifyTokenMiddleware;
