// user route
import express from "express";
import { 
    getAllUsers, getAllActiveUsers, getAllInactiveUsers, getUserById, getUserByActiveId, getUserByInactiveId
} from '../Controllers/userController';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/active', getAllActiveUsers);
router.get('/inactive', getAllInactiveUsers);
router.get('/:id', getUserById);
router.get('/active/:id', getUserByActiveId);
router.get('/inactive/:id', getUserByInactiveId);



export default router;