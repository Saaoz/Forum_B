import { Router } from 'express';
import userRoute from './userRoute'
import authRoute from './authRoute'
import categoryRoute from './categoryRoute'
import topicRoute from './topicRoute'
import repliesRoute from './replyRoute'
import tagsRoute from './tagRoute'

const router = Router();

router.use('/users', userRoute); 

router.use('/category', categoryRoute);

router.use('/topics', topicRoute);

router.use('/replies', repliesRoute);

router.use('/tags', tagsRoute);

router.use('/auth', authRoute);

export default router;