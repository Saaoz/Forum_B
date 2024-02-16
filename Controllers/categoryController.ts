import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Joi, { boolean, string } from "joi";

const prisma = new PrismaClient();

//getAllCategory

export const getAllCategory = async (req: Request, res: Response) => {
  // console.log("getAllCategory function called");
  const { is_active } = req.body;
  // console.log(is_active);
  try {
    const Category = await prisma.category.findMany({
      where: { is_active },
    });
    res.status(200).json(Category);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Error in getAllCategory: " + error.message });
    }
  }
};

//getCategoryById

export const getCategoryById = async (req: Request, res: Response) => {
  // console.log("getCategoryById function called");
  const { is_active } = req.body;
  const { id } = req.params;
  // console.log(typeof is_active)
  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(id), is_active },
    });
    if (category) {
      res.json(category);
    } else {
      res.status(404).json("category not found by ID");
    }
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Error in getCategoryById: " + error.message });
    }
  }
};

//recherche category by name

export const getCategoryByName = async (req: Request, res: Response) => {
  // console.log("getCategoryByName function called");
  const { name } = req.params;

  try {
    const categories = await prisma.category.findMany({
      where: {
        name: {
          contains: name,
        },
        is_active: true, 
      },
    });

    if (categories.length > 0) {
      res.json(categories);
    } else {
      res.status(404).json({ message: "No active categories found with the given name" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Error in getCategoryByName: " + error.message });
    }
  }
};

// CREATE PROFIL

export const createCategory = async (req: Request, res: Response) => {
  // console.log("createCategory function called");
  // Schéma de validation Joi
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    description: Joi.string().optional(),
  });
  const { error, value } = schema.validate(req.body);

  // Si la validation échoue, renvoyez une erreur
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { name, is_active, description } = value;
  try {
    // Vérifier l'unicité du name
    const existingCategoryByName = await prisma.category.findUnique({
      where: { name, is_active },
    });
    if (existingCategoryByName) {
      return res.status(400).json({ message: "Name already in use" });
    }
    // Préparer l'objet de données pour la création de category
    let categoryData: any = {
      name,
      description
    };
    // Ajouter description seulement s'il est fournis
    if (description) {
      categoryData.description = description;
    }
    // Créer la category
    const newCategory = await prisma.category.create({
      data: categoryData,
    });
    res.status(201).json(newCategory);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Error in createCategory: " + error.message });
    } else {
      res
        .status(500)
        .json({ error: "An unknown error occurred in createCategory" });
    }
  }
};

//updateCategoryById

export const updateCategoryById = async (req: Request, res: Response) => {
  // console.log("updateCategoryById function called");
  const { id } = req.params;
  const { name, description, is_active } = req.body;

  try {
    const existingCategory = await prisma.category.findUnique({
      where: { id: Number(id) },
    });
    if (!existingCategory) {
      return res.status(404).json({ message: "User not found for update" });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: {
        name: name || existingCategory.name,
        description: description || existingCategory.description,
        is_active: is_active || existingCategory.is_active,
      },
    });
    res.status(200).json(updatedCategory);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Error in updateCategoryById: " + error.message });
    }
  }
};

//active inactive Category

export const toggleCategoryActiveState = async (req: Request,res: Response) => {
  // console.log("toggleCategoryActiveState function called");
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
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: "Error in toggleCategoryActiveState: " + error.message,
      });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};
