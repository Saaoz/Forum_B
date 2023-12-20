import express from 'express';

import { CreateTag, UpdateTag, addTagtoTopic, deleteTagFromTopic, getAllTag, getAllTagFromTopic, getTop20Tags } from '../Controllers/tagController';

const router = express.Router();

router.get('/', getAllTag);

router.get('/topic/:topicId', getAllTagFromTopic);

router.get('/top20', getTop20Tags);

router.post('/topic/:topicId/tag/:tagId/add', addTagtoTopic);

router.delete('/topic/:topicId/tag/:tagId/delete', deleteTagFromTopic);

router.patch('/:id/update', UpdateTag);

router.post('/create', CreateTag);

export default router;