// ============================================================
// frontend/src/context/PortfolioContext.jsx
// ============================================================
// UPDATED: Now fetches tools, footer, testimonials, and blogs
//          alongside profile/projects/services. All data is
//          globally available and refreshed via refreshData().
// ============================================================

import React, { createContext, useState, useEffect, useCallback } from 'react';

export const PortfolioContext = createContext();

const API = import.meta.env.VITE_API_URL;

// Normalize profile data with safe defaults
const normalizeProfile = (raw) => {
  if (!raw || Object.keys(raw).length === 0) {
    return {
      hero:     { name: '', headline: '', bio: '', yearsExp: '', avatarUrl: '', cvUrl: '' },
      about:    { bioText: '', projectsCompleted: '', industriesCovered: '', yearsExperience: '' },
      pricing:  [],
      timeline: [],
      achievements: [],
      contact:  { phone: '', email: '', address: '', socials: {} },
    };
  }

  return {
    hero:     raw.hero    || {},
    about:    raw.about   || {},
    pricing:  Array.isArray(raw.pricing)  ? raw.pricing  : [],
    timeline: Array.isArray(raw.timeline) ? raw.timeline : [],
    contact: {
      phone:   raw.contact?.phone   || '',
      email:   raw.contact?.email   || '',
      address: raw.contact?.address || '',
      socials: raw.contact?.socials || {},
    },
    achievements: Array.isArray(raw.achievements) ? raw.achievements : [],
    _id: raw._id,
  };
};

export const PortfolioProvider = ({ children }) => {
  const [profile,      setProfile]      = useState(normalizeProfile(null));
  const [projects,     setProjects]     = useState([]);
  const [services,     setServices]     = useState([]);
  const [tools,        setTools]        = useState([]);
  const [footer,       setFooter]       = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [blogs,        setBlogs]        = useState([]);
  const [marqueeItems, setMarqueeItems] = useState([]);
  const [loading,      setLoading]      = useState(true);

  // Fetch all portfolio data in parallel
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [profRes, projRes, servRes, toolRes, footRes, testRes, blogRes, marqRes] =
        await Promise.all([
          fetch(`${API}/api/profile`),
          fetch(`${API}/api/projects`),
          fetch(`${API}/api/services`),
          fetch(`${API}/api/tools`),
          fetch(`${API}/api/footer`),
          fetch(`${API}/api/testimonials`),
          fetch(`${API}/api/blogs`),
          fetch(`${API}/api/marquee`),
        ]);

      const profData = profRes.ok ? await profRes.json() : null;
      const projData = projRes.ok ? await projRes.json() : [];
      const servData = servRes.ok ? await servRes.json() : [];
      const toolData = toolRes.ok ? await toolRes.json() : [];
      const footData = footRes.ok ? await footRes.json() : null;
      const testData = testRes.ok ? await testRes.json() : [];
      const blogData = blogRes.ok ? await blogRes.json() : [];
      const marqData = marqRes.ok ? await marqRes.json() : null;

      setProfile(normalizeProfile(profData));
      setProjects(Array.isArray(projData) ? projData : []);
      setServices(Array.isArray(servData) ? servData : []);
      setTools(Array.isArray(toolData) ? toolData : []);
      setFooter(footData);
      setTestimonials(Array.isArray(testData) ? testData : []);
      setBlogs(Array.isArray(blogData) ? blogData : []);
      setMarqueeItems(Array.isArray(marqData?.items) ? marqData.items : []);
    } catch (err) {
      console.error('[PortfolioContext Error]', err);
      setProfile(normalizeProfile(null));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Resolve image URLs (handles relative paths from backend)
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <PortfolioContext.Provider
      value={{
        profile, services, projects, tools, footer, testimonials, blogs,
        marqueeItems, loading, getImageUrl, refreshData, API,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};