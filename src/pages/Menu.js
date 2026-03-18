import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiMenu, apiFoodCourtDetail } from '../api';
import { useCart } from '../context/CartContext';
import './Menu.css';

const CATS = ['All', 'Food', 'Snacks', 'Beverages'];

export default function Menu() {
  const { courtId } = useParams();
  const nav = useNavigate();
  const { cartItems, selectedCourt, setSelectedCourt, addToCart, removeFromCart, totalItems, totalAmount } = useCart();

  const [menu,    setMenu]    = useState([]);
  const [court,   setCourt]   = useState(selectedCourt || null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [cat,     setCat]     = useState('All');
  const [vegOnly, setVegOnly] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [menuData, courtData] = await Promise.all([
          apiMenu(),
          apiFoodCourtDetail(courtId),
        ]);
        setMenu(menuData);
        setCourt(courtData);
        if (!selectedCourt) setSelectedCourt(courtData);
      } catch {
        setError('Could not load menu. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [courtId]);

  const filtered = menu.filter(item =>
    (cat === 'All' || item.category === cat) &&
    (!vegOnly || item.is_veg)
  );

  const getQty = (id) => cartItems.find(i => i.id === id)?.qty || 0;

  const SECTIONS = cat === 'All' ? ['Food', 'Snacks', 'Beverages'] : [cat];

  if (loading) return <div className="page-wrap"><div className="spinner" /></div>;

  return (
    <div className="menu-page">
      {/* Topbar */}
      <div className="menu-topbar">
        <div className="container" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div className="breadcrumb">
            <button onClick={() => nav('/food-courts')}>← Food Courts</button>
            <span>/</span>
            <span>{court?.name}</span>
          </div>
          <span className={`badge-${court?.status}`}>
            {court?.status?.charAt(0).toUpperCase() + court?.status?.slice(1)}
          </span>
        </div>
      </div>

      <div className="container">
        {error && <div className="error-msg" style={{ marginTop:16 }}>{error}</div>}

        <div className="menu-hdr">
          <h1 className="page-title">{court?.name}</h1>
          <p className="page-sub">9:00 AM – 7:00 PM · {court?.available_tables}/{court?.total_tables} tables available</p>
        </div>

        {/* Filters */}
        <div className="menu-filters">
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {CATS.map(c => (
              <button key={c} className={`ftab ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <label className="veg-toggle">
            <input type="checkbox" checked={vegOnly} onChange={e => setVegOnly(e.target.checked)} />
            <span className="toggle-dot" />
            <span>Veg Only</span>
          </label>
        </div>

        {/* Menu sections */}
        {SECTIONS.map(section => {
          const items = filtered.filter(i => i.category === section);
          if (!items.length) return null;
          return (
            <div key={section} className="menu-section">
              <h2 className="menu-sec-title">{section}</h2>
              <div className="menu-grid">
                {items.map(item => (
                  <div key={item.id} className={`menu-card ${!item.is_available ? 'mc-unavail' : ''}`}>
                    <div className="mc-img-wrap">
                      <img src={item.image_url} alt={item.name}
                        onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                      <div className="mc-img-fallback" style={{ display:'none' }}>🍽️</div>
                      <span className={`veg-badge ${item.is_veg ? 'veg' : 'nonveg'}`}>
                        {item.is_veg ? 'VEG' : 'NON-VEG'}
                      </span>
                    </div>
                    <div className="mc-body">
                      <div className="mc-top">
                        <h3 className="mc-name">{item.name}</h3>
                        <span className="mc-price">₹{item.price}</span>
                      </div>
                      <p className="mc-qty-label">{item.quantity}</p>
                      <p className="mc-desc">{item.description}</p>
                      <p className="mc-prep">⏱ ~{item.prep_time} min</p>

                      {!item.is_available ? (
                        <div className="unavail-tag">Currently Unavailable</div>
                      ) : getQty(item.id) === 0 ? (
                        <button className="add-btn" onClick={() => addToCart({
                          id: item.id, name: item.name, price: parseFloat(item.price),
                          quantity: item.quantity, image: item.image_url, prepTime: item.prep_time,
                        })}>+ Add</button>
                      ) : (
                        <div className="qty-ctrl">
                          <button onClick={() => removeFromCart(item.id)}>−</button>
                          <span>{getQty(item.id)}</span>
                          <button onClick={() => addToCart({
                            id: item.id, name: item.name, price: parseFloat(item.price),
                            quantity: item.quantity, image: item.image_url, prepTime: item.prep_time,
                          })}>+</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Cart Bar */}
      {totalItems > 0 && (
        <div className="cart-bar">
          <div className="cb-inner">
            <div>
              <span className="cb-count">{totalItems} item{totalItems > 1 ? 's' : ''}</span>
              <span className="cb-court"> · {court?.name}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <span className="cb-total">₹{totalAmount}</span>
              <button className="cb-btn" onClick={() => nav('/cart')}>View Cart →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
