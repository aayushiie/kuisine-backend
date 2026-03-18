import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiOrderDetail } from '../api';
import './OrderStatus.css';

const STEPS = ['Placed', 'Preparing', 'Ready'];

export default function OrderStatus() {
  const { orderId } = useParams();
  const nav = useNavigate();
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const fetchOrder = async () => {
    try {
      const data = await apiOrderDetail(orderId);
      setOrder(data);
    } catch {
      setError('Could not load order.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Poll every 5 seconds for live updates
    const iv = setInterval(fetchOrder, 5000);
    return () => clearInterval(iv);
  }, [orderId]);

  if (loading) return <div className="page-wrap"><div className="spinner" /></div>;
  if (error)   return <div className="page-wrap"><div className="container"><div className="error-msg">{error}</div></div></div>;
  if (!order)  return null;

  const step    = STEPS.indexOf(order.status);
  const placed  = new Date(order.created_at);

  return (
    <div className="page-wrap">
      <div className="container">
        <div className="os-layout">

          {/* Status Card */}
          <div className="os-card">
            <div className={`os-hero os-${order.status.toLowerCase()}`}>
              <div className="os-icon">
                {order.status === 'Placed'    && '📋'}
                {order.status === 'Preparing' && '👨‍🍳'}
                {order.status === 'Ready'     && '✅'}
              </div>
              <h1 className="os-headline">
                {order.status === 'Placed'    && 'Order Placed!'}
                {order.status === 'Preparing' && 'Being Prepared…'}
                {order.status === 'Ready'     && '🎉 Ready for Pickup!'}
              </h1>
              <p className="os-sub">
                {order.status === 'Placed'    && 'Your order has been received. Kitchen will start soon.'}
                {order.status === 'Preparing' && `Ready in ~${order.estimated_prep_time} min`}
                {order.status === 'Ready'     && 'Head to the counter and collect your order!'}
              </p>
            </div>

            {/* Progress */}
            <div className="os-steps">
              {STEPS.map((s, i) => (
                <div key={s} className="os-step-wrap">
                  <div className={`os-step ${i <= step ? 'done' : ''} ${i === step ? 'active' : ''}`}>
                    <div className="os-dot">
                      {i < step ? '✓' : i === step && order.status !== 'Ready' ? <span className="spin-el">⟳</span> : i === step ? '✓' : ''}
                    </div>
                    <span>{s}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={`os-line ${i < step ? 'filled' : ''}`} />}
                </div>
              ))}
            </div>

            <div className="os-meta">
              {[
                ['Order ID',    <span className="mono">#{order.id}</span>],
                ['Food Court',  order.food_court?.name],
                ['Ordered at',  placed.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })],
                ['Est. Ready',  `~${order.estimated_prep_time} min`],
                ['Total',       <strong>₹{order.total_amount}</strong>],
                ['Payment',     <span className="tag-pay">Pay at Counter 💵</span>],
              ].map(([label, val]) => (
                <div key={label} className="os-row">
                  <span>{label}</span><span>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Items + Actions */}
          <div className="os-right">
            <h2 className="os-items-title">Order Items</h2>
            <div className="os-items">
              {order.items.map(item => (
                <div key={item.id} className="os-item">
                  <div className="osi-img">
                    <img src={item.image_url} alt={item.name} onError={e => e.target.style.display='none'} />
                  </div>
                  <span className="osi-name">{item.name}</span>
                  <span className="osi-qty">×{item.quantity}</span>
                  <span className="osi-price">₹{item.subtotal}</span>
                </div>
              ))}
            </div>
            <div className="os-total">
              <span>Total</span><span>₹{order.total_amount}</span>
            </div>

            {order.status === 'Ready' && (
              <div className="pickup-alert">
                <div style={{ fontSize:28 }}>🔔</div>
                <div>
                  <p style={{ fontWeight:700, color:'#166534', marginBottom:4 }}>Your order is ready!</p>
                  <p style={{ fontSize:12, lineHeight:1.6 }}>
                    Go to <strong>{order.food_court?.name}</strong> counter · Order <strong className="mono">#{order.id}</strong>
                  </p>
                </div>
              </div>
            )}

            <div className="os-actions">
              <button className="btn-green" style={{ width:'100%', padding:'13px' }} onClick={() => nav('/food-courts')}>
                Order Again
              </button>
              <button className="os-outline-btn" onClick={() => nav('/my-orders')}>My Orders</button>
            </div>

            <p className="os-poll-note">🔄 Live updates every 5 seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
}
