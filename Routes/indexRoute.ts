import { Router } from 'express';
import userRoute from './userRoute'
import authRoute from './authRoute'


const router = Router();

router.use('/users', userRoute); 


export default router;