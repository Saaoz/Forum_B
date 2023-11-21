import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();



//getAllTopic avec filtre

//getAllTopicById avec filtre

//getAllTopicByTitle avec filtre

//getAllTopicByCategoryId avec filtre

//getAllTopicByCreatedUsername


//createTopic

//updateTopic

//toggleTopicActiveState

//PARTIE REPLIES 

//getAllRepliesFromTopic



//Nombre Total de Réponses par Topic

// export const getReplyCountByTopic = async (topicId: number) => {
//     const replyCount = await prisma.reply.count({
//         where: { topicId: topicId }
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