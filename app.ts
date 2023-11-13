import express, { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import indexRoutes from './Routes/indexRoute';
import passport from './Config/passportConfig';
// const crypto = require('crypto');

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
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

// Configuration de Passport (si vous utilisez des stratégies d'authentification)
// À configurer selon vos besoins...

//Définition dans indexRoute
app.use('/api', indexRoutes);

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


// const generateSecret = () => {
//   return crypto.randomBytes(**).toString('hex');
// };

// const secret = generateSecret();
// console.log(secret);