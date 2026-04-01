// ============================================================
// frontend/src/pages/admin/AdminTimeline.jsx
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

const emptyItem = (cat) => ({ category: cat, period: '', title: '', subtitle: '' });

const AdminTimeline = ({ onSave }) => {
  const { profile, refreshData } = useContext(PortfolioContext);
  const [education, setEducation] = useState([emptyItem('Education'), emptyItem('Education')]);
  const [work, setWork]           = useState([emptyItem('Work'), emptyItem('Work')]);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState({ msg: '', type: 'success' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3500);
  };

  useEffect(() => {
    if (profile?.timeline?.length > 0) {
      const edu = profile.timeline.filter((t) => t.category === 'Education');
      const wrk = profile.timeline.filter((t) => t.category === 'Work');
      if (edu.length) setEducation(edu.map((t) => ({ category: 'Education', period: t.period || '', title: t.title || '', subtitle: t.subtitle || '' })));
      if (wrk.length) setWork(wrk.map((t) => ({ category: 'Work', period: t.period || '', title: t.title || '', subtitle: t.subtitle || '' })));
    }
  }, [profile]);

  const handleChange = (setter, i, f, v) => setter((prev) => prev.map((item, idx) => idx === i ? { ...item, [f]: v } : item));
  const addItem    = (setter, cat) => setter((prev) => [...prev, emptyItem(cat)]);
  const removeItem = (setter, i) => setter((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authFetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeline: [...education, ...work] }),
      });
      if (res.ok) { showToast('Timeline saved!'); refreshData(); onSave?.(); }
      else { const err = await res.json().catch(() => ({})); showToast(err.message || 'Failed', 'error'); }
    } catch { showToast('Network error', 'error'); }
    finally { setSaving(false); }
  };

  const inputStyle = 'w-full bg-white border border-gray-200 p-3 rounded-xl text-black text-sm focus:ring-2 focus:ring-olivia-gold';

  const renderColumn = (items, setter, category, icon, label) => (
    <div className="bg-white rounded-[24px] shadow-sm p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-olivia-gold rounded-full flex items-center justify-center text-lg">{icon}</div>
        <h3 className="text-lg font-bold text-olivia-green">{label}</h3>
      </div>
      <div className="space-y-5">
        {items.map((item, idx) => (
          <div key={idx} className="border border-gray-100 rounded-xl p-4 bg-gray-50 relative">
            {items.length > 1 && <button type="button" onClick={() => removeItem(setter, idx)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-xs font-bold">✕</button>}
            <div className="flex items-center gap-2 mb-3"><div className="w-3 h-3 bg-olivia-gold rounded-full shrink-0" /><span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Entry {idx + 1}</span></div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Period</label>
            <input className={`${inputStyle} mb-3`} placeholder={category === 'Education' ? '2015-2018' : '2020-Present'} value={item.period} onChange={(e) => handleChange(setter, idx, 'period', e.target.value)} />
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">{category === 'Education' ? 'Institution' : 'Company'}</label>
            <input className={`${inputStyle} mb-3`} value={item.title} onChange={(e) => handleChange(setter, idx, 'title', e.target.value)} />
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">{category === 'Education' ? 'Degree' : 'Job Title'}</label>
            <input className={inputStyle} value={item.subtitle} onChange={(e) => handleChange(setter, idx, 'subtitle', e.target.value)} />
          </div>
        ))}
      </div>
      <button type="button" onClick={() => addItem(setter, category)} className="mt-4 w-full border-2 border-dashed border-gray-300 hover:border-olivia-gold text-gray-400 hover:text-olivia-gold rounded-lg py-2 text-sm font-semibold">+ Add {label} Entry</button>
    </div>
  );

  return (
    <>
      <Toast {...toast} />
      <form onSubmit={handleSave} className="max-w-4xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderColumn(education, setEducation, 'Education', '🎓', 'Education')}
          {renderColumn(work, setWork, 'Work', '💼', 'Work Experience')}
        </div>
        <button type="submit" disabled={saving} className="w-full bg-olivia-green text-white font-bold py-4 rounded-full hover:bg-olivia-gold hover:text-black transition-colors shadow-md disabled:opacity-60">{saving ? 'Saving...' : 'Save Timeline'}</button>
      </form>
    </>
  );
};

export default AdminTimeline;