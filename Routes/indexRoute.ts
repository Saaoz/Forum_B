import { Router } from 'express';
import userRoute from './userRoute'
import authRoute from './authRoute'
import categoryRoute from './categoryRoute'
import topicRoute from './topicRoute'

const router = Router();

router.use('/users', userRoute); 

router.use('/category', categoryRoute );

router.use('/topics', topicRoute);

export default router;