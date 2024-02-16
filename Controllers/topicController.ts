import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Joi, { any, bool, boolean, number, string } from "joi";

const prisma = new PrismaClient();

//getAllTopic avec filtre

export const getAllTopics = async (req: Request, res: Response) => {
  // console.log("getAllTopics function called");
  const { is_active } = req.body;
  try {
    const topics = await prisma.topic.findMany({
      where: { is_active },
    });
    res.status(200).json(topics);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Error in GetAllTopics" + error.message });
    }
  }
};

//getTopicById avec filtre

export const getTopicsById = async (req: Request, res: Response) => {
// console.log("getTopicsById function called");
  const { is_active } = req.body;
  const { id } = req.params;
  try {
    const topics = await prisma.topic.findUnique({
      where: { id: Number(id), is_active },
    });
    if (topics) {
      res.json(topics);
    } else {
      res.status(404).json("topics not found by ID");
    }
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Error in getTopicById: " + error.message });
    }
  }
};

//getAllTopicByTitle avec filtre

export const getAllTopicByTitle = async (req: Request, res: Response) => {
  // console.log("getAllTopicByTitle function called");
  const { is_active } = req.body;
  const { title } = req.params;

  try {
    const topics = await prisma.topic.findMany({
      where: {
        AND: [ // AND pour s'assurer que tous les critères sont respectés
          {
            title: {
              contains: title
            },
          },
          {
            is_active: is_active, 
          },
        ],
      },
    });

    if (topics.length > 0) {
      res.json(topics);
    } else {
      res.status(404).json("No active topics found with the given title");
    }
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Error in getAllTopicByTitle: " + error.message });
    }
  }
};

//getAllTopicByCategoryId avec filtre

export const getAllTopicByCategoryId = async (req: Request, res: Response) => {
  // console.log("getAllTopicByCategoryId function called");
  const { categoryId } = req.params;
  const { is_active } = req.body;

  try {
    // Convertir categoryId en nombre et vérifier si la catégorie existe
    const categoryExists = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) },
    });

    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    const topics = await prisma.topic.findMany({
      where: {
        categoryId: parseInt(categoryId),
        is_active,
      },
    });

    if (!topics) {
      return res.status(404).json("No topics found for the given category");
    }
    return res.json(topics);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Error in getAllTopicByCategoryId: " + error.message });
    }
  }
};

//getAllTopicByCreatedId

export const getAllTopicByCreatedId = async (req: Request, res: Response) => {
  // console.log("getAllTopicByCreatedId function called");
  const { createdBy } = req.params;
  const { is_active } = req.body;
  try {
    // Convertir categoryId en nombre et vérifier si la catégorie existe
    const categoryExists = await prisma.user.findUnique({
      where: { id: parseInt(createdBy) },
    });

    if (!categoryExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const topics = await prisma.topic.findMany({
      where: {
        createdBy: parseInt(createdBy),
        is_active,
      },
    });

    if (!topics) {
      return res.status(404).json("No topics found for the given category");
    }
    return res.json(topics);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Error in getAllTopicByCreatedId: " + error.message });
    }
  }
};

// createTopic

