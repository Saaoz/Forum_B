import express from 'express';

import { getAllReplies, getAllRepliesFromTopicTitle } from '../Controllers/replyController';

const router = express.Router();




 router.get('/', getAllReplies);

// router.get('/:id', getTopicsById);

router.get('/:title', getAllRepliesFromTopicTitle);


// router.get('/topic_category/:categoryId', getAllTopicByCategoryId);

// router.get('/topic_user/:createdBy', getAllTopicByCreatedId)

// router.post('/create', createTopic);

// router.patch('/:id/update', updateTopicById);



export default router;