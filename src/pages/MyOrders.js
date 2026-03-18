import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiOrders } from '../api';
import './MyOrders.css';

const SC = {
  Placed:    { bg:'#e0f2fe', color:'#0369a1', icon:'📋' },
  Preparing: { bg:'#fef3c7', color:'#92400e', icon:'👨‍🍳' },
  Ready:     { bg:'#dcfce7', color:'#166534', icon:'✅' },
  Collected: { bg:'#f3f4f6', color:'#6b7280', icon:'✔️' },
};

export default function MyOrders() {
  const nav = useNavigate();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    apiOrders()
      .then(data => setOrders(data))
      .catch(() => setError('Could not load orders.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-wrap"><div className="spinner" /></div>;

  if (!orders.length) return (
    <div className="page-wrap"><div className="container">
      <div className="empty-cart">
        <div className="ec-icon">📋</div>
        <h2>No orders yet</h2>
        <p>Your past orders will appear here</p>
        <button className="btn-green lg" onClick={() => nav('/food-courts')}>Order Now</button>
      </div>
    </div></div>
  );

  return (
    <div className="page-wrap">
      <div className="container">
        <div style={{ marginBottom:24 }}>
          <h1 className="page-title">My Orders</h1>
          <p className="page-sub">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div className="orders-list">
          {orders.map(order => {
            const s = SC[order.status] || SC.Placed;
            const placed = new Date(order.created_at);
            return (
              <div key={order.id} className="order-card fade-up" onClick={() => nav(`/order-status/${order.id}`)}>
                <div className="oc-header">
                  <div>
                    <p className="oc-id">Order #{order.id}</p>
                    <p className="oc-court">{order.food_court?.name}</p>
                    <p className="oc-time">
                      {placed.toLocaleDateString()} at {placed.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                    </p>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
                    <span className="oc-badge" style={{ background:s.bg, color:s.color }}>
                      {s.icon} {order.status}
                    </span>
                    <span className="oc-amount">₹{order.total_amount}</span>
                  </div>
                </div>

                <div className="oc-items">
                  {order.items.map(item => (
                    <div key={item.id} className="oc-item-chip">
                      <img src={item.image_url} alt={item.name} onError={e => e.target.style.display='none'} />
                      <span>{item.name} ×{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="oc-footer">
                  <span className="oc-view">View Details →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
