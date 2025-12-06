import { useEffect, useState } from 'react';
import api from '../utils/api';
import Layout from '../components/Layout';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Custom Icons using Emojis (No external images required) ---
const createEmojiIcon = (emoji: string) => {
    return L.divIcon({
        className: 'custom-emoji-icon',
        html: `<div style="font-size: 30px; line-height: 1; text-align: center;">${emoji}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
    });
};

const restaurantIcon = createEmojiIcon('🏪');
const userIcon = createEmojiIcon('🏠');
const driverIcon = createEmojiIcon('🛵');

// --- Types ---
interface Order {
    id: number;
    status: string;
    total: number;
    createdAt: string;
    address: string;
    latitude: number;
    longitude: number;
    items: { product: { name: string }; quantity: number }[];
}

// --- Map Component to Auto-Center ---
const MapUpdater = ({ center, markers }: { center: [number, number], markers: [number, number][] }) => {
    const map = useMap();

    useEffect(() => {
        if (markers.length > 0) {
            const bounds = L.latLngBounds(markers.map(m => L.latLng(m[0], m[1])));
            // Add restaurant to bounds
            bounds.extend(center);
            map.fitBounds(bounds, { padding: [50, 50] });
        } else {
            map.setView(center, 14);
        }
    }, [center, markers, map]);

    return null;
};

const OrderTracking = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [driverPos, setDriverPos] = useState<[number, number] | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Fixed Restaurant Location (Ibarra Center approx)
    const restaurantPos: [number, number] = [0.3517, -78.1223];

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders', error);
        }
    };

    useEffect(() => {
        fetchOrders();
        // Poll for updates every 10 seconds
        const pollInterval = setInterval(fetchOrders, 10000);
        return () => clearInterval(pollInterval);
    }, []);

    // Simulate Driver Movement for the latest active order
    useEffect(() => {
        if (orders.length === 0) return;
        const latestOrder = orders[0];

        // Only simulate if order is ON_WAY or PENDING/PREPARING (to show movement)
        // And if we have valid coordinates
        if (latestOrder.status !== 'DELIVERED' && latestOrder.latitude && latestOrder.longitude) {
            // Simple simulation: Move driver from Restaurant to User based on time
            // In a real app, this would come from the backend

            let progress = 0;
            const interval = setInterval(() => {
                progress += 0.005; // Slower, smoother movement
                if (progress > 1) progress = 1;

                const newLat = restaurantPos[0] + (latestOrder.latitude - restaurantPos[0]) * progress;
                const newLng = restaurantPos[1] + (latestOrder.longitude - restaurantPos[1]) * progress;

                setDriverPos([newLat, newLng]);

                if (progress >= 1) clearInterval(interval);
            }, 50);

            return () => clearInterval(interval);
        } else if (latestOrder.status === 'DELIVERED') {
            setDriverPos(null);
        }
    }, [orders]); // Re-run when orders list updates

    const handleConfirmDelivery = async (orderId: number) => {
        if (!window.confirm('¿Confirmas que has recibido el pedido y realizado el pago?')) return;

        setIsUpdating(true);
        try {
            await api.patch(`/orders/${orderId}/status`, { status: 'DELIVERED' });
            alert('¡Excelente! Pedido completado.');
            await fetchOrders();
        } catch (error) {
            console.error('Error updating order', error);
            alert('Hubo un error al confirmar la entrega. Intenta de nuevo.');
        } finally {
            setIsUpdating(false);
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

    // Determine active markers for the map
    const activeOrder = orders[0];
    const userLocation: [number, number] | null = (activeOrder && activeOrder.latitude && activeOrder.longitude)
        ? [activeOrder.latitude, activeOrder.longitude]
        : null;

    return (
        <Layout>
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block">
                    Mis Pedidos
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Order List */}
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="glass rounded-2xl p-6 border border-white/5 hover:border-primary/30 transition-all duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">Orden #{order.id}</h3>
                                        <p className="text-sm text-muted mb-2">{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</p>
                                        <div className="flex items-center gap-2 text-sm text-white/80 bg-white/5 px-3 py-1.5 rounded-lg w-fit">
                                            <span>📍</span>
                                            <span className="truncate max-w-[200px]">{order.address || 'Sin dirección registrada'}</span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="bg-black/20 rounded-xl p-4 mb-4 space-y-2">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm text-white/90">
                                            <span>{item.quantity}x {item.product.name}</span>
                                            <span className="font-medium text-white">${(item.quantity * (item.product as any).price || 0).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center pt-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted text-sm">Total:</span>
                                        <span className="text-2xl font-bold text-primary">${order.total.toFixed(2)}</span>
                                    </div>

                                    {order.status !== 'DELIVERED' && (
                                        <button
                                            onClick={() => handleConfirmDelivery(order.id)}
                                            disabled={isUpdating}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg ${isUpdating
                                                    ? 'bg-gray-500 cursor-not-allowed text-gray-300'
                                                    : 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20 hover:scale-105'
                                                }`}
                                        >
                                            {isUpdating ? 'Procesando...' : 'Confirmar Entrega'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {orders.length === 0 && (
                            <div className="text-center py-12 text-muted">
                                No tienes pedidos activos.
                            </div>
                        )}
                    </div>

                    {/* Live Tracking Map */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <div className="glass rounded-2xl p-1 border border-white/10 overflow-hidden shadow-2xl shadow-black/50">
                            <div className="bg-surface/50 p-4 border-b border-white/5 backdrop-blur-md flex justify-between items-center">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span>🗺️</span> Seguimiento en Vivo
                                </h3>
                                <div className="flex items-center gap-3 text-xs font-medium">
                                    <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded"><span className="text-lg">🏪</span> Rest.</span>
                                    <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded"><span className="text-lg">🏠</span> Tú</span>
                                    <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded"><span className="text-lg">🛵</span> Moto</span>
                                </div>
                            </div>
                            <div className="h-[500px] w-full relative z-0 bg-gray-900">
                                <MapContainer center={restaurantPos} zoom={13} className="h-full w-full">
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />

                                    <MapUpdater
                                        center={restaurantPos}
                                        markers={userLocation ? [userLocation] : []}
                                    />

                                    {/* Restaurant Marker */}
                                    <Marker position={restaurantPos} icon={restaurantIcon}>
                                        <Popup>Restaurante (Ibarra)</Popup>
                                    </Marker>

                                    {/* User Marker (Destination) */}
                                    {userLocation && (
                                        <Marker position={userLocation} icon={userIcon}>
                                            <Popup>Tu Ubicación: {activeOrder?.address}</Popup>
                                        </Marker>
                                    )}

                                    {/* Driver Marker (Moving) */}
                                    {driverPos && (
                                        <Marker position={driverPos} icon={driverIcon}>
                                            <Popup>Repartidor en camino</Popup>
                                        </Marker>
                                    )}
                                </MapContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default OrderTracking;
