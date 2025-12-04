import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

const Catalog = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const { addToCart } = useCart();
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products', error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm p-4 mb-8 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Delivery App</h1>
                <div>
                    <button onClick={() => navigate('/cart')} className="mr-4 text-blue-600 hover:text-blue-800">
                        Cart
                    </button>
                    <button onClick={() => navigate('/orders')} className="mr-4 text-blue-600 hover:text-blue-800">
                        My Orders
                    </button>
                    <button onClick={logout} className="text-red-500 hover:text-red-700">
                        Logout
                    </button>
                </div>
            </nav>
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Menu</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            {product.imageUrl && (
                                <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
                            )}
                            <div className="p-4">
                                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                                <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-green-600">${product.price}</span>
                                    <button
                                        onClick={() => addToCart({ ...product, quantity: 1 })}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Catalog;
