import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Joi, { string } from "joi";

const prisma = new PrismaClient();

//getAllTag

export const getAllTag = async (req: Request, res: Response) => {
  // console.log("getAllTag function called");

  try {
    const Tag = await prisma.tag.findMany({});

    res.status(200).json(Tag);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Error in getAllTag: " + error.message });
    }
  }
};

export const getAllTagByName = async (req: Request, res: Response) => {
  // console.log("getAllTagByName function called");

  const { name } = req.params;
  try {
    const tags = await prisma.tag.findMany({
      where: {
        AND: [
          {
            name: {
              contains: name,
            },
          },
        ],
      },
    });
    res.status(200).json(tags);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Error in getAllTagByName:" + error.message });
    }
  }
};

// getAllTagFromTopic

export const getAllTagFromTopic = async (req: Request, res: Response) => {
  // console.log("getAllTagFromTopic function called");

  const { topicId } = req.params;

  try {
    const existingTopic = await prisma.topic.findUnique({
      where: { id: Number(topicId) },
    });

    if (!existingTopic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const topicTags = await prisma.topicTag.findMany({
      where: { topicId: Number(topicId) },
      include: { tag: true }, // Inclure les détails des tags
    });

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
  // console.log("addTagtoTopic function called");

  const topicIdNum = Number(req.params.topicId)
  const tagIdNum = Number(req.params.tagId)

  try {
    const existingTopic = await prisma.topic.findUnique({
      where: { id: topicIdNum },
    });

    if (!existingTopic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    // Vérifier si le tag existe
    const existingTag = await prisma.tag.findUnique({
      where: { id: tagIdNum },
    });

    if (!existingTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    const existingRelation = await prisma.topicTag.findUnique({
      where: {
        topicId_tagId: {
          topicId: topicIdNum,
          tagId: tagIdNum,
        },
      },
    });

    if (existingRelation) {
      return res.status(409).json({ message: "This tag is already added to the topic." });
    }
    
    // Ajouter le tag au topic
    const topicTag = await prisma.topicTag.create({
      data: {
        topicId: topicIdNum,
        tagId: tagIdNum,
      },
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
  // console.log("deleteTagFromTopic function called");

  const { topicId, tagId } = req.params;

  try {
    const existingTopicTag = await prisma.topicTag.findUnique({
      where: {
        topicId_tagId: {
          topicId: Number(topicId),
          tagId: Number(tagId),
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
          topicId: Number(topicId),
          tagId: Number(tagId),
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

export const UpdateTagById = async (req: Request, res: Response) => {
  // console.log("UpdateTag function called");

  const { id } = req.params;
  const { name } = req.body;

  try {
    const existingTag = await prisma.tag.findUnique({
      where: { id: Number(id) },
    });
    if (!existingTag) {
      return res
        .status(400)
        .json({ message: "Tag not found for updateTagById" });
    }

    const updateTag = await prisma.tag.update({
      where: { id: Number(id) },
      data: {
        name: name !== undefined ? name : existingTag.name,
      },
    });
    res.status(200).json(updateTag);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Error in updateTagById" + error.message });
    }
  }
};

//CreateTag

export const CreateTag = async (req: Request, res: Response) => {
  // console.log("CreateTag function called");

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
      name,
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
  // console.log("getTop20Tags function called");

  try {
    const topTags = await prisma.topicTag.groupBy({
      by: ["tagId"],
      _count: {
        tagId: true,
      },
      orderBy: {
        _count: {
          tagId: "desc",
        },
      },
      take: 20,
    });

    const tagDetails = await prisma.tag.findMany({
      where: {
        id: {
          in: topTags.map((tag) => tag.tagId),
        },
      },
    });

    const formattedTags = topTags.map((tag) => {
      return {
        ...tag,
        name: tagDetails.find((t) => t.id === tag.tagId)?.name,
      };
    });

    res.status(200).json(formattedTags);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Error in getTop20Tags: " + error.message });
    } else {
      res
        .status(500)
        .json({ error: "An unknown error occurred in getTop20Tags" });
    }
  }
};
