import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedToken } from '../Config/types';
import bcrypt from 'bcrypt';
import Joi from "joi";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'fallbackSecret';


export const createUser = async (req: Request, res: Response) => {
    // console.log("createUser function called");
    // Schéma de validation Joi
    const schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'fr'] } }).required(),
        avatar: Joi.string().uri().optional(),
        bio: Joi.string().optional()
    });
    const { error, value } = schema.validate(req.body);

    
    // Si la validation échoue, renvoyez une erreur
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { username, password, email, avatar, bio } = value;
    try {
        // Vérifier l'unicité de l'email et du nom d'utilisateur
        const existingUserByEmail = await prisma.user.findUnique({ where: { email } });
        if (existingUserByEmail) {
            return res.status(400).json({ message: "Email already in use" });
        }
        const existingUserByUsername = await prisma.user.findUnique({ where: { username } });
        if (existingUserByUsername) {
            return res.status(400).json({ message: "Username already in use" });
        }
        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        // Préparer l'objet de données pour la création de l'utilisateur
        let userData: any = {
            username,
            email,
            password: hashedPassword
        };
        // Ajouter avatar et bio seulement s'ils sont fournis
        if (avatar) {
            userData.avatar = avatar;
        }
        if (bio) {
            userData.bio = bio;
        }
        // Créer l'utilisateur
        const newUser = await prisma.user.create({
            data: userData
        });
        res.status(201).json(newUser);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: "Error in createUser" + error.message })
          }
        }
      };

export const loginUser = async (req: Request, res: Response) => {
    // console.log("loginUser function called")
    const { username, password } = req.body;

    try{
        const user = await prisma.user.findUnique({
            where: {username},
        });

        if (!user) {
            return res.status(400).json({ message: "Incorrect username or password" })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json({ message: "Incorrect username or password" })
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 3600000, //1h
        });
        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: "Error in loginUser" + error.message });
        }
    }

};

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    // console.log("loginUser function called")
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