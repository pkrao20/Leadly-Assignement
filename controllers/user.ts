import { promises } from 'dns';
import User from '../models/user';
import { IUser } from '../models/user';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { Request, Response } from 'express';
import sendEmail from '../utils/sendEmail';
import jwt from 'jsonwebtoken';
// import { register } from 'module';
const client = new OAuth2Client();

let errors: { email: string, password: string, username: string, token: string,internalserver:string } = {
    email: "",
    password: "",
    username: "",
    token: "",
    internalserver:"",
};
const setError = () => {
    errors = {
        email: "",
        password: "",
        username: "",
        token: "",
        internalserver:""
    };
};

export const Register = async (req: Request, res: Response) => {
    try {
        // console.log('here');
        const { email, username, name, password, authMode } = req.body;
        const emailExist = await User.findOne({ email });
        const usernameExist = await User.findOne({ username });
        setError();
        if (usernameExist) {
            errors.username = "Username already exist";
            return res.status(401).json({ errors });
        }
        if (emailExist) {
            errors.email = "Email already exist";
            return res.status(401).json({ errors });
        }

        // if (authMode === 'email') {
            const salt: string = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const user: IUser = new User({
                name, username, email, password: hashedPassword, authMode: ['Email']
            });
            const verificationToken: string = crypto.randomBytes(20).toString('hex');
            user.emailVerficationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
            // console.log(new Date(Date.now() + (24 * 60 * 60 * 1000)));
            user.emailVerificationExpire = Date.now() + (24 * 60 * 60 * 1000);
            await user.save();
            setError();
            const verificationUrl: string = `http://localhost:8000/auth/email-verification/${verificationToken}`;
            const message: string = `<h2>Thank you for registering with us </h2>
            <p> Please click the below button to verify your email </p>
            <button> <a href=${verificationUrl} clicktracking=off> Verify Email </a> </button>
            `;

            await sendEmail({
                to: user.email,
                subject: 'Registered Successfully',
                html: message
            });
            
            return res.status(200).json({ message: "registered successfully" });
        // }
        // else{

        //     if(authMode === 'Google'){

        //         const ticket = await client.verifyIdToken({
        //             idToken: token,
        //             audience: client_id,  // Specify the CLIENT_ID of the app that accesses the backend
        //             // Or, if multiple clients access the backend:
        //             //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        //         });
        //         const payload = ticket.getPayload();
        //         const userId = payload['sub'];

        //         if(!userId){
        //             errors.email = 'Invalid user';
        //             return res.status(401).json({ errors });
        //         }

        //         const user = new User({
        //             name, username, email,isVerified: true, authModes: ['Google']
        //         });

        //         await user.save();

        //         const message = `
        //             <h2> Welcome to Leadly ! </h2>
        //            `;

        //         await sendEmail({
        //             to: email,
        //             subject: 'Welcome',
        //             html: message
        //         });

        //         console.log('Email Sent');

        //         res.status(200).json({ 
        //             "message" : "Successfully Registered"
        //         });
        //     }
        // }
    }
    catch {
        res.status(500).json({ message: "internal server error" });
    }
}

export const Login = async (req: Request, res: Response) => {
    const { emailOrUsername, password, authMode } = req.body;
    const emailExist = await User.findOne({ email: emailOrUsername });
    const userNameExist = await User.findOne({ username: emailOrUsername });
    let user = emailExist || userNameExist;
    setError();
    // if (authMode === 'email') {

        if (emailExist && emailExist.isVerified) {
            const auth: boolean = await bcrypt.compare(password, emailExist.password);
            if (auth) {
                if (process.env.JWT_SECRET) {
                    const token: string = jwt.sign({ id: emailExist._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
                    return res.status(201).json({ token: token, user: emailExist });
                } else {
                    console.log('empty jwt secret key');
                    return res.status(500).json({ error: "internal server error" });
                }
            } else {
                errors.password = "wrong password";
                return res.status(404).json({ errors });
            }

        }
        else if (userNameExist && userNameExist.isVerified) {
            const auth: boolean = await bcrypt.compare(password, userNameExist.password);
            if (auth) {
                if (process.env.JWT_SECRET) {
                    const token: string = jwt.sign({ id:userNameExist._id}, process.env.JWT_SECRET, { expiresIn: '24h' });
                    return res.status(201).json({ token: token, user: userNameExist });
                } else {

                    console.log('empty jwt secret key');
                    errors.internalserver  = "internal server error";
                    return res.status(500).json({errors});
                }
            } else {
                errors.password = "wrong password";
                return res.status(404).json({ errors });
            }

        }else if((userNameExist || emailExist) && user && !user.isVerified){
            errors.email = "email not verified";
            return res.status(404).json({errors});
        }
        else{
            errors.username = "email or username not found";
            return res.status(404).json({errors});
        }
    // }


}
// edit user - change password , edit email // similarly we can implement for forget password
// export const 
//
// export default {Register,Login};