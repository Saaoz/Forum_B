import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Joi, { boolean, string } from "joi";

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



//getAllReplies

export const getAllReplies = async (req: Request, res:Response) =>{
    const {  } = req.body
    try{
    
    res.status(200).json();
    } catch (error) {
        if (error instanceof Error) {
          res
            .status(500)
            .json({ error: "Error in getAllReplies: " + error.message });
        }
      }
}

//getAllRepliesFromTopicTitle

export const getAllRepliesFromTopicTitle = async (req: Request, res:Response) =>{
    const {  } = req.body
    try{
    
    res.status(200).json();
    } catch (error) {
        if (error instanceof Error) {
          res
            .status(500)
            .json({ error: "Error in getAllRepliesFromTopicTitle: " + error.message });
        }
      }
}

//getAllRepliesFromTopicId

export const getAllRepliesFromTopicId = async (req: Request, res:Response) =>{
    const {  } = req.body
    try{
    
    res.status(200).json();
    } catch (error) {
        if (error instanceof Error) {
          res
            .status(500)
            .json({ error: "Error in getAllRepliesFromTopicId: " + error.message });
        }
      }
}

//getAllRepliesFromUserId

export const getAllRepliesFromUserId = async (req: Request, res:Response) =>{
    const {  } = req.body
    try{
    
    res.status(200).json();
    } catch (error) {
        if (error instanceof Error) {
          res
            .status(500)
            .json({ error: "Error in getAllRepliesFromUserId: " + error.message });
        }
      }
}

//getAllRepliesFromUsername

export const getAllRepliesFromUsername = async (req: Request, res:Response) =>{
    const {  } = req.body
    try{
    
    res.status(200).json();
    } catch (error) {
        if (error instanceof Error) {
          res
            .status(500)
            .json({ error: "Error in getAllRepliesFromUsername: " + error.message });
        }
      }
}

//createRepliesForTopic

export const createRepliesForTopic = async (req: Request, res:Response) =>{
    const {  } = req.body
    try{
    
    res.status(200).json();
    } catch (error) {
        if (error instanceof Error) {
          res
            .status(500)
            .json({ error: "Error in createRepliesForTopic: " + error.message });
        }
      }
}

//updateReplies

export const updateReplies = async (req: Request, res:Response) =>{
    const {  } = req.body
    try{
    
    res.status(200).json();
    } catch (error) {
        if (error instanceof Error) {
          res
            .status(500)
            .json({ error: "Error in updateReplies: " + error.message });
        }
      }
}

//toggleRepliesActiveState

export const toggleRepliesActiveState = async (req: Request, res:Response) =>{
    const {  } = req.body
    try{
    
    res.status(200).json();
    } catch (error) {
        if (error instanceof Error) {
          res
            .status(500)
            .json({ error: "Error in toggleRepliesActiveState: " + error.message });
        }
      }
}