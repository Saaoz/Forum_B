//  user controller

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();



export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error:"Erreur lors de la récupération getAllUsers" })
    }
}

export const getAllActiveUsers = async (req: Request, res: Response) => {
    try{
        const activeUsers = await prisma.user.findMany({
            where: {
                is_active: true
            }
        });
        res.status(200).json(activeUsers);
    } catch (error) {
        res.status(500).json({ error:"Erreur lors de la récupération getAllActiveUsers"})
    }
}

export const getAllInactiveUsers = async (req: Request, res: Response) => {
    try{
        const inactiveUsers = await prisma.user.findMany({
            where: {
                is_active: false
            }
        });
        res.status(200).json(inactiveUsers);
    } catch (error) {
        res.status(500).json({ error:"Erreur lors de la récupération getAllInactiveUsers"})
    }
}

export const getUserById = async (req: Request, res: Response) => {
    const {id} = req.params;

    try{
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json('le user nexiste pas byid')
        }
    } catch (error: unknown) { // Spécifier que l'erreur peut être de type inconnu
        if (error instanceof Error) { // Vérifier que l'erreur est une instance de Error
            res.status(500).send(error.message);
        } else {
            // Si ce n'est pas une instance d'erreur, un message générique
            res.status(500).send('Erreur lors de la recherche user by id');
        }
    }
}

export const getUserByActiveId = async (req: Request, res:Response) => {
    const { id } = req.params;
    const onlyActive = req.query.active === 'true'; // add request param pour filter les actifs

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id),
                ...(onlyActive && { is_active:true}), // conditionnllement add after vérif active
            },
        });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json('user active introuvable')
        }
    } catch (error: unknown) { 
        if (error instanceof Error) { 
            res.status(500).send(error.message);
        } else {
            
            res.status(500).send('Erreur lors de la recherche user active by id');
        }
    }
}

export const getUserByInactiveId = async (req: Request, res:Response) => {
    const { id } = req.params;
    const onlyInactive = req.query.active === 'false'; // add request param pour filter les actifs

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id),
                ...(onlyInactive && { is_active:false}), // conditionnellement add after vérif active
            },
        });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json('user inactive introuvable')
        }
    } catch (error: unknown) { 
        if (error instanceof Error) { 
            res.status(500).send(error.message);
        } else {
            
            res.status(500).send('Erreur lors de la recherche user inactive by id');
        }
    }
}