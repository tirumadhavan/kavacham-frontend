import React, { useState } from 'react';
import API from '../api/axios';
import { 
  Shield, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle,
  KeyRound,
  Cpu
} from 'lucide-react';

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleTabSwitch = (loginState) => {
    setIsLogin(loginState);
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };

    try {
      const response = await API.post(endpoint, payload);
      
      const token = response.data?.token || response.data?.accessToken || response.data?.data?.token;
      const user = response.data?.user || response.data?.data?.user || {
        email: formData.email,
        name: formData.name || formData.email.split('@')[0]
      };

      if (!token) {
        throw new Error('No authentication token returned by server.');
      }

      // Save token and user object in localStorage as requested
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setSuccessMsg(isLogin ? 'Authentication successful! Accessing vault...' : 'Account registered successfully! Logging in...');

      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(user, token);
        }
      }, 600);

    } catch (err) {
      console.error('Auth request error:', err);
      const serverErr = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(serverErr || 'Authentication failed. Please verify credentials and API server availability.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Background Cyber Glow Effects */}
      <div className="cyber-glow-bg glow-cyan"></div>
      <div className="cyber-glow-bg glow-violet"></div>
      <div className="cyber-grid-overlay"></div>

      <div className="auth-card-wrapper">
        {/* Brand Header */}
        <div className="auth-brand">
          <div className="brand-logo-icon">
            <Shield className="shield-icon" />
            <div className="logo-pulse"></div>
          </div>
          <h1 className="brand-title">
            KAVACHAM <span className="brand-v2">V2</span>
          </h1>
          <p className="brand-subtitle">
            Next-Gen Typosquatting Defense & Zero-Knowledge Credential Vault
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => handleTabSwitch(true)}
              id="login-tab-btn"
            >
              <KeyRound size={16} />
              <span>Login</span>
            </button>
            <button
              type="button"
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => handleTabSwitch(false)}
              id="register-tab-btn"
            >
              <User size={16} />
              <span>Register</span>
            </button>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="auth-alert error-alert" role="alert">
              <AlertCircle size={18} className="alert-icon" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="auth-alert success-alert" role="alert">
              <CheckCircle size={18} className="alert-icon" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="auth-name">Full Name / Operator Handle</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input
                    id="auth-name"
                    type="text"
                    name="name"
                    placeholder="e.g. Alex Vance"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    className="cyber-input"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="auth-email">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  id="auth-email"
                  type="email"
                  name="email"
                  placeholder="secops@kavacham.io"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="cyber-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="auth-password">Master Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="cyber-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="cyber-button primary-btn"
              disabled={loading}
              id="auth-submit-btn"
            >
              {loading ? (
                <span className="btn-loading-state">
                  <Cpu className="spin-icon" size={18} />
                  <span>Authenticating...</span>
                </span>
              ) : (
                <span className="btn-content">
                  <span>{isLogin ? 'Access Security Center' : 'Create Operator Account'}</span>
                  <ArrowRight size={18} />
                </span>
              )}
            </button>
          </form>

          {/* Security Guarantee Footer */}
          <div className="auth-card-footer">
            <div className="sec-badge">
              <span className="status-dot"></span>
              <span>256-bit ZK-Encryption Standard Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
