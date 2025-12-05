import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // 1. Clean existing data (optional, but good for resetting)
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    // 2. Create Default User
    const hashedPassword = await bcrypt.hash('123456', 10);

    const user = await prisma.user.upsert({
        where: { email: 'cliente@demo.com' },
        update: {},
        create: {
            email: 'cliente@demo.com',
            name: 'Cliente Demo',
            password: hashedPassword,
            role: 'USER',
        },
    });

    console.log('User created:', user.email);

    // 3. Create Products
    const products = [
        // Hamburguesas
        {
            name: 'Hamburguesa Doble Queso',
            description: 'Doble carne, doble queso cheddar, cebolla y salsa especial.',
            price: 9.50,
            imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60',
            stock: 50,
            category: 'Hamburguesas'
        },
        {
            name: 'Hamburguesa BBQ Bacon',
            description: 'Carne de res a la parrilla, tocino crujiente, queso cheddar y salsa BBQ ahumada.',
            price: 10.50,
            imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=500&q=60',
            stock: 35,
            category: 'Hamburguesas'
        },
        // Pizzas
        {
            name: 'Pizza Pepperoni Familiar',
            description: 'Masa grande, extra queso y mucho pepperoni.',
            price: 18.00,
            imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=60',
            stock: 30,
            category: 'Pizzas'
        },
        {
            name: 'Pizza Hawaiana',
            description: 'Jamón, piña y queso mozzarella.',
            price: 16.50,
            imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=60',
            stock: 30,
            category: 'Pizzas'
        },
        // Bebidas
        {
            name: 'Coca-Cola 1.5L',
            description: 'Refresco sabor cola.',
            price: 2.50,
            imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=60',
            stock: 100,
            category: 'Bebidas'
        },
        {
            name: 'Limonada Natural',
            description: 'Limonada fresca con menta y hielo.',
            price: 3.00,
            imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=60',
            stock: 50,
            category: 'Bebidas'
        },
        // Postres
        {
            name: 'Cheesecake de Fresa',
            description: 'Pastel de queso cremoso con salsa de fresa.',
            price: 5.00,
            imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=500&q=60',
            stock: 20,
            category: 'Postres'
        },
        {
            name: 'Brownie con Helado',
            description: 'Brownie de chocolate caliente con una bola de helado de vainilla.',
            price: 6.00,
            imageUrl: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=500&q=60',
            stock: 25,
            category: 'Postres'
        },
        // Tacos
        {
            name: 'Tacos al Pastor (Orden de 5)',
            description: 'Tortillas de maíz con carne de cerdo adobada, piña, cilantro y cebolla.',
            price: 12.00,
            imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=500&q=60',
            stock: 60,
            category: 'Tacos'
        }
    ];

    for (const product of products) {
        // Remove category as it's not in the schema yet, or add it to schema if needed. 
        // For now, we'll just insert the fields that exist.
        const { category, ...productData } = product;
        await prisma.product.create({
            data: productData,
        });
    }

    console.log('Database seeded with products and user!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
