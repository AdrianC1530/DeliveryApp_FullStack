import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Layout from '../components/Layout';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map clicks and sizing
const MapController = ({ onLocationSelect, selectedPosition }: { onLocationSelect: (lat: number, lng: number) => void, selectedPosition: [number, number] | null }) => {
    const map = useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    // Force map to resize correctly when mounted
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }, [map]);

    // Fly to selected position
    useEffect(() => {
        if (selectedPosition) {
            map.flyTo(selectedPosition, map.getZoom());
        }
    }, [selectedPosition, map]);

    return null;
};

const Cart = () => {
    const { items, removeFromCart, total, clearCart } = useCart();
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

    const handleCheckout = async () => {
        if (!address.trim()) {
            alert('⚠️ Por favor escribe una dirección de referencia (ej: Calle Bolívar...).');
            return;
        }

        if (!coordinates) {
            alert('⚠️ Por favor haz clic en el mapa para seleccionar tu ubicación exacta.');
            return;
        }

        if (!window.confirm('Recuerda que el pago es ÚNICAMENTE en EFECTIVO al recibir el pedido. ¿Deseas continuar?')) {
            return;
        }

        try {
            await api.post('/orders', {
                items: items.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
                total,
                address,
                latitude: coordinates[0],
                longitude: coordinates[1]
            });
            clearCart();
            alert('¡Pedido realizado con éxito! Prepárate para pagar en efectivo.');
            navigate('/orders');
        } catch (error) {
            console.error('Error placing order', error);
            alert('Error al realizar el pedido. Inténtalo de nuevo.');
        }
    };

    const handleMapClick = (lat: number, lng: number) => {
        setCoordinates([lat, lng]);
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block">
                    Tu Carrito
                </h2>

                {items.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <p className="text-muted text-xl mb-6">Tu carrito está vacío.</p>
                        <button
                            onClick={() => navigate('/catalog')}
                            className="bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-primary/20"
                        >
                            Ir al Catálogo
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Items List */}
                        <div className="glass rounded-2xl p-6 h-fit">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <span>🛍️</span> Resumen del Pedido
                            </h3>
                            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div>
                                            <h3 className="font-semibold text-white">{item.name}</h3>
                                            <p className="text-sm text-muted">
                                                ${item.price.toFixed(2)} x {item.quantity}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center border-t border-white/10 pt-6">
                                <span className="text-xl font-bold text-muted">Total:</span>
                                <span className="text-3xl font-bold text-primary">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Checkout Form */}
                        <div className="glass rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <span>📍</span> Datos de Entrega
                            </h3>

                            <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 p-4 rounded-xl mb-6 flex gap-3 items-start">
                                <span className="text-xl">⚠️</span>
                                <div>
                                    <p className="font-bold mb-1">Pago Contra Entrega</p>
                                    <p className="text-sm opacity-80">Recuerda tener el efectivo listo al recibir tu pedido.</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-muted text-sm font-medium mb-2">Dirección Escrita <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                        placeholder="Ej: Calle Bolívar 12-34 y Oviedo"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-muted text-sm font-medium mb-2">
                                        Ubicación Exacta <span className="text-primary text-xs ml-1">(Click en el mapa)</span> <span className="text-red-400">*</span>
                                    </label>
                                    <div className="h-64 w-full rounded-xl border border-white/10 overflow-hidden relative z-0">
                                        <MapContainer center={[0.3517, -78.1223]} zoom={14} scrollWheelZoom={false} className="h-full w-full">
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <MapController onLocationSelect={handleMapClick} selectedPosition={coordinates} />
                                            {coordinates && <Marker position={coordinates} />}
                                        </MapContainer>
                                    </div>
                                    {coordinates ? (
                                        <div className="flex items-center gap-2 mt-2 text-green-400 text-sm bg-green-400/10 px-3 py-1.5 rounded-lg w-fit">
                                            <span>✅</span> Ubicación seleccionada: {coordinates[0].toFixed(4)}, {coordinates[1].toFixed(4)}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 mt-2 text-red-400 text-sm bg-red-400/10 px-3 py-1.5 rounded-lg w-fit">
                                            <span>📍</span> Haz clic en el mapa para seleccionar
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/25 transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    Confirmar Pedido
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Cart;
