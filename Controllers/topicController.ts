import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Joi, { any, bool, boolean, number, string } from "joi";

const prisma = new PrismaClient();

//getAllTopic avec filtre

export const getAllTopics = async (req: Request, res: Response) => {
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
  const { is_active } = req.body;
  const { searchTerm } = req.params;

  try {
    const topics = await prisma.topic.findMany({
      where: {
        AND: [ // AND pour s'assurer que tous les critères sont respectés
          {
            title: {
              contains: searchTerm as string},
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
      // where: {
      //     AND:[
      //         {
      //             createdBy: parseInt(createdBy),
      //         },
      //         {
      //             is_active,
      //         }

      //     ]

      // }
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

//createTopic

export const createTopic = async (req: Request, res: Response) => {
  const blueprint = Joi.object({
    title: Joi.string().alphanum().min(3).max(30).required(),
    description: Joi.string().optional(),
    createdBy: Joi.number().required(),
    categoryId: Joi.number().required(),
    is_active: Joi.boolean().required(),
  });

  const { error, value } = blueprint.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { title, description, createdBy, categoryId, is_active } = value;

  try {
    // Vérification de l'existence de l'utilisateur et de la catégorie
    const existingUser = await prisma.user.findUnique({
      where: { id: createdBy },
    });
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "User doesn't exist with this id " });
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!existingCategory) {
      return res
        .status(400)
        .json({ message: "Category doesn't exist with this id " });
    }

    // Recherche d'un topic existant avec le même titre
    const existingTopic = await prisma.topic.findFirst({
      where: {
        title: title,
        categoryId: categoryId, // S'assurer que le titre est unique dans la même catégorie
      },
    });
    if (existingTopic) {
      return res.status(400).json({ message: "Title already used in this category." });
    }
    let topicData: any = {
      title: string,
      description: string,
      createdBy: number,
      categoryId: number,
      is_active: boolean,
    };
    if (description) {
      topicData.description = description;
    }

    // Création du topic
    const newTopic = await prisma.topic.create({
      data: topicData,
    });
    res.status(201).json(newTopic);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Error in createTopic: " + error.message });
    } else {
      res
        .status(500)
        .json({ error: "An unknown error occurred in createTopic" });
    }
  }
};

//updateTopic

export const updateTopicById = async (req: Request, res:Response) => {
  const { id } = req.params;
  const { title, description, is_active } = req.body

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
        title: title || existingTopic.title,
        description: description || existingTopic.description,
        is_active: is_active || existingTopic.is_active,
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
