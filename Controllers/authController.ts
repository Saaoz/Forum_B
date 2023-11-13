import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { User } from '@prisma/client'; 
import { DecodedToken } from '../Config/types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallbackSecret';


export const loginUser = (req: Request, res: Response) => {
    passport.authenticate('local', { session: false }, (err: Error | null, user: User | false, info: { message: string }) => {
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
            });
        }
        
// Générer le token JWT
            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

// Définir le token dans un cookie HttpOnly
        res.cookie('jwt', token, {
            httpOnly: true,
            //secure en HTTPS only
            maxAge: 3600000 // Durée de vie du cookie (en millisecondes) 1h
        });

        return res.status(200).send('Login successful');
    })(req, res);
};

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, JWT_SECRET, (err: Error | null, decoded: any) => { 
            if (err) {
                return res.status(401).send('Unauthorized');
            }

            if (decoded) {
                
                const decodedToken: DecodedToken = decoded as DecodedToken;
                req.user = decodedToken;
                next();
            } else {
                res.status(401).send('Invalid token');
            }
        });
    } else {
        res.status(401).send('No token provided');
    }
};