import { Router } from 'express';
import userRoute from './userRoute'
import authRoute from './authRoute'
import categoryRoute from './categoryRoute'

const router = Router();

router.use('/users', userRoute); 

router.use('/category', categoryRoute )

export default router;