import express from 'express';

import { createReplyForTopic, getAllReply, getAllReplyFromTopicId, getAllReplyFromTopicTitle, getAllReplyFromUserId, toggleReplyActiveState, updateReply } from '../Controllers/replyController';

const router = express.Router();




 router.get('/', getAllReply);

router.get('/topic/:title', getAllReplyFromTopicTitle);

router.get('/topic/:id', getAllReplyFromTopicId)

router.get('/user/:id', getAllReplyFromUserId)

router.post('/topic/:id/create', createReplyForTopic)

router.patch('/:id/update', updateReply )

router.patch('/:id/switch_state', toggleReplyActiveState)




export default router;