// user route
import express from "express";
import { 
    getAllUsers, getAllActiveUsers, getAllInactiveUsers, getUserById, getUserByActiveId, getUserByInactiveId, getUserByUsername, getUserByUsernameActive, getUserByUsernameInactive, banUserById, debanUserById
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

router.get('/:id/ban', banUserById);
router.get('/:id/deban', debanUserById);

export default router;