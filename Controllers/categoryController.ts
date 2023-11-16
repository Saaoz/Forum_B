import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Joi, { boolean, string } from 'joi';


const prisma = new PrismaClient();



//getAllCategory

export const getAllCategory = async (req: Request, res: Response) => {
    try {
        const Category = await prisma.category.findMany();
        res.status(200).json(Category);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: "Error in getAllCategory: " + error.message });
        }
    }
};

//getActiveCategory

export const getAllActiveCategory = async (req: Request, res: Response) => {
    try {
        const activeCategory = await prisma.category.findMany({
            where: { is_active: true },
        });
        res.status(200).json(activeCategory);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res
                .status(500)
                .json({ error: "Error in getAllActiveCategory: " + error.message });
        }
    }
};

//getInactiveCategory

export const getAllInactiveCategory = async (req: Request, res: Response) => {
    try {
        const inactiveCategory = await prisma.category.findMany({
            where: { is_active: false },
        });
        res.status(200).json(inactiveCategory);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res
                .status(500)
                .json({ error: "Error in getAllInactiveCategory: " + error.message });
        }
    }
};

//getCategoryById

export const getCategoryById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const category = await prisma.category.findUnique({ where: { id: Number(id) } });
        if (category) {
            res.json(category);
        } else {
            res.status(404).json("category not found by ID");
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: "Error in getCategoryById: " + error.message });
        }
    }
};

//getActiveCategoryById

export const getActiveCategoryById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const onlyActive = req.query.active === "true";
    try {
        const category = await prisma.category.findUnique({
            where: { id: Number(id), ...(onlyActive && { is_active: true }) },
        });
        if (category) {
            res.json(category);
        } else {
            res.status(404).json("Active category not found by ID");
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res
                .status(500)
                .json({ error: "Error in getActiveCategoryById: " + error.message });
        }
    }
};

//getInactiveCategoryById

export const getInactiveCategoryById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const onlyInactive = req.query.active === "false";
    try {
        const category = await prisma.category.findUnique({
            where: { id: Number(id), ...(onlyInactive && { is_active: false }) },
        });
        if (category) {
            res.json(category);
        } else {
            res.status(404).json("Inactive category not found by ID");
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res
                .status(500)
                .json({ error: "Error in getInactiveCategoryById: " + error.message });
        }
    }
};

//recherche category by name 

export const getCategoryByName = async (req: Request, res: Response) => {
    const { name } = req.params;

    try {
        // Construction dynamique de l'objet where
        let whereClause: { name: string; } = { name };

        const category = await prisma.category.findMany({
            where: whereClause,
        });

        if (category.length > 0) {
            res.json(category);
        } else {
            res.status(404).json("No category found with the given name");
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res
                .status(500)
                .json({ error: "Error in getCategoryByName: " + error.message });
        }
    }
};



//RECHERCHE category by name active

export const getCategoryBynameActive = async (req: Request, res: Response) => {
    const { name } = req.params;
    const onlyActive = req.query.active === "true";

    try {
        // Construction dynamique de l'objet where
        let whereClause: { name: string; is_active?: boolean } = { name };

        if (onlyActive) {
            whereClause.is_active = true;
        }

        const category = await prisma.category.findMany({
            where: whereClause,
        });

        if (category.length > 0) {
            res.json(category);
        } else {
            res.status(404).json("No active category found with the given name");
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res
                .status(500)
                .json({ error: "Error in getCategoryBynameActive: " + error.message });
        }
    }
};

//RECHERCHE category by name inactive

export const getCategoryBynameInactive = async (req: Request, res: Response) => {
    const { name } = req.params;
    const onlyInactive = req.query.active === "false";

    try {
        // Construction dynamique de l'objet where
        let whereClause: { name: string; is_active?: boolean } = { name };

        if (onlyInactive) {
            whereClause.is_active = false;
        }

        const category = await prisma.category.findMany({
            where: whereClause,
        });

        if (category.length > 0) {
            res.json(category);
        } else {
            res.status(404).json("No inactive category found with the given name");
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res
                .status(500)
                .json({ error: "Error in getCategoryBynameInactive: " + error.message });
        }
    }
};


//createCategory

// CREATE PROFIL

export const createCategory = async (req: Request, res: Response) => {
    // Schéma de validation Joi
    const schema = Joi.object({
        name: Joi.string().alphanum().min(3).max(30).required(),
        is_active: Joi.boolean().required(),
        description: Joi.string().uri().optional(),
    });
    const { error, value } = schema.validate(req.body);

    // Si la validation échoue, renvoyez une erreur
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { name, is_active, description } = value;
    try {
        // Vérifier l'unicité du name
        const existingCategoryByName = await prisma.category.findUnique({ where: { name } });
        if (existingCategoryByName) {
            return res.status(400).json({ message: "Name already in use" });
        }
        // Hacher le mot de passe
        
        // Préparer l'objet de données pour la création de category
        let categoryData: any = {
            name: string,
            description : string,
            is_active: boolean ,
        };
        // Ajouter description seulement s'il est fournis
        if (description) {
            categoryData.description = description;
        }
        // Créer la category
        const newCategory = await prisma.category.create({
            data: categoryData
        });
        res.status(201).json(newCategory);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: "Error in createCategory: " + error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred in createCategory" });
        }
    }
};

//updateCategoryById

export const updateCategoryById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, is_active } = req.body;

    try {
        const existingCategory = await prisma.category.findUnique({
            where: { id: Number(id) }
        });
        if (!existingCategory) {
            return res.status(404).json({ message: "User not found for update" });
        }
        
        const updatedCategory = await prisma.category.update({
            where: { id: Number(id) },
            data: { 
                name: name || existingCategory.name,
                description: description || existingCategory.description,
                is_active: is_active  || existingCategory.is_active,
                
            }
        });
        res.status(200).json(updatedCategory);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: "Error in updateCategoryById: " + error.message });
        }
    }
};

//desactivateCategory

// export const deactivateCategory = async (req: Request, res: Response) => {
//     const { categoryId } = req.params;

//     try {
//         // Désactiver la catégorie
//         const updatedCategory = await prisma.category.update({
//             where: { id: Number(categoryId) },
//             data: { is_active: false },
//         });

//         // Désactiver tous les topics associés
//         await prisma.topic.updateMany({
//             where: { categoryId: Number(categoryId) },
//             data: { is_active: false },
//         });

//         res.status(200).json(updatedCategory);
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             res
//                 .status(500)
//                 .json({ error: "Error in deactivateCategory: " + error.message });
//         }
//     }
// };

//activeCategory

export const toggleCategoryActiveState = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Récupérer l'état actuel de la catégorie
        const category = await prisma.category.findUnique({
            where: { id: Number(id) },
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Inverser l'état 'is_active' de la catégorie
        const updatedCategory = await prisma.category.update({
            where: { id: Number(id) },
            data: { is_active: !category.is_active },
        });

        // Mettre à jour l'état 'is_active' de tous les topics liés
        await prisma.topic.updateMany({
            where: { id: Number(id) },
            data: { is_active: !category.is_active },
        });

        res.status(200).json(updatedCategory);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: "Error in toggleCategoryActiveState: " + error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};