import express from 'express';

import { createReplyForTopic, getAllReply, getAllReplyFromTopicId, getAllReplyFromTopicTitle, getAllReplyFromUserId, toggleReplyActiveState, updateReply } from '../Controllers/replyController';

const router = express.Router();


router.get('/', getAllReply);

router.get('/topictitle/:title', getAllReplyFromTopicTitle);

router.get('/topic/:topicId', getAllReplyFromTopicId)

router.get('/user/:createdBy', getAllReplyFromUserId)

router.post('/:topicId/create', createReplyForTopic)

router.patch('/:id/update', updateReply )

router.patch('/:id/switch', toggleReplyActiveState)




export default router;