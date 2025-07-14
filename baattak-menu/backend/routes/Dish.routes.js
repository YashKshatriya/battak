import express from 'express';
import DishController from '../controllers/Dish.controller.js';
import { authenticateToken, requireAdmin } from '../authMiddleware.js';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Public: Get all dishes
router.get('/', DishController.getAll);

// Admin: Create, update, delete dishes
router.post('/', upload.single('image'), DishController.create);
router.put('/:id', DishController.update);
router.delete('/:id', DishController.remove);

export default router; 