import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import passport from '../Config/passportConfig';
import { User } from '@prisma/client';

export const loginUser = (req: Request, res: Response) => {
    passport.authenticate('local', { session: false }, (err: Error | null, user: User | false, info: { message: string}) => {
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user   : user
            });
        }

        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }

            const token = jwt.sign(user, 'your_jwt_secret');
            return res.json({ user, token });
        });
    })(req, res);
};
