import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import FoodCourts from './pages/FoodCourts';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import OrderStatus from './pages/OrderStatus';
import MyOrders from './pages/MyOrders';
import StaffDashboard from './pages/StaffDashboard';

// Protect routes — redirect to login if not authenticated
function Protected({ children, staffOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  if (!user)   return <Navigate to="/login" replace />;
  if (staffOnly && user.role !== 'staff') return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected — all users */}
        <Route path="/" element={<Protected><Home /></Protected>} />
        <Route path="/food-courts" element={<Protected><FoodCourts /></Protected>} />
        <Route path="/menu/:courtId" element={<Protected><Menu /></Protected>} />
        <Route path="/cart" element={<Protected><Cart /></Protected>} />
        <Route path="/order-status/:orderId" element={<Protected><OrderStatus /></Protected>} />
        <Route path="/my-orders" element={<Protected><MyOrders /></Protected>} />

        {/* Staff only */}
        <Route path="/staff" element={<Protected staffOnly><StaffDashboard /></Protected>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
