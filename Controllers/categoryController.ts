import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();



//getAllCategory

//getActiveCategory

//getInactiveCategory

//getCategoryById

//getActiveCategoryById

//getInactiveCategoryById

//createCategory

//updateCategoryById

//desactivateCategory

// export const deactivateCategory = async (req: Request, res: Response) => {
//     const { categoryId } = req.params;

//     try {
//         // Désactiver la catégorie
//         const updatedCategory = await prisma.category.update({
//             where: { id: Number(categoryId) },
//             data: { isActive: false },
//         });

//         // Désactiver tous les topics associés
//         await prisma.topic.updateMany({
//             where: { categoryId: Number(categoryId) },
//             data: { isActive: false },
//         });

//         res.status(200).json(updatedCategory);
//     } catch (error: unknown) {
//         // Gestion des erreurs...
//     }
// };

//activeCategory