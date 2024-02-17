
import express from 'express';
import { loginUser, checkAuth, createUser } from '../Controllers/authController';

const router = express.Router();

router.post('/login', loginUser);

router.post('/create', createUser);

//la route est à changer checkauth comme son nom l'indique va permettre de vérifié que l'utilisateur et 
//bien authentifié pour pouvoir request certaines chose comme ces informations perso ou acceder a certaines partie de l'app
router.get('/protected-route', checkAuth, (req, res) => {
    res.send('This is a protected route');
});

export default router;
