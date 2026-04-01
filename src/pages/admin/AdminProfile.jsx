// ============================================================
// frontend/src/pages/admin/AdminProfile.jsx
// ============================================================
// FIX: Was using localStorage.getItem('token') → null → 401.
//      Now uses authFetch() which extracts token from 'userInfo'.
// ============================================================

import React, { useState, useContext, useEffect } from 'react';
import { PortfolioContext } from '../../context/PortfolioContext';
import { authFetch, resolveImageUrl } from '../../utils/api';

const Toast = ({ msg, type }) => {
  if (!msg) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-2xl border font-semibold text-sm shadow-xl
      ${type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
      {msg}
    </div>
  );
};

const AdminProfile = ({ onSave }) => {
  const { profile, refreshData } = useContext(PortfolioContext);

  const [formData, setFormData] = useState({
    hero: { name: '', headline: '', bio: '', avatarUrl: '', cvUrl: '' },
    about: { bioText: '', projectsCompleted: '', industriesCovered: '', yearsExperience: '' },
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview]       = useState('');
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState({ msg: '', type: 'success' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3500);
  };

  useEffect(() => {
    if (profile?.hero) {
      setFormData({
        hero: {
          name: profile.hero.name || '', headline: profile.hero.headline || '',
          bio: profile.hero.bio || '', avatarUrl: profile.hero.avatarUrl || '',
          cvUrl: profile.hero.cvUrl || '',
        },
        about: {
          bioText: profile.about?.bioText || '', projectsCompleted: profile.about?.projectsCompleted || '',
          industriesCovered: profile.about?.industriesCovered || '', yearsExperience: profile.about?.yearsExperience || '',
        },
      });
      setPreview(profile.hero.avatarUrl || '');
    }
  }, [profile]);

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setAvatarFile(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append('hero',  JSON.stringify(formData.hero));
      data.append('about', JSON.stringify(formData.about));
      if (avatarFile) data.append('avatarImage', avatarFile);

      // FIX: authFetch auto-injects the correct Bearer token
      const res = await authFetch('/api/profile', { method: 'PUT', body: data });

      if (res.ok) {
        showToast('Profile saved successfully!');
        refreshData(); onSave?.();
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.message || 'Failed to save', 'error');
      }
    } catch { showToast('Network error', 'error'); }
    finally { setSaving(false); }
  };

  const inputStyle = 'w-full bg-white border border-gray-200 p-4 rounded-xl text-black focus:ring-2 focus:ring-olivia-gold focus:border-transparent transition-all';
  const labelStyle = 'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2';

  return (
    <>
      <Toast {...toast} />
      <div className="max-w-3xl">
        <form onSubmit={handleSave} className="space-y-8">
          <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold font-serif text-olivia-green mb-6 border-b pb-4">Hero Details</h2>
            <div className="space-y-5">
              <div><label className={labelStyle}>Name</label>
                <input className={inputStyle} placeholder="Maazul Haque" value={formData.hero.name}
                  onChange={(e) => handleChange('hero', 'name', e.target.value)} /></div>
              <div><label className={labelStyle}>Headline</label>
                <input className={inputStyle} placeholder="UI/UX Designer & Developer" value={formData.hero.headline}
                  onChange={(e) => handleChange('hero', 'headline', e.target.value)} /></div>
              <div><label className={labelStyle}>Bio (Hero Section)</label>
                <textarea className={inputStyle} placeholder="Short intro bio..." rows={3} value={formData.hero.bio}
                  onChange={(e) => handleChange('hero', 'bio', e.target.value)} /></div>
              <div><label className={labelStyle}>CV URL</label>
                <input className={inputStyle} placeholder="/uploads/my-cv.pdf" value={formData.hero.cvUrl}
                  onChange={(e) => handleChange('hero', 'cvUrl', e.target.value)} /></div>
              <div><label className={labelStyle}>Avatar Image</label>
                {preview && <img src={preview.startsWith('blob') ? preview : resolveImageUrl(preview)}
                  alt="Avatar" className="w-24 h-24 rounded-full object-cover mb-3 border-4 border-olivia-gold/20 shadow-md" />}
                <input type="file" accept="image/*" onChange={handleFileChange}
                  className="block text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-olivia-gold/10 file:text-olivia-green hover:file:bg-olivia-gold/20" /></div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold font-serif text-olivia-green mb-6 border-b pb-4">About Section</h2>
            <div className="space-y-5">
              <div><label className={labelStyle}>About Bio Text</label>
                <textarea className={inputStyle} placeholder="Write about yourself..." rows={4} value={formData.about.bioText}
                  onChange={(e) => handleChange('about', 'bioText', e.target.value)} /></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><label className={labelStyle}>Projects Done</label>
                  <input className={inputStyle} placeholder="120+" value={formData.about.projectsCompleted}
                    onChange={(e) => handleChange('about', 'projectsCompleted', e.target.value)} /></div>
                <div><label className={labelStyle}>Industries</label>
                  <input className={inputStyle} placeholder="15+" value={formData.about.industriesCovered}
                    onChange={(e) => handleChange('about', 'industriesCovered', e.target.value)} /></div>
                <div><label className={labelStyle}>Years Exp.</label>
                  <input className={inputStyle} placeholder="5+" value={formData.about.yearsExperience}
                    onChange={(e) => handleChange('about', 'yearsExperience', e.target.value)} /></div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="w-full bg-olivia-green text-white font-bold py-4 rounded-full hover:bg-olivia-gold hover:text-black transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
            {saving ? 'Saving...' : 'Save Profile & About'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminProfile;