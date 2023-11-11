
import express from 'express';
import { loginUser } from '../Controllers/authController';

const router = express.Router();

router.post('/login', loginUser);

export default router;
