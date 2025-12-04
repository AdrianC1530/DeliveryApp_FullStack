import { Router } from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticateToken, createProduct); // Protected
router.put('/:id', authenticateToken, updateProduct); // Protected
router.delete('/:id', authenticateToken, deleteProduct); // Protected

export default router;
