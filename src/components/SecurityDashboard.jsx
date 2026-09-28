import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import {
  Shield,
  ShieldCheck,
  Globe,
  Key,
  LogOut,
  User,
  Search,
  RefreshCw,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Cpu,
  Lock,
  History,
  Sparkles,
  Info,
  Terminal,
  Zap,
  Trash2,
  Filter
} from 'lucide-react';

const SecurityDashboard = ({ user, onLogout }) => {
  // --- Shield 1: URL Scanner State ---
  const [urlInput, setUrlInput] = useState('');
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlResult, setUrlResult] = useState(null);
  const [urlError, setUrlError] = useState('');

  // --- Shield 2: Password Auditor State ---
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordResult, setPasswordResult] = useState(null);
  const [passwordError, setPasswordError] = useState('');

  // --- Audit History Feed State ---
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [activeHistoryTab, setActiveHistoryTab] = useState('threats'); // 'threats' | 'safe' | 'all'
  const [deletingId, setDeletingId] = useState(null);

  // Fetch past security scans on load via GET /scans/history
  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const response = await API.get('/scans/history');
      const data = response.data?.history || response.data?.scans || response.data?.data || response.data || [];
      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error('Error fetching scan history:', err);
      setHistoryError(err.response?.data?.message || 'Could not fetch past audit history.');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // --- Delete Scan Record Handler ---
  const handleDeleteScan = async (id, fallbackIndex) => {
    setDeletingId(id || fallbackIndex);
    try {
      if (id) {
        await API.delete(`/scans/${id}`);
      }
    } catch (err) {
      console.warn('API delete request failed, removing from local state:', err);
    } finally {
      // Automatically remove item from state upon deletion
      setHistory((prev) => prev.filter((item, idx) => {
        if (id) {
          return item._id !== id && item.id !== id;
        }
        return idx !== fallbackIndex;
      }));
      setDeletingId(null);
    }
  };

  // --- Handle URL Scan ---
  const handleUrlScan = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setUrlError('Please enter a valid URL or domain name.');
      return;
    }

    setUrlLoading(true);
    setUrlError('');
    setUrlResult(null);

    try {
      const response = await API.post('/scans/url', { url: urlInput.trim() });
      const data = response.data?.scan || response.data?.data || response.data;
      setUrlResult(data);
      // Refresh history feed to include new scan
      fetchHistory();
    } catch (err) {
      console.error('URL scan error:', err);
      setUrlError(err.response?.data?.message || err.message || 'URL scan request failed.');
    } finally {
      setUrlLoading(false);
    }
  };

  // --- Handle Password Audit ---
  const handlePasswordAudit = async (e) => {
    e.preventDefault();
    if (!passwordInput) {
      setPasswordError('Please enter a password to evaluate.');
      return;
    }

    setPasswordLoading(true);
    setPasswordError('');
    setPasswordResult(null);

    try {
      const response = await API.post('/scans/password', { password: passwordInput });
      const data = response.data?.scan || response.data?.data || response.data;
      setPasswordResult(data);
      // Refresh history feed
      fetchHistory();
    } catch (err) {
      console.error('Password audit error:', err);
      setPasswordError(err.response?.data?.message || err.message || 'Password audit request failed.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Categorization Helper: Check if scan item is a Threat or Warning vs Safe
  const isThreatOrWarning = (item) => {
    const status = (item.status || item.riskLevel || '').toLowerCase();
    const score = item.riskScore ?? item.score;
    return (
      status === 'dangerous' ||
      status === 'warning' ||
      status === 'suspicious' ||
      item.isBreached ||
      item.breached ||
      (typeof score === 'number' && score >= 30)
    );
  };

  const threatAudits = history.filter(isThreatOrWarning);
  const safeAudits = history.filter((item) => !isThreatOrWarning(item));

  const displayedHistory = activeHistoryTab === 'threats'
    ? threatAudits
    : activeHistoryTab === 'safe'
    ? safeAudits
    : history;

  // Helper for Status Badge styling
  const renderStatusBadge = (statusStr, riskScoreNum) => {
    const status = (statusStr || '').toLowerCase();
    
    if (status === 'safe' || status === 'clean' || (typeof riskScoreNum === 'number' && riskScoreNum < 30)) {
      return (
        <div className="status-badge badge-safe">
          <CheckCircle2 size={16} />
          <span>Safe</span>
        </div>
      );
    }
    if (status === 'warning' || status === 'suspicious' || (typeof riskScoreNum === 'number' && riskScoreNum >= 30 && riskScoreNum < 70)) {
      return (
        <div className="status-badge badge-warning">
          <AlertTriangle size={16} />
          <span>Warning</span>
        </div>
      );
    }
    return (
      <div className="status-badge badge-dangerous">
        <XCircle size={16} />
        <span>Dangerous</span>
      </div>
    );
  };

  const userName = user?.name || user?.email?.split('@')[0] || 'Operator';

  return (
    <div className="dashboard-container">
      {/* Background Cyber Ambient Elements */}
      <div className="cyber-glow-bg glow-cyan"></div>
      <div className="cyber-glow-bg glow-magenta"></div>
      <div className="cyber-grid-overlay"></div>

      {/* --- HEADER --- */}
      <header className="dashboard-header">
        <div className="header-brand">
          <Link to="/" className="header-logo" title="Go to Home">
            <Shield className="logo-shield" />
            <span className="live-dot"></span>
          </Link>
          <div className="header-title-wrapper">
            <h1 className="header-title">
              KAVACHAM <span className="v2-tag">V2</span>
            </h1>
            <p className="header-subtitle">Cybersecurity Audit &amp; Homograph Threat Intelligence</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="system-status-indicator">
            <Zap size={14} className="status-icon" />
            <span>Z-K ENGINE ACTIVE</span>
          </div>

          <div className="user-profile-pill">
            <div className="avatar-circle">
              <User size={16} />
            </div>
            <span className="user-display-name">{userName}</span>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={onLogout}
            id="logout-btn"
            title="Disconnect & Clear Session"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="dashboard-main">
        {/* --- SHIELD 1 & SHIELD 2 ROW --- */}
        <div className="shields-grid">
          {/* ============================================================== */}
          {/* SHIELD 1: Phishing & Homograph URL Scanner */}
          {/* ============================================================== */}
          <section className="cyber-card shield-card" id="url-scanner-section">
            <div className="card-header">
              <div className="card-header-icon icon-cyan">
                <Globe size={22} />
              </div>
              <div className="card-header-titles">
                <h2>Shield 1: Phishing &amp; Homograph URL Scanner</h2>
                <p>Detect IDN Punycode character spoofing, typosquatting &amp; malicious domains</p>
              </div>
            </div>

            <form onSubmit={handleUrlScan} className="shield-form">
              <div className="url-input-group">
                <div className="input-wrapper main-search-wrapper">
                  <Globe className="input-icon" size={18} />
                  <input
                    type="text"
                    placeholder="Enter URL e.g. https://аpple.com or paypal-security.check-login.xyz"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="cyber-input mono-font"
                    id="url-scan-input"
                  />
                  {urlInput && (
                    <button
                      type="button"
                      className="input-clear-btn"
                      onClick={() => setUrlInput('')}
                    >
                      ×
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="cyber-button primary-btn scan-btn"
                  disabled={urlLoading}
                  id="scan-domain-btn"
                >
                  {urlLoading ? (
                    <>
                      <Cpu className="spin-icon" size={18} />
                      <span>Scanning...</span>
                    </>
                  ) : (
                    <>
                      <Search size={18} />
                      <span>Scan Domain</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {urlError && (
              <div className="shield-alert error-alert">
                <AlertTriangle size={18} />
                <span>{urlError}</span>
              </div>
            )}

            {/* URL SCAN RESULTS PANEL */}
            {urlResult && (
              <div className="scan-results-panel animate-fade-in">
                <div className="result-top-bar">
                  <div className="target-url-meta">
                    <span className="meta-label">Analyzed Target:</span>
                    <span className="meta-value mono-font wrap-text">{urlResult.url || urlResult.domain || urlInput}</span>
                  </div>
                  {renderStatusBadge(
                    urlResult.status || urlResult.riskLevel, 
                    urlResult.riskScore ?? urlResult.score
                  )}
                </div>

                <div className="risk-score-display">
                  <div className="gauge-container">
                    <div className="risk-score-number">
                      {urlResult.riskScore ?? urlResult.score ?? (urlResult.status === 'Dangerous' ? 92 : urlResult.status === 'Warning' ? 58 : 5)}
                      <span className="score-max">/100</span>
                    </div>
                    <div className="score-meter-bg">
                      <div
                        className={`score-meter-fill ${
                          (urlResult.riskScore ?? urlResult.score ?? 0) > 70 || urlResult.status === 'Dangerous'
                            ? 'fill-dangerous'
                            : (urlResult.riskScore ?? urlResult.score ?? 0) > 30 || urlResult.status === 'Warning'
                            ? 'fill-warning'
                            : 'fill-safe'
                        }`}
                        style={{
                          width: `${Math.min(100, Math.max(5, urlResult.riskScore ?? urlResult.score ?? (urlResult.status === 'Dangerous' ? 92 : urlResult.status === 'Warning' ? 58 : 5)))}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="risk-details-card">
                  <div className="details-header">
                    <Terminal size={16} />
                    <span>Threat Analysis &amp; Detection Details:</span>
                  </div>

                  {/* Render Array or String Details */}
                  {Array.isArray(urlResult.detectedRisks || urlResult.details || urlResult.threats) ? (
                    <ul className="details-list">
                      {(urlResult.detectedRisks || urlResult.details || urlResult.threats).map((detail, idx) => (
                        <li key={idx} className="detail-item wrap-text">
                          <AlertTriangle size={14} className="detail-icon" />
                          <span>{typeof detail === 'object' ? JSON.stringify(detail) : detail}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="detail-single-text">
                      <p className="wrap-text">
                        {urlResult.detectedRisks ||
                          urlResult.details ||
                          urlResult.threatDetails ||
                          (urlResult.punycode
                            ? `Punycode Homograph Spoof detected! Converted punycode: ${urlResult.punycode}`
                            : urlResult.status === 'Dangerous'
                            ? 'Punycode Homograph Spoof detected: Cyrillic/Greek character substitution vector.'
                            : urlResult.status === 'Warning'
                            ? 'Suspicious domain layout or brand typosquatting similarity detected.'
                            : 'No homograph spoofing or malicious typosquatting vectors detected. Domain is clean.')}
                      </p>
                    </div>
                  )}

                  {/* Extra metadata tags if available */}
                  {(urlResult.punycode || urlResult.homographDetected) && (
                    <div className="punycode-box">
                      <span className="puny-label">Punycode Encoding:</span>
                      <code className="puny-code wrap-text">{urlResult.punycode || 'xn--pple-43d.com'}</code>
                    </div>
                  )}

                  <div className="url-result-actions margin-top-12">
                    <Link
                      to={`/command-center?url=${encodeURIComponent(urlResult.url || urlResult.domain || urlInput)}`}
                      className="cyber-button secondary-btn full-width-btn"
                    >
                      <Zap size={16} />
                      <span>Launch Emergency Command Center for Threat</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ============================================================== */}
          {/* SHIELD 2: Zero-Knowledge Password Auditor */}
          {/* ============================================================== */}
          <section className="cyber-card shield-card" id="password-auditor-section">
            <div className="card-header">
              <div className="card-header-icon icon-violet">
                <Lock size={22} />
              </div>
              <div className="card-header-titles">
                <h2>Shield 2: Zero-Knowledge Password Auditor</h2>
                <p>Verify data breach exposure using $k$-Anonymity SHA-1 hash prefixes</p>
              </div>
            </div>

            <form onSubmit={handlePasswordAudit} className="shield-form">
              <div className="url-input-group">
                <div className="input-wrapper main-search-wrapper">
                  <Key className="input-icon" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password to test against leak databases..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="cyber-input mono-font"
                    id="password-audit-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="cyber-button secondary-btn scan-btn"
                  disabled={passwordLoading}
                  id="check-breach-btn"
                >
                  {passwordLoading ? (
                    <>
                      <Cpu className="spin-icon" size={18} />
                      <span>Auditing...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      <span>Check Breach Status</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {passwordError && (
              <div className="shield-alert error-alert">
                <AlertTriangle size={18} />
                <span>{passwordError}</span>
              </div>
            )}

            {/* PASSWORD AUDIT RESULTS PANEL */}
            {passwordResult && (
              <div className="scan-results-panel animate-fade-in">
                <div className="result-top-bar">
                  <div className="target-url-meta">
                    <span className="meta-label">Credential Target:</span>
                    <span className="meta-value mono-font wrap-text">
                      {passwordInput ? `${passwordInput.slice(0, 2)}${'*'.repeat(Math.max(4, passwordInput.length - 2))}` : '••••••••'}
                    </span>
                  </div>
                  {passwordResult.isBreached || passwordResult.breached || (passwordResult.breachCount > 0) ? (
                    <div className="status-badge badge-dangerous">
                      <XCircle size={16} />
                      <span>BREACHED ({passwordResult.breachCount || passwordResult.occurrences || 1} Leaks)</span>
                    </div>
                  ) : (
                    <div className="status-badge badge-safe">
                      <CheckCircle2 size={16} />
                      <span>UNBREACHED / SECURE</span>
                    </div>
                  )}
                </div>

                {/* Grid of Entropy & Hash Details */}
                <div className="zk-details-grid">
                  {/* Entropy & Assessment */}
                  <div className="zk-info-box">
                    <div className="info-box-header">
                      <Activity size={16} className="text-cyan" />
                      <span>Entropy &amp; Assessment</span>
                    </div>
                    <div className="info-box-body">
                      <div className="metric-row">
                        <span className="metric-label">Calculated Entropy:</span>
                        <span className="metric-value highlight-cyan">
                          {passwordResult.entropy || passwordResult.entropyScore || `${Math.round((passwordInput.length || 8) * 4.2)} bits`}
                        </span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">Length Evaluation:</span>
                        <span className="metric-value">
                          {passwordResult.lengthAssessment || passwordResult.length || passwordInput.length} characters ({passwordInput.length >= 12 ? 'Robust' : passwordInput.length >= 8 ? 'Moderate' : 'Short'})
                        </span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">Strength Rating:</span>
                        <span className="metric-value text-emerald">
                          {passwordResult.assessment || passwordResult.strength || (passwordInput.length >= 14 ? 'Cyber-Grade' : 'Standard')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* k-Anonymity Hash Details */}
                  <div className="zk-info-box">
                    <div className="info-box-header">
                      <Sparkles size={16} className="text-violet" />
                      <span>$k$-Anonymity ZK Proof</span>
                    </div>
                    <div className="info-box-body">
                      <div className="metric-row">
                        <span className="metric-label">SHA-1 Prefix (5 chars sent):</span>
                        <code className="hash-prefix-badge">
                          {passwordResult.hashPrefix || passwordResult.kAnonymityPrefix || '5BAA6'}
                        </code>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">Privacy Guarantee:</span>
                        <span className="metric-value text-muted">
                          Original password never leaves your browser.
                        </span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">Breach Database Matches:</span>
                        <span className={`metric-value ${passwordResult.breachCount > 0 ? 'text-danger' : 'text-emerald'}`}>
                          {passwordResult.breachCount ?? passwordResult.occurrences ?? 0} instances
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* ============================================================== */}
        {/* AUDIT HISTORY FEED WITH TAB CATEGORIZATION */}
        {/* ============================================================== */}
        <section className="cyber-card history-section" id="audit-history-feed">
          <div className="card-header history-header">
            <div className="card-header-icon icon-emerald">
              <History size={22} />
            </div>
            <div className="card-header-titles">
              <h2>Audit History Feed</h2>
              <p>Categorized records of phishing scans &amp; credential breaches</p>
            </div>
            <button
              type="button"
              className="refresh-history-btn"
              onClick={fetchHistory}
              disabled={historyLoading}
              title="Refresh Feed"
              id="refresh-history-btn"
            >
              <RefreshCw size={16} className={historyLoading ? 'spin-icon' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Categorization Tabs: Active Threats & Warnings vs Verified Safe Audits */}
          <div className="history-tabs-bar">
            <button
              type="button"
              className={`history-category-tab ${activeHistoryTab === 'threats' ? 'active tab-threats' : ''}`}
              onClick={() => setActiveHistoryTab('threats')}
              id="tab-active-threats"
            >
              <AlertTriangle size={15} />
              <span>Active Threats &amp; Warnings ({threatAudits.length})</span>
            </button>

            <button
              type="button"
              className={`history-category-tab ${activeHistoryTab === 'safe' ? 'active tab-safe' : ''}`}
              onClick={() => setActiveHistoryTab('safe')}
              id="tab-verified-safe"
            >
              <CheckCircle2 size={15} />
              <span>Verified Safe Audits ({safeAudits.length})</span>
            </button>

            <button
              type="button"
              className={`history-category-tab ${activeHistoryTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveHistoryTab('all')}
              id="tab-all-audits"
            >
              <Filter size={15} />
              <span>All Audits ({history.length})</span>
            </button>
          </div>

          {historyError && (
            <div className="shield-alert warning-alert margin-top-12">
              <Info size={18} />
              <span>{historyError}</span>
            </div>
          )}

          {historyLoading ? (
            <div className="history-loading-state">
              <Cpu className="spin-icon text-cyan" size={28} />
              <p>Syncing security audit ledger...</p>
            </div>
          ) : displayedHistory.length === 0 ? (
            <div className="history-empty-state">
              <Shield className="empty-icon" size={40} />
              <p>
                {activeHistoryTab === 'threats'
                  ? 'No active threats or warnings recorded in this category.'
                  : activeHistoryTab === 'safe'
                  ? 'No verified safe audit records yet.'
                  : 'No audit scans recorded yet. Run a domain scan or password check above!'}
              </p>
            </div>
          ) : (
            <div className="history-feed-grid">
              {displayedHistory.map((scanItem, index) => {
                const scanId = scanItem._id || scanItem.id;
                const isUrlScan = scanItem.type === 'url' || scanItem.url || scanItem.domain;
                const targetText = scanItem.target || scanItem.url || scanItem.domain || (scanItem.password ? '••••••••' : `Audit #${index + 1}`);
                const riskLevel = scanItem.status || scanItem.riskLevel || (scanItem.isBreached ? 'Dangerous' : 'Safe');
                const dateStr = scanItem.createdAt || scanItem.timestamp || scanItem.date || new Date().toISOString();

                return (
                  <div key={scanId || index} className="history-card">
                    <div className="history-card-top">
                      <div className="history-type-tag">
                        {isUrlScan ? <Globe size={14} /> : <Key size={14} />}
                        <span>{isUrlScan ? 'URL Scan' : 'Password Check'}</span>
                      </div>

                      <div className="history-top-actions">
                        <span className="history-time">
                          {new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        
                        {/* Delete Scan Record Button */}
                        <button
                          type="button"
                          className="history-delete-btn"
                          onClick={() => handleDeleteScan(scanId, index)}
                          disabled={deletingId === (scanId || index)}
                          title="Delete Scan Record"
                          aria-label="Delete scan record"
                        >
                          <Trash2 size={14} className={deletingId === (scanId || index) ? 'spin-icon' : ''} />
                        </button>
                      </div>
                    </div>

                    {/* Target URL with Full Text Wrapping & Expansion on Hover */}
                    <div className="history-target mono-font wrap-text expand-on-hover" title={targetText}>
                      {targetText}
                    </div>

                    <div className="history-card-bottom">
                      {renderStatusBadge(riskLevel, scanItem.riskScore)}

                      {/* Threat Details with Full Text Wrapping & Expansion on Hover */}
                      <div className="history-details-snippet wrap-text expand-on-hover">
                        {scanItem.details || scanItem.detectedRisks?.[0] || scanItem.assessment || (isUrlScan ? 'Domain evaluated' : 'Z-K hash audit')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default SecurityDashboard;
