import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
    user?: any;
}

export const createOrder = async (req: AuthRequest, res: Response) => {
    const { items, total, address, latitude, longitude } = req.body; // items: { productId, quantity, price }[]
    const userId = req.user.userId;

    try {
        const order = await prisma.order.create({
            data: {
                userId,
                total: Number(total),
                address: address || '',
                latitude: Number(latitude) || 0,
                longitude: Number(longitude) || 0,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: { items: true },
        });
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
    const userId = req.user.userId;
    try {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }

    try {
        const orders = await prisma.order.findMany({
            include: { items: { include: { product: true } }, user: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener todas las órdenes', error });
    }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user.userId;
    try {
        const order = await prisma.order.findUnique({
            where: { id: Number(id) },
            include: { items: { include: { product: true } } },
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if order belongs to user or user is admin
        if (order.userId !== userId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error });
    }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }

    try {
        const order = await prisma.order.update({
            where: { id: Number(id) },
            data: { status },
        });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error });
    }
};
