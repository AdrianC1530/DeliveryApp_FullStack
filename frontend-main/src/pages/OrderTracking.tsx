import { useEffect, useState } from 'react';
import api from '../utils/api';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

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

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING': return 'PENDIENTE';
            case 'PREPARING': return 'PREPARANDO';
            case 'ON_WAY': return 'EN CAMINO';
            case 'DELIVERED': return 'ENTREGADO';
            default: return status;
        }
    };

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
            <div className="mb-10">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block tracking-tight">
                    Historial de Órdenes
                </h2>
                <p className="text-muted mt-2 text-lg">Rastrea tus pedidos actuales y pasados</p>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="glass rounded-xl h-32 animate-pulse"></div>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20 glass rounded-2xl border-dashed border-2 border-white/10"
                >
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-xl text-muted">No se encontraron órdenes</p>
                </motion.div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                >
                    {orders.map((order) => (
                        <motion.div
                            key={order.id}
                            variants={item}
                            className="glass rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 p-6 border-b border-white/10 bg-surface/30">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-xl">
                                        🧾
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted block">Orden ID</span>
                                        <span className="font-mono font-bold text-lg">#{order.id}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-sm text-muted block">Fecha</span>
                                    <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-muted block">Total</span>
                                    <span className="font-bold text-primary text-xl">${order.total.toFixed(2)}</span>
                                </div>
                                <div>
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(order.status)}`}>
                                        {getStatusText(order.status)}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 bg-surface/10">
                                <h4 className="text-sm font-bold text-muted mb-4 uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                    Artículos
                                </h4>
                                <ul className="space-y-3">
                                    {order.items.map((item) => (
                                        <li key={item.id} className="flex justify-between items-center text-sm p-3 rounded-lg bg-surface/30 hover:bg-surface/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-primary/20 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold">
                                                    {item.quantity}x
                                                </span>
                                                <span className="font-medium">{item.product.name}</span>
                                            </div>
                                            <span className="text-white font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </Layout>
    );
};

export default OrderTracking;
