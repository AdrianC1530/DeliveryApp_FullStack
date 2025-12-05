import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { logout, user } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="app-layout">
            <nav className="sticky top-0 z-50 bg-card border-b border-white/10 backdrop-blur-md bg-opacity-80">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/catalog" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        DeliveryApp
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link
                            to="/catalog"
                            className={`text-sm font-medium transition-colors ${isActive('/catalog') ? 'text-primary' : 'text-muted hover:text-white'}`}
                        >
                            Menu
                        </Link>
                        <Link
                            to="/orders"
                            className={`text-sm font-medium transition-colors ${isActive('/orders') ? 'text-primary' : 'text-muted hover:text-white'}`}
                        >
                            Orders
                        </Link>
                        <Link
                            to="/cart"
                            className={`relative text-sm font-medium transition-colors ${isActive('/cart') ? 'text-primary' : 'text-muted hover:text-white'}`}
                        >
                            Cart
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-3 bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                                </span>
                            )}
                        </Link>

                        <div className="h-6 w-px bg-white/10 mx-2"></div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted hidden md:block">Hi, {user?.name}</span>
                            <button
                                onClick={() => { logout(); navigate('/login'); }}
                                className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="main-content container mx-auto px-4 page-transition">
                {children}
            </main>
            <footer className="border-t border-white/10 py-8 mt-auto">
                <div className="container mx-auto px-4 text-center text-muted text-sm">
                    <p>&copy; {new Date().getFullYear()} DeliveryApp. Crafted with precision.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