export const createTopic = async (req: Request, res: Response) => {
  // console.log("createTopic function called");
  const blueprint = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    description: Joi.string().optional(),
    createdBy: Joi.number().required(),
    categoryId: Joi.number().required(),
    is_active: Joi.boolean().required(),
  });

  const { error, value } = blueprint.validate(req.body);

  if (error) {
    console.log("Validation error:", error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }

  const { title, description, createdBy, categoryId, is_active } = value;

  console.log("Request to create topic with:", value); // Affichage des valeurs reçues pour vérification

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: createdBy },
    });

    console.log("Existing user:", existingUser); // Confirmation de la récupération de l'utilisateur

    if (!existingUser) {
      console.log("No user found with id:", createdBy);
      return res.status(400).json({ message: "User doesn't exist with this id." });
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    console.log("Existing category:", existingCategory); // Confirmation de la récupération de la catégorie

    if (!existingCategory) {
      console.log("No category found with id:", categoryId);
      return res.status(400).json({ message: "Category doesn't exist with this id." });
    }

    const existingTopic = await prisma.topic.findFirst({
      where: {
        title,
        categoryId, // Assure que le titre est unique dans la catégorie spécifiée
      },
    });

    console.log("Existing topic with the same title in this category:", existingTopic); // Vérification de l'unicité du titre dans la catégorie

    if (existingTopic) {
      return res.status(400).json({ message: "Title already used in this category." });
    }

    // Ajout de la date de création actuelle au topicData
    const topicData: any = {
      title,
      description,
      createdBy,
      categoryId,
      is_active
    };

    const newTopic = await prisma.topic.create({
      data: topicData,
    });

    console.log("New topic created:", newTopic); // Confirmation de la création du topic

    res.status(201).json(newTopic);
  } catch (error) {
    if (error instanceof Error) {
    console.error("Error in createTopic:", error); // Affichage de l'erreur
    res.status(500).json({ error: "Error in createTopic: " + error.message });
  }
}
};


//updateTopic

export const updateTopicById = async (req: Request, res:Response) => {
  // console.log("updateTopicById function called");
  const { id } = req.params;
  const { title, description, is_active, is_pinned, is_closed } = req.body

  try {
    const existingTopic = await prisma.topic.findUnique({
      where: { id: Number(id) }
    });
    if (!existingTopic){
      return res.status(400).json({ message: "Topic not found for updateTopicById" });
    }

    const updatedTopic = await prisma.topic.update({
      where: { id: Number(id) },
      data: {
        title: title !==undefined ? title : existingTopic.title,
        description: description !==undefined ? description: existingTopic.description,
        is_active: is_active !==undefined ? is_active: existingTopic.is_active,
        is_pinned: is_pinned !==undefined ? is_pinned: existingTopic.is_pinned,
        is_closed: is_closed !==undefined ? is_closed: existingTopic.is_closed,
      },
    });
    res.status(200).json(updatedTopic);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Error in updateTopicById" + error.message })
    }
  }
};


//Nombre Total de Réponses par Topic

// export const getReplyCountByTopic = async (id: number) => {
//     const replyCount = await prisma.reply.count({
//         where: { id: Number(id) }
//     });
//     return replyCount;
// };

// //Topics les Plus Commentés

// export const getMostCommentedTopics = async () => {
//     const topics = await prisma.topic.findMany({
//         orderBy: {
//             replies: {
//                 _count: 'desc'
//             }
//         },
//         take: 10 // Les 10 topics les plus commentés
//     });
//     return topics;
// };

// //Statistiques sur les Utilisateurs Actifs
//Topic reply (point faire une base de 50 point avec point a gagner sur réponse ou recommendation)

// export const getTopContributors = async () => {
//     const users = await prisma.user.findMany({
//         orderBy: {
//             topics: {
//                 _count: 'desc'
//             }
//         },
//         take: 10 // Les 10 utilisateurs les plus actifs
//     });
//     return users;
// };

//Tendances des Topics au Fil du Temps

// export const getTopicTrends = async (dateRange: DateRange) => {
//     const topics = await prisma.topic.findMany({
//         where: {
//             dateCreated: {
//                 gte: dateRange.start,
//                 lte: dateRange.end
//             }
//         },
//         orderBy: {
//             dateCreated: 'asc'
//         }
//     });
//     return topics;
// };

//Topics Récemment Actifs

// export const getRecentlyActiveTopics = async () => {
//     const topics = await prisma.topic.findMany({
//         where: {
//             replies: {
//                 some: {
//                     dateCreated: {
//                         gte: new Date(new Date().setDate(new Date().getDate() - 7)) // Topics actifs dans les 7 derniers jours
//                     }
//                 }
//             }
//         },
//         orderBy: {
//             replies: {
//                 dateCreated: 'desc'
//             }
//         },
//         take: 10
//     });
//     return topics;
// };
