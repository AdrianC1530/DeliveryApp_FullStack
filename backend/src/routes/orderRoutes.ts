import { Router } from 'express';
import { createOrder, getUserOrders, getOrderById, updateOrderStatus, getAllOrders } from '../controllers/orderController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken); // All order routes are protected

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/admin/all', getAllOrders); // New admin route
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);

export default router;
