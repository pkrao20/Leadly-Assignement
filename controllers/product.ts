import { Request, Response, Express } from 'express';
import { IProduct } from '../models/product';
import Product from '../models/product';
import User from '../models/user';

export const AddNew =async(req:Request,res:Response)=>{
    const {name,description,price,email} = req.body;
    const user = await User.findOne({email:email});
    if(user){
        const product:IProduct = new Product({
            name,description,price,addedBy:user._id
        });
        await product.save();
        return res.status(200).json({message:"product saved successfully"});
    }else{
        return res.status(404).json({errors:"Unknown User"});
    }
}

export const GetAll = async (req:Request,res:Response) =>{
    const items = await Product.find();
    return res.status(200).json({product:items});
    
}
