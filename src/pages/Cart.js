import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { apiPlaceOrder } from '../api';
import './Cart.css';

export default function Cart() {
  const nav = useNavigate();
  const { cartItems, selectedCourt, addToCart, removeFromCart, deleteFromCart, clearCart, totalAmount } = useCart();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  if (!cartItems.length) return (
    <div className="page-wrap"><div className="container">
      <div className="empty-cart">
        <div className="ec-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add items from a food court to get started</p>
        <button className="btn-green lg" onClick={() => nav('/food-courts')}>Browse Food Courts</button>
      </div>
    </div></div>
  );

  const maxPrep = Math.max(...cartItems.map(i => i.prepTime || 5));

  const handlePlace = async () => {
    setError(''); setLoading(true);
    try {
      const payload = {
        food_court_id: selectedCourt.id,
        items: cartItems.map(i => ({ menu_item_id: i.id, quantity: i.qty })),
      };
      const order = await apiPlaceOrder(payload);
      clearCart();
      nav(`/order-status/${order.id}`);
    } catch (err) {
      const msgs = Object.values(err).flat();
      setError(msgs[0] || 'Could not place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      <div className="container">
        <div className="cart-layout">

          {/* Items */}
          <div className="cart-items-col">
            <h1 className="page-title">Your Cart</h1>
            {selectedCourt && (
              <p className="page-sub" style={{ marginBottom:20 }}>
                📍 {selectedCourt.name} · 9:00 AM – 7:00 PM
              </p>
            )}
            {error && <div className="error-msg">{error}</div>}

            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="ci-img">
                  <img src={item.image} alt={item.name} onError={e => e.target.style.display='none'} />
                </div>
                <div className="ci-info">
                  <h3>{item.name}</h3>
                  <p className="ci-qty-label">{item.quantity}</p>
                  <p className="ci-prep">⏱ ~{item.prepTime} min</p>
                </div>
                <div className="ci-right">
                  <span className="ci-price">₹{(item.price * item.qty).toFixed(0)}</span>
                  <div className="qty-ctrl-sm">
                    <button onClick={() => removeFromCart(item.id)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>
                  <button className="del-btn" onClick={() => deleteFromCart(item.id)}>🗑</button>
                </div>
              </div>
            ))}

            <button className="clear-link" onClick={() => { clearCart(); nav('/food-courts'); }}>
              Clear Cart & Change Food Court
            </button>
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h2 className="sum-title">Order Summary</h2>

            {selectedCourt && (
              <div className="sum-court">
                <span>📍</span>
                <div>
                  <p style={{ fontWeight:700, fontSize:14 }}>{selectedCourt.name}</p>
                  <p style={{ fontSize:11, color:'var(--gray-400)' }}>9:00 AM – 7:00 PM</p>
                </div>
              </div>
            )}

            <div className="sum-rows">
              {cartItems.map(i => (
                <div key={i.id} className="sum-row">
                  <span>{i.name} ×{i.qty}</span>
                  <span>₹{(i.price * i.qty).toFixed(0)}</span>
                </div>
              ))}
            </div>

            <div className="sum-divider" />
            <div className="sum-total"><span>Total</span><span>₹{totalAmount.toFixed(0)}</span></div>

            <div className="sum-prep">
              <span>⏱ Estimated ready in</span>
              <span style={{ fontWeight:700, color:'var(--green)' }}>~{maxPrep + 2} mins</span>
            </div>

            <div className="sum-pay">💵 Pay at Counter · No online payment needed</div>

            <button className="place-btn" onClick={handlePlace} disabled={loading}>
              {loading ? 'Placing Order…' : 'Place Order →'}
            </button>

            <button className="continue-link" onClick={() => nav(`/menu/${selectedCourt?.id}`)}>
              ← Continue Adding Items
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
