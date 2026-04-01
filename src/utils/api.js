// ============================================================
// frontend/src/utils/api.js
// ============================================================
// Centralized API utility.
//
// ROOT CAUSE FIX: The 401 errors happened because admin pages
// called localStorage.getItem('token') — a key that doesn't
// exist. Auth stores data under 'userInfo' as JSON with a
// nested .token property.
//
// This module exports authFetch() which always extracts the
// token correctly. Every admin page uses this.
// ============================================================

export const API_BASE = import.meta.env.VITE_API_URL;

/**
 * Extract JWT from localStorage.
 * Auth stores: localStorage.setItem('userInfo', JSON.stringify({ ...user, token }))
 */
export const getToken = () => {
  try {
    const raw = localStorage.getItem('userInfo');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token || null;
  } catch {
    return null;
  }
};

/**
 * Authenticated fetch — auto-injects Bearer token.
 */
export const authFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = { ...(options.headers || {}) };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  return fetch(url, { ...options, headers });
};

/**
 * Resolve relative image URLs to absolute.
 */
export const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
};