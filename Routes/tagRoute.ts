import express from 'express';

import { CreateTag, UpdateTagById, addTagtoTopic, deleteTagFromTopic, getAllTag, getAllTagByName, getAllTagFromTopic, getTop20Tags } from '../Controllers/tagController';

const router = express.Router();

router.get('/:name', getAllTagByName)

router.get('/topic/:topicId', getAllTagFromTopic);

router.get('/rank/top20', getTop20Tags);

router.post('/topic/:topicId/tag/:tagId/add', addTagtoTopic);

router.delete('/topic/:topicId/tag/:tagId/delete', deleteTagFromTopic);

router.patch('/:id/update', UpdateTagById);

router.post('/create', CreateTag);

router.get('/', getAllTag);


export default router;