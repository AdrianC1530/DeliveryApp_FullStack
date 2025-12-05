import { useCart } from '../context/CartContext';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

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
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block">
                    Your Cart
                </h2>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-20 card border-dashed">
                    <div className="text-6xl mb-4">🛒</div>
                    <p className="text-xl text-muted mb-6">Your cart is empty</p>
                    <button onClick={() => navigate('/catalog')} className="btn btn-primary">
                        Browse Menu
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="card flex items-center p-4 gap-4 hover:border-primary/30 transition-colors">
                                <div className="w-20 h-20 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">🍔</span>
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-bold text-lg">{item.name}</h3>
                                    <p className="text-muted text-sm">${item.price.toFixed(2)} x {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg mb-2">${(item.price * item.quantity).toFixed(2)}</p>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="card sticky top-24">
                            <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Order Summary</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-muted">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted">
                                    <span>Delivery Fee</span>
                                    <span>$2.50</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold pt-4 border-t border-white/10">
                                    <span>Total</span>
                                    <span className="text-primary">${(total + 2.50).toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full btn btn-primary py-3 text-lg shadow-glow"
                            >
                                Checkout Now
                            </button>

                            <button
                                onClick={() => navigate('/catalog')}
                                className="w-full mt-4 text-center text-sm text-muted hover:text-white transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Cart;
