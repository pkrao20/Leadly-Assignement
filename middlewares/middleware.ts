import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import  User  from '../models/user'; 
import IUser from '../models/user'
declare global {
  namespace Express {
    interface Request {
      user?: any; 
    }
  }
}

export async function verifyTokenMiddleware(req: Request, res: Response, next: NextFunction) {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ errors: { token: 'Not Authorized' } });
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!); 

        const user = await User.findOne({ _id: decoded.id });

        if (!user) {
            return res.status(404).json({ errors: { token: 'User not found' } });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({ errors: { token: 'Invalid token' } });
    }
}
