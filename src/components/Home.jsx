import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Globe,
  Key,
  Monitor,
  ArrowRight,
  User,
  LogOut,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronRight,
  Radio
} from 'lucide-react';

const Home = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [quickUrl, setQuickUrl] = useState('');

  const handleQuickScanSubmit = (e) => {
    e.preventDefault();
    if (quickUrl.trim()) {
      // Navigate to dashboard or command center with the URL query
      navigate(`/command-center?url=${encodeURIComponent(quickUrl.trim())}`);
    } else {
      navigate('/dashboard');
    }
  };

  const userName = user?.name || user?.email?.split('@')[0] || null;

  return (
    <div className="home-container">
      {/* Background Cyber Atmosphere */}
      <div className="cyber-glow-bg glow-cyan"></div>
      <div className="cyber-glow-bg glow-violet"></div>
      <div className="cyber-glow-bg glow-magenta"></div>
      <div className="cyber-grid-overlay"></div>

      {/* --- NAVIGATION BAR --- */}
      <nav className="home-navbar">
        <div className="nav-brand">
          <Link to="/" className="nav-logo">
            <Shield className="logo-icon" />
            <span className="logo-pulse"></span>
            <div className="logo-text">
              <span className="brand-name">KAVACHAM</span>
              <span className="v2-tag">V2</span>
            </div>
          </Link>
        </div>

        <div className="nav-links">
          <Link to="/" className="nav-link active">Home</Link>
          <Link to="/dashboard" className="nav-link">Security Dashboard</Link>
          <Link to="/command-center" className="nav-link nav-link-emergency">
            <Radio size={14} className="pulse-red" />
            <span>Command Center</span>
          </Link>
        </div>

        <div className="nav-auth-actions">
          {user ? (
            <div className="user-nav-group">
              <Link to="/dashboard" className="user-profile-pill">
                <div className="avatar-circle">
                  <User size={14} />
                </div>
                <span className="user-name">{userName}</span>
              </Link>
              <button
                type="button"
                className="nav-logout-btn"
                onClick={onLogout}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="cyber-button primary-btn nav-login-btn" id="nav-auth-btn">
              <User size={16} />
              <span>Login / Register</span>
            </Link>
          )}
        </div>
      </nav>

      {/* --- HERO BANNER SECTION --- */}
      <header className="hero-section">
        <div className="hero-content">
          <div className="hero-badge animate-fade-in">
            <Zap size={14} className="text-cyan" />
            <span>KAVACHAM V2 CYBERSECURITY SUITE ACTIVE</span>
          </div>

          <h1 className="hero-title animate-fade-in">
            Your AI Dual Shield Against <br />
            <span className="hero-highlight-cyan">Phishing Spoofs</span> &amp;{' '}
            <span className="hero-highlight-magenta">Data Breaches</span>
          </h1>

          <p className="hero-subtitle animate-fade-in">
            Protect your organization and identity with real-time IDN Punycode homograph attack detection,
            zero-knowledge credential leak audits, and automated emergency threat defense.
          </p>

          {/* Quick Domain Scan Form */}
          <form onSubmit={handleQuickScanSubmit} className="hero-quick-scan animate-fade-in">
            <div className="quick-scan-wrapper">
              <Globe className="input-icon" size={20} />
              <input
                type="text"
                placeholder="Enter suspicious domain e.g. https://аpple.com or paypal-security.xyz"
                value={quickUrl}
                onChange={(e) => setQuickUrl(e.target.value)}
                className="cyber-input mono-font hero-scan-input"
                id="hero-url-input"
              />
              <button type="submit" className="cyber-button primary-btn hero-cta-btn" id="hero-scan-btn">
                <span>Analyze Threat</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </form>

          {/* Hero Metrics Bar */}
          <div className="hero-stats-grid">
            <div className="stat-card">
              <span className="stat-number text-cyan">99.9%</span>
              <span className="stat-label">Homograph Spoof Precision</span>
            </div>
            <div className="stat-card">
              <span className="stat-number text-emerald">0 ms</span>
              <span className="stat-label">ZK Leak Probability</span>
            </div>
            <div className="stat-card">
              <span className="stat-number text-magenta">100K+</span>
              <span className="stat-label">Typosquatting Threats Blocked</span>
            </div>
          </div>
        </div>
      </header>

      {/* --- FEATURE SHOWCASE CARDS --- */}
      <section className="features-section">
        <div className="section-header">
          <div className="section-tag">
            <Layers size={14} />
            <span>CYBERSECURITY DEFENSE ARCHITECTURE</span>
          </div>
          <h2 className="section-title">Triple-Layer Threat Protection</h2>
          <p className="section-subtitle">
            Kavacham V2 deploys advanced deep-inspection algorithms and zero-knowledge proofs to neutralize attacks before damage occurs.
          </p>
        </div>

        <div className="features-grid">
          {/* Card 1: Homograph & WHOIS Detective */}
          <div className="cyber-card feature-card">
            <div className="feature-icon-wrapper icon-cyan">
              <Globe size={26} />
            </div>
            <h3 className="feature-title">Homograph &amp; WHOIS Detective</h3>
            <p className="feature-description">
              Unmasks Internationalized Domain Names (IDN) that misuse Cyrillic, Greek, or Latin lookalike characters to spoof legitimate brand URLs. Inspects Punycode transformations, registration age, and SSL anomalies in real time.
            </p>
            <ul className="feature-bullets">
              <li>
                <CheckCircle2 size={16} className="text-cyan" />
                <span>Punycode IDN decoding (`xn--...`)</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-cyan" />
                <span>Cyrillic &amp; Greek character substitution engine</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-cyan" />
                <span>Automated risk scoring (0-100)</span>
              </li>
            </ul>
            <Link to="/dashboard" className="feature-link text-cyan">
              <span>Launch Domain Scanner</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* Card 2: Zero-Knowledge Breach Auditor */}
          <div className="cyber-card feature-card">
            <div className="feature-icon-wrapper icon-violet">
              <Key size={26} />
            </div>
            <h3 className="feature-title">Zero-Knowledge Breach Auditor</h3>
            <p className="feature-description">
              Evaluates master passwords against billions of compromised data breach records using mathematical $k$-Anonymity. Computes SHA-1 hash prefixes locally so your actual credentials never leave your client browser.
            </p>
            <ul className="feature-bullets">
              <li>
                <CheckCircle2 size={16} className="text-violet" />
                <span>$k$-Anonymity 5-character SHA-1 prefix matching</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-violet" />
                <span>Entropy &amp; length calculation in bits</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-violet" />
                <span>100% Client-Side Privacy Guarantee</span>
              </li>
            </ul>
            <Link to="/dashboard" className="feature-link text-violet">
              <span>Audit Password Vault</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* Card 3: Live Chrome Extension Guard */}
          <div className="cyber-card feature-card">
            <div className="feature-icon-wrapper icon-emerald">
              <Monitor size={26} />
            </div>
            <h3 className="feature-title">Live Chrome Extension Guard</h3>
            <p className="feature-description">
              Continuous background monitoring agent integrated into your Web Browser. Intercepts phishing URLs before tab execution, warning users instantly with automated Emergency Command Center response actions.
            </p>
            <ul className="feature-bullets">
              <li>
                <CheckCircle2 size={16} className="text-emerald" />
                <span>Pre-navigation HTTP request interceptor</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-emerald" />
                <span>Direct integration with Emergency Command Center</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-emerald" />
                <span>Zero latency impact on browsing speed</span>
              </li>
            </ul>
            <Link to="/command-center" className="feature-link text-emerald">
              <span>View Emergency Command Center</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- CTA BANNER --- */}
      <section className="cta-section">
        <div className="cyber-card cta-card">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Fortify Your Cyber Defense?</h2>
            <p className="cta-description">
              Join thousands of operators utilizing Kavacham V2 for automated typosquatting detection and zero-knowledge security audits.
            </p>
            <div className="cta-button-group">
              <Link to="/dashboard" className="cyber-button primary-btn">
                <Activity size={18} />
                <span>Open Security Dashboard</span>
              </Link>
              <Link to="/command-center" className="cyber-button secondary-btn">
                <AlertTriangle size={18} />
                <span>Emergency Action Center</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Shield size={20} className="text-cyan" />
            <span className="footer-title">KAVACHAM V2</span>
          </div>
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} Kavacham Cyber Defense Protocol. All rights reserved. Zero-Knowledge ZK-Vault Architecture.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
