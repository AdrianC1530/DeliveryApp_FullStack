import { useEffect, useState } from 'react';
import api from '../utils/api';
import Layout from '../components/Layout';

interface Order {
    id: number;
    status: string;
    total: number;
    createdAt: string;
    address: string;
    user: {
        name: string;
        email: string;
    };
    items: { product: { name: string }; quantity: number }[];
}

const AdminDashboard = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders/admin/all');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching all orders', error);
            alert('Error al cargar las órdenes. Asegúrate de ser administrador.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            // Update local state
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error('Error updating status', error);
            alert('Error al actualizar el estado.');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
            case 'PREPARING': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
            case 'ON_WAY': return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
            case 'DELIVERED': return 'bg-green-500/20 text-green-300 border-green-500/50';
            default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block">
                    Panel de Administrador
                </h2>

                {isLoading ? (
                    <div className="text-center py-12 text-muted">Cargando órdenes...</div>
                ) : (
                    <div className="glass rounded-2xl overflow-hidden border border-white/5">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-white">
                                <thead className="bg-white/5 text-xs uppercase text-muted">
                                    <tr>
                                        <th className="px-6 py-4">Orden ID</th>
                                        <th className="px-6 py-4">Cliente</th>
                                        <th className="px-6 py-4">Fecha</th>
                                        <th className="px-6 py-4">Total</th>
                                        <th className="px-6 py-4">Estado</th>
                                        <th className="px-6 py-4">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-medium">#{order.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold">{order.user?.name || 'Desconocido'}</div>
                                                <div className="text-xs text-muted">{order.user?.email}</div>
                                                <div className="text-xs text-muted mt-1">📍 {order.address}</div>
                                            </td>
                                            <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</td>
                                            <td className="px-6 py-4 font-bold text-primary">${order.total.toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className="bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary/50"
                                                >
                                                    <option value="PENDING">Pendiente</option>
                                                    <option value="PREPARING">Preparando</option>
                                                    <option value="ON_WAY">En Camino</option>
                                                    <option value="DELIVERED">Entregado</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {orders.length === 0 && (
                            <div className="text-center py-12 text-muted">
                                No hay órdenes registradas.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default AdminDashboard;
