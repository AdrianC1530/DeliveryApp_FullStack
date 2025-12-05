import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { logout, user } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen flex flex-col bg-background text-white font-sans selection:bg-primary/30">
            <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-surface/50 backdrop-blur-xl supports-[backdrop-filter]:bg-surface/20">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/catalog" className="flex items-center gap-2 group">
                        <span className="text-2xl">🍕</span>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary group-hover:opacity-80 transition-opacity">
                            DeliveryApp
                        </span>
                    </Link>

                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center gap-6">
                            {[
                                { path: '/catalog', label: 'Menu' },
                                { path: '/orders', label: 'Orders' },
                            ].map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="relative text-sm font-medium transition-colors hover:text-white"
                                >
                                    <span className={isActive(link.path) ? 'text-white' : 'text-muted'}>
                                        {link.label}
                                    </span>
                                    {isActive(link.path) && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-primary"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>

                        <Link
                            to="/cart"
                            className={`relative p-2 rounded-full hover:bg-white/5 transition-colors ${isActive('/cart') ? 'text-primary' : 'text-muted hover:text-white'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg border border-background">
                                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                                </span>
                            )}
                        </Link>

                        <div className="h-6 w-px bg-white/10 hidden md:block"></div>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-sm font-medium text-white">{user?.name}</span>
                                <span className="text-[10px] text-muted uppercase tracking-wider">{user?.role}</span>
                            </div>
                            <button
                                onClick={() => { logout(); navigate('/login'); }}
                                className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors hover:bg-red-400/10 px-3 py-1.5 rounded-lg"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                >
                    {children}
                </motion.div>
            </main>

            <footer className="border-t border-white/10 bg-surface/30 backdrop-blur-md mt-auto">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-muted text-sm">
                            &copy; {new Date().getFullYear()} DeliveryApp. All rights reserved.
                        </div>
                        <div className="flex gap-6 text-sm text-muted">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
