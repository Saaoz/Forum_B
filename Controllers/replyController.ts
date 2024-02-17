import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Joi, { boolean, number, string } from "joi";

const prisma = new PrismaClient();

//getAllReply

export const getAllReply = async (req: Request, res: Response) => {
  // console.log("getAllReply function called");
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

export const getAllReplyFromTopicTitle = async (req: Request,res: Response) => {
  // console.log("getAllReplyFromTopicTitle function called");
  const { title } = req.params;

  try {
    const existingTopicFromTitle = await prisma.topic.findMany({
      where: { title },
    });
    if (!existingTopicFromTitle) {
      return res
        .status(400)
        .json({ message: "Topic with this title was not found" });
    }
    
    const Reply = await prisma.reply.findMany({
      where: {
        topic: { title },
        is_active: Boolean(true)
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
  // console.log("getAllReplyFromTopicId function called");
  const { topicId } = req.params;

  try {

    const existingTopic = await prisma.topic.findUnique({
      where: { id: Number(topicId) },
    });

    if (!existingTopic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const reply = await prisma.reply.findMany({
      where: {
        topicId: Number(topicId),
        is_active: Boolean(true),
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
  // console.log("getAllReplyFromUserId function called");
  const { createdBy } = req.params;
  const { is_active } = req.body;


  try {
    // Vérifier si le topic existe
    const existingTopic = await prisma.user.findUnique({
      where: { id: Number(createdBy) },
    });

    if (!existingTopic) {
      return res.status(404).json({ message: "User not found" });
    }

    // Rechercher les réponses liées au topic
    const reply = await prisma.reply.findMany({
      where: {
        topicId: Number(createdBy),
        is_active: Boolean(true)
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
  // console.log("createReplyForTopic function called");
  const { topicId } = req.params;

  const schema = Joi.object({
    content: Joi.string().required(),
    createdBy: Joi.number().required(),
  });
  const { error, value } = schema.validate(req.body);

  // Si la validation échoue, renvoyez une erreur
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { content, createdBy } = value;

  try {

    const existingUser = await prisma.user.findUnique({
      where: { id: Number(createdBy) }
    });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found for createReplyForTopic" });
    }

    const existingTopic = await prisma.topic.findUnique({
      where: { id: Number(topicId) }
    });
    if (!existingTopic) {
      return res.status(400).json({ message: "Topic not found for createReplyForTopic" });
    }

    let ReplyData: any = {
      content,
      createdBy,
      topicId: Number(topicId)
    };

    console.log(ReplyData)

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
  // console.log("updateReply function called");
  const { id } = req.params;
  const { content } = req.body;

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
  // console.log("toggleReplyActiveState function called");
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