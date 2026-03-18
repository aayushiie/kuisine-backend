import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFoodCourts } from '../api';
import { useCart } from '../context/CartContext';
import './FoodCourts.css';

export default function FoodCourts() {
  const nav = useNavigate();
  const { setSelectedCourt, clearCart } = useCart();
  const [courts,  setCourts]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    apiFoodCourts()
      .then(data => setCourts(data))
      .catch(() => setError('Could not load food courts. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = courts.filter(fc =>
    fc.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (court) => {
    if (court.status === 'closed') return;
    clearCart();
    setSelectedCourt(court);
    nav(`/menu/${court.id}`);
  };

  const badge = (s) => {
    if (s === 'open')   return <span className="badge-open">Open</span>;
    if (s === 'busy')   return <span className="badge-busy">Busy</span>;
    return <span className="badge-closed">Closed</span>;
  };

  if (loading) return <div className="page-wrap"><div className="spinner" /></div>;

  return (
    <div className="page-wrap">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Food Courts</h1>
          <p className="page-sub">Select a food court to browse the menu and order · Open 9:00 AM – 7:00 PM</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div className="toolbar">
          <input
            className="search-inp"
            placeholder="🔍  Search food courts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="courts-grid">
          {filtered.map((court, i) => (
            <div
              key={court.id}
              className={`court-card ${court.status === 'closed' ? 'cc-closed' : ''} fade-up`}
              style={{ animationDelay:`${i * 0.05}s` }}
            >
              <div className="cc-head">
                <div>
                  <h3 className="cc-name">{court.name}</h3>
                </div>
                {badge(court.status)}
              </div>

              <div className="cc-info">
                <div className="cc-row">
                  <span>🕐 Hours</span>
                  <span>9:00 AM – 7:00 PM</span>
                </div>
                <div className="cc-row">
                  <span>🪑 Tables</span>
                  <span style={{
                    color: court.available_tables === 0 ? 'var(--red)' : court.available_tables < 5 ? 'var(--orange)' : 'var(--green)',
                    fontWeight: 700
                  }}>
                    {court.available_tables}/{court.total_tables} available
                  </span>
                </div>
              </div>

              <div className="cc-bar">
                <div className="cc-fill" style={{
                  width: `${(court.available_tables / court.total_tables) * 100}%`,
                  background: court.available_tables === 0 ? 'var(--red)' : court.available_tables < 5 ? 'var(--orange)' : 'var(--green)'
                }} />
              </div>

              <button
                className={`sel-btn ${court.status === 'closed' ? 'sel-disabled' : ''}`}
                onClick={() => handleSelect(court)}
                disabled={court.status === 'closed'}
              >
                {court.status === 'closed' ? 'Currently Closed' : 'View Menu & Order'}
              </button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && !loading && (
          <div className="empty-msg">No food courts found.</div>
        )}
      </div>
    </div>
  );
}
