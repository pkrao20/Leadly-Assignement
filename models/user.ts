import mongoose, {Schema,Document,Model} from "mongoose";

export interface IUser extends Document{
    name:string;
    username:string;
    email:string;
    password:string;
    authMode:string[];
    isVerified:boolean;
    emailVerficationToken:string;
    emailVerificationExpire:number;
}

const schema: Schema<IUser>= new Schema({
    name:{type:String,required:true},
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    authMode:{type:[String],required:true},
    emailVerficationToken:{type:String},
    emailVerificationExpire:{type:Number},
    isVerified:{type:Boolean,default:false}
});

const User:Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User',schema);

export default User;
