import { Router } from 'express';
import { createOrder, getUserOrders, getOrderById } from '../controllers/orderController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken); // All order routes are protected

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);

export default router;
