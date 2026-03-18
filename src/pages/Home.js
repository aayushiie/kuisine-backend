import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

export default function Home() {
  const nav = useNavigate();
  const { user, isStaff } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content container">
          <span className="hero-eyebrow">KIIT University · Smart Food Ordering</span>
          <h1 className="hero-h1">
            Skip the Queue.<br />
            <span className="accent">Grab Your Food</span><br />
            Faster.
          </h1>
          <p className="hero-p">
            Pre-order from KIIT food courts and collect when ready.<br />
            No more waiting in long lines.
          </p>
          <div className="hero-btns">
            {isStaff ? (
              <button className="btn-green lg" onClick={() => nav('/staff')}>Staff Dashboard →</button>
            ) : (
              <>
                <button className="btn-green lg" onClick={() => nav('/food-courts')}>Order Now</button>
                <button className="btn-outline"  onClick={() => nav('/food-courts')}>View Food Courts</button>
              </>
            )}
          </div>
          {user && (
            <div className="hero-welcome">
              Welcome back, <strong>{user.name}</strong>! 👋
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="how">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            {[
              { n:'1', icon:'🔐', title:'Login',            desc:'Sign in as student or staff' },
              { n:'2', icon:'🍽️', title:'Select Food Court', desc:'Pick from KIIT food courts' },
              { n:'3', icon:'🍴', title:'Browse & Order',   desc:'Add items to cart and place order' },
              { n:'4', icon:'🔔', title:'Collect & Pay',    desc:'Get notified, pick up and pay' },
            ].map(s => (
              <div key={s.n} className="step-card">
                <div className="step-num">{s.n}</div>
                <div className="step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Food Courts Preview */}
      <section className="courts-preview">
        <div className="container">
          <h2 className="section-title">Available Food Courts</h2>
          <div className="courts-mini-grid">
            {['Food Court 3','Food Court 6','Food Court 7','Food Court 8','Food Court 12','Food Court 14','Food Court 15','Food Court 25','KIIT Kafeteria'].map((name, i) => (
              <div key={i} className="court-mini-card" onClick={() => nav('/food-courts')}>
                <span className="court-mini-icon">🍛</span>
                <span className="court-mini-name">{name}</span>
                <span className="court-mini-time">9:00 AM – 7:00 PM</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="feat-grid">
            {[
              { icon:'⏱️', title:'Save Time',       desc:'Skip the counter queue entirely.' },
              { icon:'📱', title:'Live Tracking',   desc:'Placed → Preparing → Ready updates.' },
              { icon:'🔒', title:'Pay at Counter',  desc:'No online payment needed.' },
              { icon:'📊', title:'Table Availability', desc:'Check tables before heading out.' },
            ].map((f, i) => (
              <div key={i} className="feat-card fade-up" style={{ animationDelay:`${i*0.08}s` }}>
                <div className="feat-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>Accessible within KIIT Campus Wi-Fi or Internet · 9:00 AM – 7:00 PM</p>
          <p>© 2026 Kuisine · KIIT University · Group 23</p>
        </div>
      </footer>
    </div>
  );
}
