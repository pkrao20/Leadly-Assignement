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
exports.editPassword = exports.emailVerfication = exports.Login = exports.Register = void 0;
const user_1 = __importDefault(require("../models/user"));
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const google_auth_library_1 = require("google-auth-library");
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import { register } from 'module';
const client = new google_auth_library_1.OAuth2Client();
let errors = {
    email: "",
    password: "",
    username: "",
    token: "",
    internalserver: "",
};
const setError = () => {
    errors = {
        email: "",
        password: "",
        username: "",
        token: "",
        internalserver: ""
    };
};
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log('here');
        const { email, username, name, password, authMode } = req.body;
        const emailExist = yield user_1.default.findOne({ email });
        const usernameExist = yield user_1.default.findOne({ username });
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
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const user = new user_1.default({
            name, username, email, password: hashedPassword, authMode: ['Email']
        });
        const verificationToken = crypto_1.default.randomBytes(20).toString('hex');
        user.emailVerficationToken = crypto_1.default.createHash('sha256').update(verificationToken).digest('hex');
        // console.log(new Date(Date.now() + (24 * 60 * 60 * 1000)));
        user.emailVerificationExpire = Date.now() + (24 * 60 * 60 * 1000);
        yield user.save();
        setError();
        const verificationUrl = `http://localhost:8000/auth/email-verification/${verificationToken}`;
        const message = `<h2>Thank you for registering with us </h2>
            <p> Please click the below button to verify your email </p>
            <button> <a href=${verificationUrl} clicktracking=off> Verify Email </a> </button>
            `;
        yield (0, sendEmail_1.default)({
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
    catch (_a) {
        res.status(500).json({ message: "internal server error" });
    }
});
exports.Register = Register;
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { emailOrUsername, password, authMode } = req.body;
    const emailExist = yield user_1.default.findOne({ email: emailOrUsername });
    const userNameExist = yield user_1.default.findOne({ username: emailOrUsername });
    let user = emailExist || userNameExist;
    setError();
    // if (authMode === 'email') {
    if (emailExist && emailExist.isVerified) {
        const auth = yield bcryptjs_1.default.compare(password, emailExist.password);
        if (auth) {
            if (process.env.JWT_SECRET) {
                const token = jsonwebtoken_1.default.sign({ id: emailExist._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
                return res.status(201).json({ token: token, user: emailExist });
            }
            else {
                console.log('empty jwt secret key');
                return res.status(500).json({ error: "internal server error" });
            }
        }
        else {
            errors.password = "wrong password";
            return res.status(404).json({ errors });
        }
    }
    else if (userNameExist && userNameExist.isVerified) {
        const auth = yield bcryptjs_1.default.compare(password, userNameExist.password);
        if (auth) {
            if (process.env.JWT_SECRET) {
                const token = jsonwebtoken_1.default.sign({ id: userNameExist._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
                return res.status(201).json({ token: token, user: userNameExist });
            }
            else {
                console.log('empty jwt secret key');
                errors.internalserver = "internal server error";
                return res.status(500).json({ errors });
            }
        }
        else {
            errors.password = "wrong password";
            return res.status(404).json({ errors });
        }
    }
    else if ((userNameExist || emailExist) && user && !user.isVerified) {
        errors.email = "email not verified";
        return res.status(404).json({ errors });
    }
    else {
        errors.username = "email or username not found";
        return res.status(404).json({ errors });
    }
    // }
});
exports.Login = Login;
const emailVerfication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    setError();
    const { token } = req.query;
    if (token && typeof token === 'string') {
        const emailVerificationToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
        const user = yield user_1.default.findOne({
            emailVerificationToken,
            emailVerificationExpire: { $gt: Date.now() }
        });
        if (!user) {
            errors.token = "Invalid verification token";
            return res.status(404).json({ errors });
        }
        user.isVerified = true;
        user.emailVerficationToken = "";
        user.emailVerificationExpire = 0;
        yield user.save();
        res.status(200).json({ message: "verified successfully" });
    }
    else {
        errors.token = "empty token";
        return res.status(404).json({ errors });
    }
});
exports.emailVerfication = emailVerfication;
const editPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    setError();
    const { id, password, newPassword } = req.body;
    const user = yield user_1.default.findById(id);
    if (!password) {
        errors.password = "password is required";
        return res.status(404).json({ errors });
    }
    if (!newPassword || newPassword == password) {
        errors.password = "new password is required and can't be same as old password";
        return res.status(404).json({ errors });
    }
    if (!user) {
        errors.email = "invalid user";
        return res.status(404).json({ errors });
    }
    const auth = yield bcryptjs_1.default.compare(password, user.password);
    if (auth) {
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        user.password = hashedPassword;
        yield user.save();
        return res.status(200).json({ message: "Updated successfully", user: user });
    }
    else {
        errors.password = "wrong password";
        return res.status(404).json({ errors });
    }
});
exports.editPassword = editPassword;
// edit user - change password , edit email // similarly we can implement for forget password
// export const
//
// export default {Register,Login};
