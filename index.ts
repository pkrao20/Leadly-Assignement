// const express = require('express');
import express, { Request, Response, Express } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import auth from './routes/auth';
import product from './routes/product';
// import { error } from 'console';
import {Register} from './controllers/user';
dotenv.config();
const app: Express = express();

app.use(express.json());

if (process.env.MONGO_URL) {
    mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            app.listen(8000, () => {
                console.log('running after connecting');
            });
        })
        .catch(error => {
            console.log(error);
        });
} else {
    console.log('empty connection url');
}

app.use('/auth',auth);

app.use('/product',product);

//models - user and product
//GcZxLhvW0SppYWkR
//pkraojee2020 - username






