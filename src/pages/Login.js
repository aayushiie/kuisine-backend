import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiLogin } from '../api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const data = await apiLogin(form);
      login(data.token, data.user);
      // Redirect based on role
      nav(data.user.role === 'staff' ? '/staff' : '/food-courts');
    } catch (err) {
      setError(err.non_field_errors?.[0] || err.detail || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-up">
        <div className="auth-logo"><span>K</span>uisine</div>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-sub">Login to order from KIIT food courts</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={submit} className="auth-form">
          <div className="field">
            <label>Email Address</label>
            <input
              type="email" name="email"
              placeholder="yourname@kiit.ac.in"
              value={form.email} onChange={handle} required
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password" name="password"
              placeholder="Enter your password"
              value={form.password} onChange={handle} required
            />
          </div>
          <button type="submit" className="btn-green" style={{ width:'100%', padding:'14px', fontSize:15 }} disabled={loading}>
            {loading ? 'Logging in…' : 'Login →'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>

        <div className="demo-accounts">
          <p>Demo accounts:</p>
          <div className="demo-row">
            <span>👨‍🎓 Student:</span>
            <span>student@kiit.ac.in / password123</span>
          </div>
          <div className="demo-row">
            <span>👨‍🍳 Staff:</span>
            <span>staff@kiit.ac.in / password123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
