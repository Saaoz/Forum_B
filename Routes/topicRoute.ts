import express from 'express';

import { 
    createTopic,
    getAllTopicByCategoryId, getAllTopicByCreatedId, getAllTopicByTitle, getAllTopics, getTopicsById, updateTopicById 
    } from '../Controllers/topicController';

const router = express.Router();




router.get('/', getAllTopics);

router.get('/:id', getTopicsById);

router.get('/:title', getAllTopicByTitle);


router.get('/topic_category/:categoryId', getAllTopicByCategoryId);

router.get('/topic_user/:createdBy', getAllTopicByCreatedId)

router.post('/create', createTopic);

router.patch('/:id/update', updateTopicById);



export default router;
