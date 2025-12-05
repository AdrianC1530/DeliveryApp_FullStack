import { useEffect, useState } from 'react';
import api from '../utils/api';
import Layout from '../components/Layout';

interface Order {
    id: number;
    status: string;
    total: number;
    createdAt: string;
    items: {
        id: number;
        quantity: number;
        product: {
            name: string;
            price: number;
        };
    }[];
}

const OrderTracking = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'PREPARING': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'ON_WAY': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            case 'DELIVERED': return 'text-green-400 bg-green-400/10 border-green-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    return (
        <Layout>
            <div className="mb-10">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block">
                    Order History
                </h2>
                <p className="text-muted mt-2">Track your past and current orders</p>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="card h-32 animate-pulse"></div>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 card border-dashed">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-xl text-muted">No orders found</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="card overflow-hidden hover:border-primary/30 transition-all">
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b border-white/10 pb-4">
                                <div>
                                    <span className="text-sm text-muted block">Order ID</span>
                                    <span className="font-mono font-bold text-lg">#{order.id}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-muted block">Date</span>
                                    <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-muted block">Total Amount</span>
                                    <span className="font-bold text-primary text-xl">${order.total.toFixed(2)}</span>
                                </div>
                                <div>
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(order.status)}`}>
                                        {order.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-lg p-4">
                                <h4 className="text-sm font-bold text-muted mb-3 uppercase tracking-wider">Items</h4>
                                <ul className="space-y-2">
                                    {order.items.map((item) => (
                                        <li key={item.id} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-primary/20 text-primary w-6 h-6 rounded flex items-center justify-center text-xs font-bold">
                                                    {item.quantity}x
                                                </span>
                                                <span>{item.product.name}</span>
                                            </div>
                                            <span className="text-muted">${(item.product.price * item.quantity).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default OrderTracking;
