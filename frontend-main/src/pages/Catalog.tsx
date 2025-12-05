import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import Layout from '../components/Layout';

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

    return (
        <Layout>
            <div className="mb-10 text-center">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block">
                    Our Menu
                </h2>
                <p className="text-muted max-w-2xl mx-auto">
                    Discover our selection of premium dishes, crafted with the finest ingredients for an unforgettable dining experience.
                </p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="card h-96 animate-pulse">
                            <div className="w-full h-48 bg-white/5 rounded-lg mb-4"></div>
                            <div className="h-6 bg-white/5 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-white/5 rounded w-full mb-2"></div>
                            <div className="h-4 bg-white/5 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="card group overflow-hidden hover:border-primary/50 transition-all duration-300">
                            <div className="relative h-56 -mx-8 -mt-8 mb-6 overflow-hidden">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-white/5 flex items-center justify-center text-muted">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent opacity-60"></div>
                                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                    <span className="text-primary font-bold">${product.price.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex flex-col h-full">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{product.name}</h3>
                                </div>
                                <p className="text-muted text-sm mb-6 line-clamp-2 flex-grow">{product.description}</p>

                                <button
                                    onClick={() => addToCart({ ...product, quantity: 1 })}
                                    className="w-full btn btn-secondary hover:bg-primary hover:text-white hover:border-primary transition-all group-hover:shadow-glow"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default Catalog;
