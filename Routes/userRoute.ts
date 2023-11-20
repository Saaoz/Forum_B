// user route
import express from "express";
import { 
    getAllUsers, getUserById, getUserByUsername, banUserById, debanUserById, upAdminById, revokeAdminById, updateUserById, createUser
} from '../Controllers/userController';

const router = express.Router();

router.get('/', getAllUsers);

router.get('/:id', getUserById);

router.get('/:username', getUserByUsername);

router.patch('/:id/ban', banUserById);
router.patch('/:id/deban', debanUserById);

router.patch('/:id/admin', upAdminById);
router.patch('/:id/unadmin', revokeAdminById);

router.patch('/:id/update', updateUserById);
router.patch('/create', createUser);

export default router;