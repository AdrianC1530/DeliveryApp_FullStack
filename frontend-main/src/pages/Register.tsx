import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/register', { name, email, password });
            login(response.data.token, response.data.user);
            navigate('/catalog');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al registrarse. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/30 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/30 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 relative z-10"
            >
                <div className="glass rounded-2xl p-8 shadow-2xl border border-white/10">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-block mb-4"
                        >
                            <span className="text-4xl">📝</span>
                        </motion.div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                            Crear Cuenta
                        </h1>
                        <p className="text-muted text-sm">Únete para pedir tu comida favorita</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Nombre Completo</label>
                            <input
                                type="text"
                                className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-200"
                                placeholder="Juan Pérez"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Correo Electrónico</label>
                            <input
                                type="email"
                                className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-200"
                                placeholder="nombre@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Contraseña</label>
                            <input
                                type="password"
                                className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-200"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className={`w-full relative overflow-hidden group bg-gradient-to-r from-primary to-secondary p-[1px] rounded-xl ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <div className="relative bg-surface/50 backdrop-blur-sm rounded-xl px-4 py-3 transition-all duration-200 group-hover:bg-opacity-0">
                                <span className="relative font-semibold text-white flex items-center justify-center gap-2">
                                    {isLoading ? 'Registrando...' : 'Registrarse'}
                                </span>
                            </div>
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-muted">
                            ¿Ya tienes una cuenta? <Link to="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">Iniciar Sesión</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
