import express from 'express';

import { 
    getAllTopicByCategoryId, getAllTopicByCreatedId 
    } from '../Controllers/topicController';

const router = express.Router();

// Ajout de la route pour récupérer les topics par ID de catégorie
router.get('/topic_category/:categoryId', getAllTopicByCategoryId);

router.get('/topic_user/:createdBy', getAllTopicByCreatedId)

export default router;
