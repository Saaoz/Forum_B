import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: "Error in getAllUsers: " + error.message });
        }
    }
};

export const getAllActiveUsers = async (req: Request, res: Response) => {
    try {
        const activeUsers = await prisma.user.findMany({
            where: { is_active: true },
        });
        res.status(200).json(activeUsers);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res
                .status(500)
                .json({ error: "Error in getAllActiveUsers: " + error.message });
        }
    }
};

export const getAllInactiveUsers = async (req: Request, res: Response) => {
    try {
        const inactiveUsers = await prisma.user.findMany({
            where: { is_active: false },
        });
        res.status(200).json(inactiveUsers);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res
                .status(500)
                .json({ error: "Error in getAllInactiveUsers: " + error.message });
        }
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({ where: { id: Number(id) } });
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

export const getUserByActiveId = async (req: Request, res: Response) => {
    const { id } = req.params;
    const onlyActive = req.query.active === "true";
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id), ...(onlyActive && { is_active: true }) },
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json("Active user not found by ID");
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res
                .status(500)
                .json({ error: "Error in getUserByActiveId: " + error.message });
        }
    }
};

export const getUserByInactiveId = async (req: Request, res: Response) => {
    const { id } = req.params;
    const onlyInactive = req.query.active === "false";
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id), ...(onlyInactive && { is_active: false }) },
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json("Inactive user not found by ID");
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res
                .status(500)
                .json({ error: "Error in getUserByInactiveId: " + error.message });
        }
    }
};

export const getUserByUsernameActive = async (req: Request, res: Response) => {
    const { username } = req.params;
    const onlyActive = req.query.active === "true";

    try {
        // Construction dynamique de l'objet where
        let whereClause: { username: string; is_active?: boolean } = { username };

        if (onlyActive) {
            whereClause.is_active = true;
        }

        const users = await prisma.user.findMany({
            where: whereClause,
        });

        if (users.length > 0) {
            res.json(users);
        } else {
            res.status(404).json("No active users found with the given username");
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res
                .status(500)
                .json({ error: "Error in getUserByUsernameActive: " + error.message });
        }
    }
};

export const getUserByUsernameInactive = async (req: Request, res: Response) => {
    const { username } = req.params;
    const onlyInactive = req.query.active === "false";

    try {
        // Construction dynamique de l'objet where
        let whereClause: { username: string; is_active?: boolean } = { username };

        if (onlyInactive) {
            whereClause.is_active = false;
        }

        const users = await prisma.user.findMany({
            where: whereClause,
        });

        if (users.length > 0) {
            res.json(users);
        } else {
            res.status(404).json("No inactive users found with the given username");
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res
                .status(500)
                .json({ error: "Error in getUserByUsernameInactive: " + error.message });
        }
    }
};

export const getUserByUsername = async (req: Request, res: Response) => {
    const { username } = req.params;

    try {
        // Construction dynamique de l'objet where
        let whereClause: { username: string; } = { username };

        const users = await prisma.user.findMany({
            where: whereClause,
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
                .json({ error: "Error in getUserByUsername: " + error.message });
        }
    }
};