import express from 'express';
import { 
    createTopic,
    getAllTopicByCategoryId, getAllTopicByCreatedId, getAllTopicByTitle, getAllTopics, getTopicsById, updateTopicById 
} from '../Controllers/topicController';

const router = express.Router();

// Placez les routes spécifiques en premier
router.post('/create', createTopic);
router.get('/topic_category/:categoryId', getAllTopicByCategoryId);
router.get('/topic_user/:createdBy', getAllTopicByCreatedId);
router.post('/:title', getAllTopicByTitle); 

// Ensuite, les routes plus génériques
router.get('/', getAllTopics);
router.get('/:id', getTopicsById);
router.patch('/:id/update', updateTopicById);

export default router;