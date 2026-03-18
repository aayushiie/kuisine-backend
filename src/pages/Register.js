import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRegister } from '../api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'student', roll_number:'' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const data = await apiRegister(form);
      login(data.token, data.user);
      nav(data.user.role === 'staff' ? '/staff' : '/food-courts');
    } catch (err) {
      const msgs = Object.values(err).flat();
      setError(msgs[0] || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-up">
        <div className="auth-logo"><span>K</span>uisine</div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-sub">Join KIIT's smart food ordering system</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={submit} className="auth-form">
          <div className="field">
            <label>Full Name</label>
            <input type="text" name="name" placeholder="Your full name"
              value={form.name} onChange={handle} required />
          </div>
          <div className="field">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="yourname@kiit.ac.in"
              value={form.email} onChange={handle} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" name="password" placeholder="Minimum 6 characters"
              value={form.password} onChange={handle} required minLength={6} />
          </div>

          {/* Role selector */}
          <div className="role-selector">
            <label>I am a:</label>
            <div className="role-btns">
              <button type="button"
                className={`role-btn ${form.role === 'student' ? 'active' : ''}`}
                onClick={() => setForm(f => ({ ...f, role: 'student' }))}>
                👨‍🎓 Student
              </button>
              <button type="button"
                className={`role-btn ${form.role === 'staff' ? 'active' : ''}`}
                onClick={() => setForm(f => ({ ...f, role: 'staff' }))}>
                👨‍🍳 Staff
              </button>
            </div>
          </div>

          {form.role === 'student' && (
            <div className="field">
              <label>Roll Number</label>
              <input type="text" name="roll_number" placeholder="e.g. 2305675"
                value={form.roll_number} onChange={handle} />
            </div>
          )}

          <button type="submit" className="btn-green"
            style={{ width:'100%', padding:'14px', fontSize:15 }} disabled={loading}>
            {loading ? 'Creating account…' : 'Register →'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
