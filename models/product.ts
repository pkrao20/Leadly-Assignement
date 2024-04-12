import mongoose, {Model, Schema} from "mongoose";
import User from "./user";
import { Document } from "mongodb";

export interface IProduct extends Document{
    name:string;
    description:string;
    price:number;
    addedBy: mongoose.Schema.Types.ObjectId;
}

const schema:Schema<IProduct> = new Schema<IProduct>({
    name:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    addedBy:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'}

});

// module.exports = mongoose.models.Product || mongoose.model('Product',schema);
//const User:Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User',schema);

const Product:Model<IProduct> = mongoose.models.Product ||mongoose.model<IProduct>('Product',schema);
export default Product;