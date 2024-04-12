import { google } from 'googleapis';
import nodemailer from 'nodemailer';

interface Ioptions {
    to:string;
    subject:string;
    html:string;
}

interface AuthOptions {
    type: 'OAuth2';
    user: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    accessToken: string;
}

const sendEmail = async (options : Ioptions) : Promise<any> => {

    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const refresh_token = process.env.REFRESH_TOKEN;
    const redirect_uri = process.env.REDIRECT_URI;

    const oauth2client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
    oauth2client.setCredentials({ refresh_token });
    
    const accessToken = await oauth2client.getAccessToken();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: 'pkraojee2020@gmail.com',
            clientId: client_id,
            clientSecret: client_secret,
            refreshToken: refresh_token,
            accessToken: accessToken,
        } as AuthOptions
    });

    const mailOptions = {
        from: 'pkraojee2020@gmail.com',
        to: options.to,
        subject: options.subject,
        html: options.html
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(info);
        }
    });
}

export default sendEmail;