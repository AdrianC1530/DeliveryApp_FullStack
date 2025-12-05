import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({ where: { id: Number(id) } });
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener producto', error });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    const { name, description, price, imageUrl, stock } = req.body;
    try {
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: Number(price),
                imageUrl,
                stock: Number(stock),
            },
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear producto', error });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, price, imageUrl, stock } = req.body;
    try {
        const product = await prisma.product.update({
            where: { id: Number(id) },
            data: {
                name,
                description,
                price: Number(price),
                imageUrl,
                stock: Number(stock),
            },
        });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar producto', error });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.product.delete({ where: { id: Number(id) } });
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto', error });
    }
};
