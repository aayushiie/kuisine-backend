import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isStaff } = useAuth();
  const { totalItems } = useCart();
  const nav = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const active = (p) => loc.pathname === p;

  const handleLogout = async () => {
    await logout();
    nav('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-logo"><span>K</span>uisine</Link>

        {user && (
          <div className={`nav-links ${open ? 'open' : ''}`}>
            <Link to="/food-courts" className={active('/food-courts') ? 'active' : ''} onClick={() => setOpen(false)}>Food Courts</Link>
            {!isStaff && <Link to="/my-orders" className={active('/my-orders') ? 'active' : ''} onClick={() => setOpen(false)}>My Orders</Link>}
            {isStaff  && <Link to="/staff"     className={active('/staff')     ? 'active' : ''} onClick={() => setOpen(false)}>Staff Panel</Link>}
          </div>
        )}

        <div className="nav-right">
          {user ? (
            <>
              <div className="nav-user">
                <span className={`role-chip ${user.role}`}>{user.role}</span>
                <span className="nav-name">{user.name.split(' ')[0]}</span>
              </div>
              {!isStaff && (
                <button className="cart-btn" onClick={() => nav('/cart')}>
                  🛒 {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                </button>
              )}
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="nav-link-btn">Login</Link>
              <Link to="/register" className="btn-green" style={{ padding:'8px 18px', fontSize:13 }}>Register</Link>
            </>
          )}
          <button className="hamburger" onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</button>
        </div>
      </div>
    </nav>
  );
}
