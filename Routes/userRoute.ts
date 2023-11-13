// user route
import express from "express";
import { 
    getAllUsers, getAllActiveUsers, getAllInactiveUsers, getUserById, getUserByActiveId, getUserByInactiveId, getUserByUsername, getUserByUsernameActive, getUserByUsernameInactive, banUserById, debanUserById, upAdminById, revokeAdminById, updateUserById, createUser
} from '../Controllers/userController';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/active', getAllActiveUsers);
router.get('/inactive', getAllInactiveUsers);

router.get('/:id', getUserById);
router.get('/active/:id', getUserByActiveId);
router.get('/inactive/:id', getUserByInactiveId);

router.get('/:username', getUserByUsername);
router.get('/:username/active', getUserByUsernameActive);
router.get('/:username/inactive', getUserByUsernameInactive);

router.patch('/:id/ban', banUserById);
router.patch('/:id/deban', debanUserById);

router.patch('/:id/admin', upAdminById);
router.patch('/:id/unadmin', revokeAdminById);

router.patch('/:id/update', updateUserById);
router.patch('/create', createUser);

export default router;