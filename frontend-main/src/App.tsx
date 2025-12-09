import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import OrderTracking from './pages/OrderTracking';
import AdminDashboard from './pages/AdminDashboard';

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === 'ADMIN' ? children : <Navigate to="/catalog" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/catalog" element={<PrivateRoute><Catalog /></PrivateRoute>} />
      <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
      <Route path="/orders" element={<PrivateRoute><OrderTracking /></PrivateRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/" element={<Navigate to="/catalog" />} />
    </Routes>
  );
}

export default App;
