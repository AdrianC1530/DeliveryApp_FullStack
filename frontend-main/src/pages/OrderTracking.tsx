import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

interface Order {
    id: number;
    status: string;
    total: number;
    createdAt: string;
    items: { product: { name: string }; quantity: number }[];
}

const OrderTracking = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders', error);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'text-yellow-600 bg-yellow-100';
            case 'PREPARING': return 'text-blue-600 bg-blue-100';
            case 'ON_WAY': return 'text-purple-600 bg-purple-100';
            case 'DELIVERED': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">My Orders</h2>
                    <button onClick={() => navigate('/catalog')} className="text-blue-600 hover:underline">
                        Back to Menu
                    </button>
                </div>
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold">Order #{order.id}</h3>
                                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="border-t border-b py-4 mb-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm text-gray-700 mb-1">
                                        <span>{item.product.name} x {item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-bold">Total: ${order.total}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
