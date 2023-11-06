import express, { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { PrismaClient } from '@prisma/client';

// Prisma Client
const prisma = new PrismaClient();

// application Express
const app: Application = express();

//écoute du serveur
const PORT = process.env.PORT || 3000;

// Middleware pour parser les cookies
app.use(cookieParser());

// Middleware pour parser le corps des requêtes JSON
app.use(express.json());

// Configuration de Passport (si vous utilisez des stratégies d'authentification)
// À configurer selon vos besoins...

// Un exemple de route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

// Middleware pour gérer les erreurs
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

// Pour fermer proprement Prisma Client
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
});
