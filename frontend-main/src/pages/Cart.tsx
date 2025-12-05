import { useCart } from '../context/CartContext';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
    const { items, removeFromCart, clearCart, total } = useCart();
    const navigate = useNavigate();

    const handleCheckout = async () => {
        try {
            await api.post('/orders', {
                items: items.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
            });
            clearCart();
            navigate('/orders');
        } catch (error) {
            console.error('Error creating order', error);
        }
    };

    return (
        <Layout>
            <div className="mb-8">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block tracking-tight">
                    Your Cart
                </h2>
            </div>

            {items.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20 glass rounded-2xl border-dashed border-2 border-white/10"
                >
                    <div className="text-7xl mb-6 animate-bounce">🛒</div>
                    <p className="text-2xl text-muted mb-8">Your cart is empty</p>
                    <button
                        onClick={() => navigate('/catalog')}
                        className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
                    >
                        Browse Menu
                    </button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="glass rounded-xl p-4 flex items-center gap-6 hover:border-primary/30 transition-colors group"
                                >
                                    <div className="w-24 h-24 bg-surface rounded-lg flex items-center justify-center flex-shrink-0 text-4xl">
                                        🍔
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-xl mb-1">{item.name}</h3>
                                        <p className="text-muted">${item.price.toFixed(2)} x {item.quantity}</p>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-2">
                                        <p className="font-bold text-xl text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors hover:bg-red-400/10 px-3 py-1 rounded-lg"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass rounded-2xl p-6 sticky top-24"
                        >
                            <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Order Summary</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-muted">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted">
                                    <span>Delivery Fee</span>
                                    <span>$2.50</span>
                                </div>
                                <div className="flex justify-between text-2xl font-bold pt-4 border-t border-white/10">
                                    <span>Total</span>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                        ${(total + 2.50).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-200"
                            >
                                Checkout Now
                            </button>

                            <button
                                onClick={() => navigate('/catalog')}
                                className="w-full mt-4 text-center text-sm text-muted hover:text-white transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </motion.div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Cart;
