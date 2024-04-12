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
exports.GetAll = exports.AddNew = void 0;
const product_1 = __importDefault(require("../models/product"));
const user_1 = __importDefault(require("../models/user"));
const AddNew = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, email } = req.body;
    const user = yield user_1.default.findOne({ email: email });
    if (user) {
        const product = new product_1.default({
            name, description, price, addedBy: user._id
        });
        yield product.save();
        return res.status(200).json({ message: "product saved successfully" });
    }
    else {
        return res.status(404).json({ errors: "Unknown User" });
    }
});
exports.AddNew = AddNew;
const GetAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield product_1.default.find();
    return res.status(200).json({ product: items });
});
exports.GetAll = GetAll;
