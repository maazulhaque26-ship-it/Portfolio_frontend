// ============================================================
// frontend/src/context/AuthContext.jsx
// ============================================================
// THE CRITICAL FIX:
//
// BEFORE: AuthContext read 'userInfo' from localStorage, found
//         a token string, and set isAuthenticated = true WITHOUT
//         EVER CHECKING if the token was valid. Stale/expired
//         tokens showed the dashboard, then every API call 401'd.
//
// AFTER:  On mount, if localStorage has a stored token, we call
//         GET /api/auth/verify to confirm the token is valid.
//         - If 200 → token is good → show dashboard
//         - If 401 → token is stale → clear storage → show login
//         - While checking → show loading spinner
// ============================================================

import { createContext, useState, useEffect, useCallback } from 'react';
import { API_BASE, getToken } from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]                       = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading]                 = useState(true);  // starts true

  // ── On mount: verify stored token against backend ──────────
  useEffect(() => {
    const verifyStoredToken = async () => {
      try {
        const raw = localStorage.getItem('userInfo');
        if (!raw) {
          // No stored session — go straight to login
          setLoading(false);
          return;
        }

        const parsed = JSON.parse(raw);
        const token  = parsed?.token;

        if (!token || typeof token !== 'string') {
          // Corrupted data — clear it
          localStorage.removeItem('userInfo');
          setLoading(false);
          return;
        }

        // ── Hit the verify endpoint ──────────────────────────
        const res = await fetch(`${API_BASE}/api/auth/verify`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (res.ok) {
          // Token is valid — user is authenticated
          setUser(parsed);
          setIsAuthenticated(true);
        } else {
          // Token expired or invalid — wipe stale data
          console.warn('[AuthContext] Stored token is invalid/expired — clearing session');
          localStorage.removeItem('userInfo');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        // Network error (server might be down) — clear to be safe
        console.error('[AuthContext] Token verify failed:', err.message);
        localStorage.removeItem('userInfo');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyStoredToken();
  }, []);

  // ── Login ──────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        setUser(data);
        setIsAuthenticated(true);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Invalid credentials' };
      }
    } catch (err) {
      return { success: false, message: 'Network error — is the server running?' };
    }
  }, []);

  // ── Logout ─────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('userInfo');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};