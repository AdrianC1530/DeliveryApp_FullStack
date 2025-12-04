import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Cart = () => {
    const { items, removeFromCart, total, clearCart } = useCart();
    const navigate = useNavigate();

    const handleCheckout = async () => {
        try {
            await api.post('/orders', {
                items: items.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
                total,
            });
            clearCart();
            alert('Order placed successfully!');
            navigate('/orders');
        } catch (error) {
            console.error('Error placing order', error);
            alert('Failed to place order');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
                    <button onClick={() => navigate('/catalog')} className="text-blue-600 hover:underline">
                        Back to Menu
                    </button>
                </div>
                {items.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Your cart is empty.</p>
                ) : (
                    <>
                        <div className="space-y-4 mb-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center border-b pb-4">
                                    <div>
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-sm text-gray-600">
                                            ${item.price} x {item.quantity}
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-bold mr-4">${item.price * item.quantity}</span>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center border-t pt-4">
                            <span className="text-xl font-bold">Total:</span>
                            <span className="text-xl font-bold text-green-600">${total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                            Checkout
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;
