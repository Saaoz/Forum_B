import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';


const prisma = new PrismaClient();


//RECHERCHE GLOBAL

export const getAllUsers = async (req: Request, res: Response) => {
    console.log("getAllUsers function called");
    try {
        const users = await prisma.user.findMany({});
        res.status(200).json(users);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: "Error in getAllUsers: " + error.message });
        }
    }
};

//RECHERCHE PAR ID 


export const getUserById = async (req: Request, res: Response) => {
    console.log("getUserById function called");
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({ 
            where: { id: Number(id)}
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json("User not found by ID");
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: "Error in getUserById: " + error.message });
        }
    }
};


//RECHERCHE PAR USERNAME

export const getUserByUsername = async (req: Request, res: Response) => {
    console.log("getUserByUsername function called");
    const { username } = req.params;
    
    try {
        const users = await prisma.user.findMany({
            where: {
                AND: [ // AND pour s'assurer que tous les critères sont respectés
                  {
                    username: {
                      contains: username
                    },
                  },
                ],
              },
        });
        if (users.length > 0) {
            res.json(users);
        } else {
            res.status(404).json("No users found with the given username");
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res
                .status(500)
                .json({ error: "Error in getUserByUsernameActive: " + error.message });
        }
    }
};

//BAN EST DEBAN USER PAR ID 

//La fonction de ban est basic la mise en place des logs sera necessaire et donc 
//ajustement pour avoir l'id de l'admin qui la ban
export const banUserById = async (req: Request, res: Response) => {
    console.log("banUserById function called");
    const { id } = req.params;

    try {
        //si l'utilisateur existe
        const existingUser = await prisma.user.findUnique({
            where: { id: Number(id) }
        });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        //si l'utilisateur n'est actuellement pas déjà banni
        if (existingUser.is_banned) {
            return res.status(400).json({ message: "User is already banned" });
        }
        // Si l'utilisateur est trouvé et pas ban , le banni
        const bannedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { is_banned: true }
        });
        res.status(200).json(bannedUser);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: "Error in banUserById: " + error.message });
        }
    }
};

export const debanUserById = async (req: Request, res: Response) => {
    console.log("debanUserById function called");
    const { id } = req.params;

    try {
        //si l'utilisateur existe
        const existingUser = await prisma.user.findUnique({
            where: { id: Number(id) }
        });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        //si l'utilisateur est actuellement banni
        if (!existingUser.is_banned) {
            return res.status(400).json({ message: "User is not banned" });
        }
        // Si l'utilisateur est trouvé et banni, débanne
        const unbannedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { is_banned: false }
        });
        res.status(200).json(unbannedUser);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: "Error in debanUserById: " + error.message });
        }
    }
};


//MODO et UNMOD USER PAR ID 

//La fonction de modo est basic la mise en place des logs sera necessaire et donc 
//ajustement pour avoir l'id de l'admin qui la ban

export const upAdminById = async (req: Request, res: Response) => {
    console.log("upAdminById function called");
    const { id } = req.params;

    try {
        //si l'utilisateur existe
        const existingUser = await prisma.user.findUnique({
            where: { id: Number(id) }
        });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        //si l'utilisateur n'est actuellement pas déjà admin
        if (existingUser.is_admin) {
            return res.status(400).json({ message: "User is already admin" });
        }
        // Si l'utilisateur est trouvé et pas admin , le passe admin
        const adminUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { is_admin: true }
        });
        res.status(200).json(adminUser);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: "Error in upAdminById: " + error.message });
        }
    }
};

export const revokeAdminById = async (req: Request, res: Response) => {
    console.log("revokeAdminById function called");
    const { id } = req.params;

    try {
        //si l'utilisateur existe
        const existingUser = await prisma.user.findUnique({
            where: { id: Number(id) }
        });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        //si l'utilisateur n'est actuellement pas admin
        if (!existingUser.is_admin) {
            return res.status(400).json({ message: "User is not admin" });
        }
        // Si l'utilisateur est trouvé et admin, unadmin
        const unadminUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { is_admin: false }
        });
        res.status(200).json(unadminUser);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: "Error in revokeAdminById: " + error.message });
        }
    }
};


// UPDATE PROFIL CREATE

export const updateUserById = async (req: Request, res: Response) => {
    console.log("updateUserById function called");
    const { id } = req.params;
    const { username, password, avatar, bio } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { id: Number(id) }
        });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found for update" });
        }
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { 
                username: username || existingUser.username,
                password: hashedPassword || existingUser.password,
                avatar: avatar || existingUser.avatar,
                bio: bio || existingUser.bio
            }
        });
        res.status(200).json(updatedUser);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: "Error in updateUserById: " + error.message });
        }
    }
};


//FONCTION BANNED ACCOUNT DONC PASSAGE REPLY EN INACTIVE

//FONCTION DELETE ACCOUNT FROM USER DONC REPLY EN INACTIVE