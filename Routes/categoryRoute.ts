// category route
import express from "express";
import { createCategory, getActiveCategoryById, getAllActiveCategory, getAllCategory, getAllInactiveCategory, getCategoryById, getCategoryByName, getCategoryBynameActive, getCategoryBynameInactive, getInactiveCategoryById, toggleCategoryActiveState, updateCategoryById } from "../Controllers/categoryController";

const router = express.Router();

router.get('/', getAllCategory);
router.get('/active', getAllActiveCategory);
router.get('/inactive', getAllInactiveCategory);

router.get('/:id', getCategoryById);
router.get('/active/:id', getActiveCategoryById);
router.get('/inactive/:id', getInactiveCategoryById);

router.get('/:name', getCategoryByName);
router.get('/:name/active', getCategoryBynameActive);
router.get('/:name/inactive', getCategoryBynameInactive);

router.patch('/:id/switch', toggleCategoryActiveState);

router.patch('/:id/update', updateCategoryById);
router.patch('/create', createCategory);

export default router;