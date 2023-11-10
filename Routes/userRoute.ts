// user route
import express from "express";
import { 
    getAllUsers, getAllActiveUsers, getAllInactiveUsers, getUserById, getUserByActiveId, getUserByInactiveId
} from '../Controllers/userController';

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/users/active', getAllActiveUsers);
router.get('/users/inactive', getAllInactiveUsers);
router.get('/users/:id', getUserById);
router.get('/users/active/:id', getUserByActiveId);
router.get('/users/inactive/:id', getUserByInactiveId);

export default router;