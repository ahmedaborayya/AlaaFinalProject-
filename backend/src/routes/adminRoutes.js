import express from 'express';
import {
  createProduct, updateProduct, deleteProduct,
  getAllOrders, updateOrderStatus,
  createCategory, updateCategory, deleteCategory,
  getAllUsers,
} from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All admin routes must be protected by verifyToken and isAdmin
router.use(verifyToken, isAdmin);

// Products
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);

// Categories
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Users
router.get('/users', getAllUsers);

export default router;
