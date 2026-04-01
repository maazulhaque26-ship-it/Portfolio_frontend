// ============================================================
// frontend/src/pages/admin/AdminContact.jsx
// ============================================================
// FIX: localStorage.getItem('token') → null → 401.
//      Now uses authFetch() from utils/api.js.
// ============================================================

import React, { useState, useContext, useEffect } from 'react';
import { PortfolioContext } from '../../context/PortfolioContext';
import { authFetch } from '../../utils/api';

const Toast = ({ msg, type }) => {
  if (!msg) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-2xl border font-semibold text-sm shadow-xl
      ${type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
      {msg}
    </div>
  );
};

const AdminContact = ({ onSave }) => {
  const { profile, refreshData } = useContext(PortfolioContext);
  const [formData, setFormData] = useState({
    contact: { phone: '', email: '', address: '', socials: { linkedin: '', twitter: '', dribbble: '', github: '' } },
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState({ msg: '', type: 'success' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3500);
  };

  useEffect(() => {
    if (profile?.contact) {
      setFormData({
        contact: {
          phone: profile.contact.phone || '', email: profile.contact.email || '', address: profile.contact.address || '',
          socials: {
            linkedin: profile.contact.socials?.linkedin || '', twitter: profile.contact.socials?.twitter || '',
            dribbble: profile.contact.socials?.dribbble || '', github: profile.contact.socials?.github || '',
          },
        },
      });
    }
  }, [profile]);

  const handleChange       = (f, v) => setFormData((prev) => ({ ...prev, contact: { ...prev.contact, [f]: v } }));
  const handleSocialChange = (p, v) => setFormData((prev) => ({ ...prev, contact: { ...prev.contact, socials: { ...prev.contact.socials, [p]: v } } }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authFetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) { showToast('Contact info saved!'); refreshData(); onSave?.(); }
      else { const err = await res.json().catch(() => ({})); showToast(err.message || 'Failed', 'error'); }
    } catch { showToast('Network error', 'error'); }
    finally { setSaving(false); }
  };

  const inputStyle = 'w-full bg-white border border-gray-200 p-4 rounded-xl text-black focus:ring-2 focus:ring-olivia-gold transition-all';
  const labelStyle = 'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2';

  return (
    <>
      <Toast {...toast} />
      <div className="max-w-3xl">
        <form onSubmit={handleSave} className="space-y-8">
          <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold font-serif text-olivia-green mb-6 border-b pb-4">Contact Details</h2>
            <div className="space-y-5">
              <div><label className={labelStyle}>Phone</label><input className={inputStyle} placeholder="+91 98765 43210" value={formData.contact.phone} onChange={(e) => handleChange('phone', e.target.value)} /></div>
              <div><label className={labelStyle}>Email</label><input className={inputStyle} placeholder="you@example.com" value={formData.contact.email} onChange={(e) => handleChange('email', e.target.value)} /></div>
              <div><label className={labelStyle}>Address</label><input className={inputStyle} placeholder="City, Country" value={formData.contact.address} onChange={(e) => handleChange('address', e.target.value)} /></div>
            </div>
          </div>
          <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold font-serif text-olivia-green mb-6 border-b pb-4">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><label className={labelStyle}>LinkedIn</label><input className={inputStyle} placeholder="linkedin.com/in/yourname" value={formData.contact.socials.linkedin} onChange={(e) => handleSocialChange('linkedin', e.target.value)} /></div>
              <div><label className={labelStyle}>Twitter / X</label><input className={inputStyle} placeholder="twitter.com/yourhandle" value={formData.contact.socials.twitter} onChange={(e) => handleSocialChange('twitter', e.target.value)} /></div>
              <div><label className={labelStyle}>Dribbble</label><input className={inputStyle} placeholder="dribbble.com/yourname" value={formData.contact.socials.dribbble} onChange={(e) => handleSocialChange('dribbble', e.target.value)} /></div>
              <div><label className={labelStyle}>GitHub</label><input className={inputStyle} placeholder="github.com/yourname" value={formData.contact.socials.github} onChange={(e) => handleSocialChange('github', e.target.value)} /></div>
            </div>
          </div>
          <button type="submit" disabled={saving} className="w-full bg-olivia-green text-white font-bold py-4 rounded-full hover:bg-olivia-gold hover:text-black transition-colors shadow-md disabled:opacity-60">{saving ? 'Saving...' : 'Save Contact Info'}</button>
        </form>
      </div>
    </>
  );
};

export default AdminContact;