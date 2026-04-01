// ============================================================
// frontend/src/pages/admin/AdminPricing.jsx
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

const emptyPlan = () => ({ planName: '', price: '', period: '', features: [''] });

const AdminPricing = ({ onSave }) => {
  const { profile, refreshData } = useContext(PortfolioContext);
  const [plans, setPlans]   = useState([emptyPlan(), emptyPlan(), emptyPlan()]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState({ msg: '', type: 'success' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3500);
  };

  useEffect(() => {
    if (profile?.pricing?.length > 0) {
      setPlans(profile.pricing.map((p) => ({
        planName: p.planName || '', price: p.price || '', period: p.period || '',
        features: Array.isArray(p.features) && p.features.length > 0 ? p.features : [''],
      })));
    }
  }, [profile]);

  const handlePlanChange    = (pi, f, v) => setPlans((prev) => prev.map((p, i) => i === pi ? { ...p, [f]: v } : p));
  const handleFeatureChange = (pi, fi, v) => setPlans((prev) => prev.map((p, i) => { if (i !== pi) return p; const f = [...p.features]; f[fi] = v; return { ...p, features: f }; }));
  const addFeature    = (pi) => setPlans((prev) => prev.map((p, i) => i === pi ? { ...p, features: [...p.features, ''] } : p));
  const removeFeature = (pi, fi) => setPlans((prev) => prev.map((p, i) => { if (i !== pi) return p; const f = p.features.filter((_, idx) => idx !== fi); return { ...p, features: f.length ? f : [''] }; }));
  const addPlan    = () => setPlans((prev) => [...prev, emptyPlan()]);
  const removePlan = (i) => setPlans((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authFetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricing: plans }),
      });
      if (res.ok) { showToast('Pricing saved!'); refreshData(); onSave?.(); }
      else { const err = await res.json().catch(() => ({})); showToast(err.message || 'Failed', 'error'); }
    } catch { showToast('Network error', 'error'); }
    finally { setSaving(false); }
  };

  const inputStyle = 'w-full bg-white border border-gray-200 p-3 rounded-xl text-black focus:ring-2 focus:ring-olivia-gold text-sm';

  return (
    <>
      <Toast {...toast} />
      <form onSubmit={handleSave} className="max-w-5xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, pi) => (
            <div key={pi} className="bg-white rounded-[24px] shadow-sm p-6 border border-gray-100 relative">
              {plans.length > 1 && <button type="button" onClick={() => removePlan(pi)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 text-xs font-bold">✕ Remove</button>}
              <h3 className="text-base font-bold text-olivia-green mb-4">Plan {pi + 1}{pi === 1 && <span className="ml-2 text-xs bg-olivia-gold text-black px-2 py-0.5 rounded-full">Featured</span>}</h3>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Plan Name</label>
              <input className={`${inputStyle} mb-3`} placeholder="e.g. Monthly" value={plan.planName} onChange={(e) => handlePlanChange(pi, 'planName', e.target.value)} />
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Price</label>
              <input className={`${inputStyle} mb-3`} placeholder="e.g. $9600" value={plan.price} onChange={(e) => handlePlanChange(pi, 'price', e.target.value)} />
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Period</label>
              <input className={`${inputStyle} mb-4`} placeholder="e.g. /Month" value={plan.period} onChange={(e) => handlePlanChange(pi, 'period', e.target.value)} />
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Features</label>
              <div className="space-y-2">
                {plan.features.map((feat, fi) => (
                  <div key={fi} className="flex items-center gap-2">
                    <input className="flex-1 bg-white border border-gray-200 p-2 rounded-lg text-black text-sm" placeholder={`Feature ${fi + 1}`} value={feat} onChange={(e) => handleFeatureChange(pi, fi, e.target.value)} />
                    <button type="button" onClick={() => removeFeature(pi, fi)} className="text-red-400 hover:text-red-600 text-lg font-bold">−</button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addFeature(pi)} className="mt-3 text-xs text-olivia-green hover:text-olivia-gold font-bold">+ Add Feature</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addPlan} className="border-2 border-dashed border-gray-300 hover:border-olivia-gold text-gray-400 hover:text-olivia-gold rounded-xl px-6 py-3 text-sm font-semibold w-full">+ Add New Plan</button>
        <button type="submit" disabled={saving} className="w-full bg-olivia-green text-white font-bold py-4 rounded-full hover:bg-olivia-gold hover:text-black transition-colors shadow-md disabled:opacity-60">{saving ? 'Saving...' : 'Save Pricing'}</button>
      </form>
    </>
  );
};

export default AdminPricing;