import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Joi, { boolean, number, string } from "joi";

const prisma = new PrismaClient();

//PATERN

// export const SSSS = async (req: Request, res:Response) =>{
//     const {  } = req.body
//     try{

//     res.status(200).json();
//     } catch (error) {
//         if (error instanceof Error) {
//           res
//             .status(500)
//             .json({ error: "Error in : " + error.message });
//         }
//       }
// }

//getAllReply

export const getAllReply = async (req: Request, res: Response) => {
  const { is_active } = req.body;
  try {
    const Reply = await prisma.reply.findMany({
      where: { is_active },
    });

    res.status(200).json(Reply);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Error in getAllReply: " + error.message });
    }
  }
};

//getAllReplyFromTopicTitle

export const getAllReplyFromTopicTitle = async (
  req: Request,
  res: Response
) => {
  const { is_active } = req.body;
  const { title } = req.params;
  try {
    const existingTopicFromTitle = await prisma.topic.findUnique({
      where: { title },
    });
    if (!existingTopicFromTitle) {
      return res
        .status(400)
        .json({ message: "Topic with this title was not found" });
    }

    const Reply = await prisma.reply.findMany({
      where: {
        is_active,
        topic: { title },
      },
    });
    res.status(200).json(Reply);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({
          error: "Error in getAllReplyFromTopicTitle: " + error.message,
        });
    }
  }
};

//getAllReplyFromTopicId

export const getAllReplyFromTopicId = async (req: Request, res: Response) => {
  const { is_active } = req.body;
  const { topicId } = req.params;

  // Convertir topicId en nombre
  const topicIdNumber = parseInt(topicId, 10);
  if (isNaN(topicIdNumber)) {
    return res.status(400).json({ message: "Invalid topic ID" });
  }

  try {
    // Vérifier si le topic existe
    const existingTopic = await prisma.topic.findUnique({
      where: { id: topicIdNumber },
    });

    if (!existingTopic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    // Rechercher les réponses liées au topic
    const reply = await prisma.reply.findMany({
      where: {
        topicId: topicIdNumber,
        is_active,
      },
    });

    if (reply.length === 0) {
      return res
        .status(404)
        .json({ message: "No reply found for this topic ID" });
    }

    res.status(200).json(reply);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Error in getAllReplyFromTopicId: " + error.message });
    }
  }
};

//getAllReplyFromUserId

export const getAllReplyFromUserId = async (req: Request, res: Response) => {
  const { is_active } = req.body;
  const { createdBy } = req.params;

  const createdByNumber = parseInt(createdBy, 10);
  if (isNaN(createdByNumber)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  try {
    // Vérifier si le topic existe
    const existingTopic = await prisma.user.findUnique({
      where: { id: createdByNumber },
    });

    if (!existingTopic) {
      return res.status(404).json({ message: "User not found" });
    }

    // Rechercher les réponses liées au topic
    const reply = await prisma.reply.findMany({
      where: {
        topicId: createdByNumber,
        is_active,
      },
    });
    if (reply.length === 0) {
      return res
        .status(404)
        .json({ message: "No reply found for this user ID" });
    }

    res.status(200).json(reply);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Error in getAllReplyFromUserId: " + error.message });
    }
  }
};

//getAllReplyFromUsername STANDBY

// export const getAllReplyFromUsername = async (req: Request, res:Response) =>{
//     const {} = req.body

//     try{

//     res.status(200).json();
//     } catch (error) {
//         if (error instanceof Error) {
//           res
//             .status(500)
//             .json({ error: "Error in getAllReplyFromUsername: " + error.message });
//         }
//       }
// }

//createReplyForTopic

export const createReplyForTopic = async (req: Request, res: Response) => {
  const schema = Joi.object({
    content: Joi.string().uri().required(),
    createdBy: Joi.number().required(),
    topicId: Joi.number().required(),
    is_active: Joi.boolean().required(),
    dateCreated: Joi.date().required(),
  });
  const { error, value } = schema.validate(req.body);

  // Si la validation échoue, renvoyez une erreur
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { content, createdBy, topicId, is_active, dateCreated } = value;

  //conversion createdBy number
  const createdByNumber = parseInt(createdBy, 10);
  if (isNaN(createdByNumber)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  //conversion topicId number
  const topicIdNumber = parseInt(topicId, 10);
  if (isNaN(createdByNumber)) {
    return res.status(400).json({ message: "Invalid topic ID" });
  }

  try {
    //vérifié user existe (utiliser  une constante cratedbynumber
    //pour convertir en number et donc utiliser createdBy dans id de la table user)
    const existingUser = await prisma.user.findUnique({
      where: { id: createdByNumber, is_active },
    });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    //check Topic exite
    const existingTopic = await prisma.topic.findUnique({
      where: { id: topicIdNumber, is_active },
    });
    if (!existingTopic) {
      return res.status(400).json({ message: "Topic not found" });
    }

    //prépa objet données pour créa

    let ReplyData: any = {
      content: string,
      createdBy: number,
      topicId: number,
      is_active: boolean,
      dateCreated: string,
    };

    const newReply = await prisma.reply.create({
      data: ReplyData,
    });
    res.status(201).json(newReply);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Error in createReplyForTopic: " + error.message });
    } else {
      res
        .status(500)
        .json({ error: "An unknown error occurred in createReplyForTopic" });
    }
  }
};

//updateReply

export const updateReply = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, is_active } = req.body;

  try {
    const existingReply = await prisma.reply.findUnique({
      where: { id: Number(id) },
    });
    if (!existingReply) {
      return res.status(400).json({ message: "Reply not found for update" });
    }

    const updatedReply = await prisma.reply.update({
      where: { id: Number(id) },
      data: {
        content: content || existingReply.content,
        is_active: is_active || existingReply.is_active,
      },
    });
    res.status(200).json(updatedReply);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Error in updateReply: " + error.message });
    }
  }
};

//toggleReplyActiveState

export const toggleReplyActiveState = async (req: Request, res: Response) => {

  const { id } = req.params;

  try {
    const reply = await prisma.reply.findUnique({
      where: { id: Number(id) },
    });

    if (!reply) {
      return res.status(400).json({ message: "Reply not found" })
    }
    
    const updatedReply = await prisma.reply.update({
      where: { id: Number(id) },
      data: { is_active: !reply.is_active }
    })
    res.status(200).json(updatedReply)
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({
          error: "Error in toggleReplyActiveState: " + error.message,
        });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};


//ADD FONCTION RENDRE TOUT INACTIVE POUR UN USER A ADD