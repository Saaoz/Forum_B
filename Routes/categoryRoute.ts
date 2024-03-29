// category route
import express from "express";
import { createCategory, getAllCategory, getCategoryById, getCategoryByName, toggleCategoryActiveState, updateCategoryById } from "../Controllers/categoryController";

const router = express.Router();



router.get('/:name', getCategoryByName);

router.patch('/:id/switch', toggleCategoryActiveState);

router.patch('/:id/update', updateCategoryById);
router.post('/create', createCategory);


router.get('/', getAllCategory);
router.get('/:id', getCategoryById);

export default router;