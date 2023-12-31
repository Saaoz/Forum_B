import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Joi, { string } from "joi";

const prisma = new PrismaClient();

//getAllTag

export const getAllTag = async (req: Request, res: Response) => {
  try {
    const Tag = await prisma.tag.findMany({});

    res.status(200).json(Tag);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Error in getAllTag: " + error.message });
    }
  }
};

// getAllTagFromTopic

export const getAllTagFromTopic = async (req: Request, res: Response) => {
  const { topicId } = req.params; // Récupération de l'ID du topic depuis les paramètres de la requête

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

    // Récupérer les tags liés au topic
    const topicTags = await prisma.topicTag.findMany({
      where: { topicId: topicIdNumber },
      include: { tag: true }, // Inclure les détails des tags
    });

    // Extraire les tags de topicTags
    const tags = topicTags.map((topicTag) => topicTag.tag);

    res.status(200).json(tags);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Error in getAllTagFromTopic: " + error.message });
    }
  }
};

// addTagtoTopic

export const addTagtoTopic = async (req: Request, res: Response) => {
  const { topicId, tagId } = req.params;

  const topicIdNumber = parseInt(topicId, 10);
  const tagIdNumber = parseInt(tagId, 10);
  if (isNaN(topicIdNumber) || isNaN(tagIdNumber)) {
    return res.status(400).json({ message: "Invalid topic ID or tag ID" });
  }

  try {
    // Vérifier si le topic existe
    const existingTopic = await prisma.topic.findUnique({
      where: { id: topicIdNumber },
    });

    if (!existingTopic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    // Vérifier si le tag existe
    const existingTag = await prisma.tag.findUnique({
      where: { id: tagIdNumber },
    });

    if (!existingTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    let TagData: any = {
      topicId: topicIdNumber,
      tagId: tagIdNumber,
    };

    // Ajouter le tag au topic
    const topicTag = await prisma.topicTag.create({
      data: TagData,
    });

    res.status(201).json(topicTag);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Error in addTagtoTopic: " + error.message });
    }
  }
};

//deleteTagFromTopic

export const deleteTagFromTopic = async (req: Request, res: Response) => {
  const { topicId, tagId } = req.params;

  const topicIdNumber = parseInt(topicId, 10);
  const tagIdNumber = parseInt(tagId, 10);
  if (isNaN(topicIdNumber) || isNaN(tagIdNumber)) {
    return res.status(400).json({ message: "Invalid topic ID or tag ID" });
  }
  try {
    const existingTopicTag = await prisma.topicTag.findUnique({
      where: {
        topicId_tagId: {
          topicId: topicIdNumber,
          tagId: tagIdNumber,
        },
      },
    });

    if (!existingTopicTag) {
      return res
        .status(404)
        .json({ message: "Tag not associated with this topic" });
    }

    // Supprimer la relation entre le topic et le tag
    await prisma.topicTag.delete({
      where: {
        topicId_tagId: {
          topicId: topicIdNumber,
          tagId: tagIdNumber,
        },
      },
    });

    res.status(200).json({ message: "Tag removed from topic successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Error in deleteTagFromTopic: " + error.message });
    }
  }
};

//UpdateTag

export const UpdateTag = async (req: Request, res: Response) => {
  const { TagId, name } = req.params;

  const TagIdNumber = parseInt(TagId, 10);
  if (isNaN(TagIdNumber)) {
    return res.status(400).json({ message: "Invalid Tag ID" });
  }
  try {
    const existingTag = await prisma.tag.findUnique({
      where: { id: TagIdNumber },
    });
    if (!existingTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    const updatedTag = await prisma.tag.update({
      where: { id: TagIdNumber },
      data: {
        name: name || existingTag.name,
      },
    });
    res.status(200).json(updatedTag);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Error in UpdateTag: " + error.message });
    }
  }
};

//CreateTag

export const CreateTag = async (req: Request, res: Response) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });
  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { name } = value;

  try {
    const existingTag = await prisma.tag.findUnique({
      where: { name },
    });
    if (existingTag) {
      return res.status(400).json({ message: "Name for tag already used" });
    }

    let TagData: any = {
      name: string,
    };

    const NewTag = await prisma.tag.create({
      data: TagData,
    });
    res.status(200).json(NewTag);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Error in CreateTag: " + error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred in CreateTag" });
    }
  }
};

//getTop20Tag

export const getTop20Tags = async (req: Request, res: Response) => {
  try {
      const topTags = await prisma.topicTag.groupBy({
          by: ['tagId'],
          _count: {
              tagId: true,
          },
          orderBy: {
              _count: {
                  tagId: 'desc',
              },
          },
          take: 20,
      });

      const tagDetails = await prisma.tag.findMany({
          where: {
              id: {
                  in: topTags.map(tag => tag.tagId),
              },
          },
      });

      const formattedTags = topTags.map(tag => {
          return {
              ...tag,
              name: tagDetails.find(t => t.id === tag.tagId)?.name,
          };
      });

      res.status(200).json(formattedTags);
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).json({ error: "Error in getTop20Tags: " + error.message });
      } else {
          res.status(500).json({ error: "An unknown error occurred in getTop20Tags" });
      }
  }
};
