"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require('express');
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const product_1 = __importDefault(require("./routes/product"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
if (process.env.MONGO_URL) {
    mongoose_1.default.connect(process.env.MONGO_URL)
        .then(() => {
        app.listen(8000, () => {
            console.log('running after connecting');
        });
    })
        .catch(error => {
        console.log(error);
    });
}
else {
    console.log('empty connection url');
}
app.use('/auth', auth_1.default);
app.use('/product', product_1.default);
//models - user and product
//GcZxLhvW0SppYWkR
//pkraojee2020 - username
