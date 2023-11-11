import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { User } from '@prisma/client'; 

const JWT_SECRET = process.env.JWT_SECRET || 'fallbackSecret';
const expiresIn = '1h';

export const loginUser = (req: Request, res: Response) => {
    passport.authenticate('local', { session: false }, (err: Error | null, user: User | false, info: { message: string }) => {
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
            });
        }

        // informations de l'utilisateur à inclure dans le JWT
        const tokenPayload = { id: user.id, email: user.email };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn });

        return res.json({ user, token });
    })(req, res);
};

