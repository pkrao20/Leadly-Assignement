import { Request, Response, Express } from 'express';
import { IProduct } from '../models/product';
import Product from '../models/product';

export const AddNew =async(req:Request,res:Response)=>{
    const {name,description,price,id} = req.body;
    const product:IProduct = new Product({
        name,description,price,addedBy:id
    });
    await product.save();
    return res.status(200).json({message:"product saved successfully"});
}

export const GetAll = async (req:Request,res:Response) =>{
    const items = await Product.find();
    return res.status(200).json({product:items});
    
}
