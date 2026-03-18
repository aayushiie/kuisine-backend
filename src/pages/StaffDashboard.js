import React, { useState, useEffect, useCallback } from 'react';
import { apiOrders, apiUpdateOrderStatus, apiFoodCourts, apiStats } from '../api';
import './StaffDashboard.css';

const SC = { Placed:'#3b82f6', Preparing:'#f59e0b', Ready:'#22c55e' };
const NEXT = { Placed:'Preparing', Preparing:'Ready' };

export default function StaffDashboard() {
  const [orders,  setOrders]  = useState([]);
  const [courts,  setCourts]  = useState([]);
  const [stats,   setStats]   = useState(null);
  const [court,   setCourt]   = useState('all');
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const fetchAll = useCallback(async () => {
    try {
      const params = court !== 'all' ? `?food_court=${court}` : '';
      const [ordersData, courtsData, statsData] = await Promise.all([
        apiOrders(params),
        apiFoodCourts(),
        apiStats(),
      ]);
      setOrders(ordersData);
      setCourts(courtsData);
      setStats(statsData);
    } catch {
      setError('Could not load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [court]);

  useEffect(() => {
    fetchAll();
    const iv = setInterval(fetchAll, 8000); // auto-refresh every 8s
    return () => clearInterval(iv);
  }, [fetchAll]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const updated = await apiUpdateOrderStatus(orderId, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    } catch {
      alert('Could not update status.');
    }
  };

  const elapsed = (t) => {
    const s = Math.floor((Date.now() - new Date(t)) / 1000);
    return s < 60 ? `${s}s ago` : `${Math.floor(s / 60)}m ago`;
  };

  const active = orders.filter(o => ['Placed','Preparing','Ready'].includes(o.status));
  const by = {
    Placed:    active.filter(o => o.status === 'Placed'),
    Preparing: active.filter(o => o.status === 'Preparing'),
    Ready:     active.filter(o => o.status === 'Ready'),
  };

  if (loading) return <div className="page-wrap"><div className="spinner" /></div>;

  return (
    <div className="page-wrap">
      <div className="container">

        <div className="sd-header">
          <div>
            <h1 className="page-title">Staff Dashboard</h1>
            <p className="page-sub">Live order management · Auto-refreshes every 8 seconds</p>
          </div>
          <div className="sd-stats">
            {[
              ['New',       by.Placed.length,    '#e0f2fe','#0369a1'],
              ['Preparing', by.Preparing.length, '#fef3c7','#92400e'],
              ['Ready',     by.Ready.length,     '#dcfce7','#166534'],
              ['Total',     stats?.total_orders || 0, '#f3f4f6','#374151'],
            ].map(([label, count, bg, color]) => (
              <div key={label} className="sd-stat" style={{ background:bg, color }}>
                <span className="sd-stat-num">{count}</span>
                <p>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div className="sd-toolbar">
          <select className="court-sel" value={court} onChange={e => setCourt(e.target.value)}>
            <option value="all">All Food Courts</option>
            {courts.map(fc => <option key={fc.id} value={fc.id}>{fc.name}</option>)}
          </select>
          <div className="live-pill">
            <span className="live-dot" /> Live · Auto-refresh
          </div>
          <button className="refresh-btn" onClick={fetchAll}>↻ Refresh</button>
        </div>

        {!active.length ? (
          <div className="empty-msg">No active orders right now. New orders will appear automatically.</div>
        ) : (
          <div className="kanban">
            {['Placed','Preparing','Ready'].map(status => (
              <div key={status} className="k-col">
                <div className="k-col-hdr" style={{ borderColor:SC[status] }}>
                  <h3>
                    {status === 'Placed'    && '📋 New Orders'}
                    {status === 'Preparing' && '👨‍🍳 Preparing'}
                    {status === 'Ready'     && '✅ Ready'}
                  </h3>
                  <span className="k-count" style={{ background:SC[status] }}>{by[status].length}</span>
                </div>

                <div className="k-cards">
                  {!by[status].length && <div className="k-empty">No orders here</div>}
                  {by[status].map(order => (
                    <div key={order.id} className="k-card">
                      <div className="k-card-top">
                        <span className="k-id">#{order.id}</span>
                        <span className="k-time">{elapsed(order.created_at)}</span>
                      </div>
                      <p className="k-student">👤 {order.student?.name}</p>
                      <p className="k-court">{order.food_court?.name}</p>
                      <div className="k-items">
                        {order.items.map(item => (
                          <div key={item.id} className="k-item">
                            <div className="k-item-img">
                              <img src={item.image_url} alt={item.name} onError={e => e.target.style.display='none'} />
                            </div>
                            <span className="k-item-name">{item.name}</span>
                            <span className="k-item-qty">×{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="k-footer">
                        <span className="k-total">₹{order.total_amount}</span>
                        {NEXT[status] && (
                          <button
                            className="k-action"
                            style={{ background: SC[NEXT[status]] }}
                            onClick={() => updateStatus(order.id, NEXT[status])}
                          >
                            Mark {NEXT[status]} →
                          </button>
                        )}
                        {status === 'Ready' && (
                          <span className="k-ready-tag">Awaiting pickup</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
