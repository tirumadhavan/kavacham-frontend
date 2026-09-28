import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Auth from './components/Auth';
import SecurityDashboard from './components/SecurityDashboard';
import CommandCenter from './components/CommandCenter';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Read saved token and user object from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const handleLoginSuccess = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  if (isInitializing) {
    return (
      <div className="app-loading-screen">
        <div className="cyber-spinner"></div>
        <p>INITIALIZING KAVACHAM SECURITY ENGINE...</p>
      </div>
    );
  }

  const isAuthenticated = Boolean(token && user);

  return (
    <BrowserRouter>
      <div className="app-root-wrapper">
        <Routes>
          {/* Landing Home Page */}
          <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />

          {/* Authentication Page */}
          <Route
            path="/auth"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Auth onLoginSuccess={handleLoginSuccess} />
              )
            }
          />

          {/* Security Dashboard */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <SecurityDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          {/* Emergency Command Center */}
          <Route
            path="/command-center"
            element={<CommandCenter user={user} onLogout={handleLogout} />}
          />

          {/* Catch-all fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
