import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category?: string;
}

const Catalog = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const { addToCart } = useCart();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <Layout>
            <div className="mb-12 text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-primary/20 blur-[100px] -z-10"></div>
                <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block tracking-tight">
                    Nuestro Menú
                </h2>
                <p className="text-muted max-w-2xl mx-auto text-lg">
                    Descubre nuestra selección de platos premium, elaborados con los mejores ingredientes.
                </p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="glass rounded-2xl h-96 animate-pulse p-4">
                            <div className="w-full h-48 bg-white/5 rounded-xl mb-4"></div>
                            <div className="h-6 bg-white/5 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-white/5 rounded w-full mb-2"></div>
                            <div className="h-4 bg-white/5 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            variants={item}
                            className="glass rounded-2xl overflow-hidden group hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10"
                        >
                            <div className="relative h-56 overflow-hidden">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-surface flex items-center justify-center text-muted">
                                        Sin Imagen
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80"></div>
                                <div className="absolute bottom-4 right-4 bg-surface/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-lg">
                                    <span className="text-primary font-bold text-lg">${product.price.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                                <p className="text-muted text-sm mb-6 line-clamp-2 leading-relaxed">{product.description}</p>

                                <button
                                    onClick={() => addToCart({ ...product, quantity: 1 })}
                                    className="w-full bg-white/5 hover:bg-primary hover:text-white text-white border border-white/10 hover:border-primary rounded-xl py-3 font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                                >
                                    <span>Agregar al Carrito</span>
                                    <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </Layout>
    );
};

export default Catalog;
