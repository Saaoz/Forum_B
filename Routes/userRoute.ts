// user route
import express from "express";
import { 
    getAllUsers, getUserById, getUserByUsername, banUserById, debanUserById, upAdminById, revokeAdminById, updateUserById,
} from '../Controllers/userController';

const router = express.Router();

router.get('/', getAllUsers);

router.get('/byid/:id', getUserById);

router.get('/byname/:username', getUserByUsername);

router.patch('/:id/ban', banUserById);
router.patch('/:id/deban', debanUserById);

router.patch('/:id/admin', upAdminById);
router.patch('/:id/unadmin', revokeAdminById);

router.patch('/:id/update', updateUserById);

export default router;