// ============================================================
// frontend/src/pages/admin/AdminMarquee.jsx
// ============================================================
// Admin panel for editing the scrolling banner/marquee items.
// ============================================================

import { useState, useContext, useEffect } from 'react';
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

const AdminMarquee = ({ onSave }) => {
  const { marqueeItems, refreshData } = useContext(PortfolioContext);

  const [items, setItems]   = useState(['App Design', 'Website Design', 'Dashboard', 'Wireframe', 'UI/UX Design']);
  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState({ msg: '', type: 'success' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3500);
  };

  // Load existing items from context
  useEffect(() => {
    if (marqueeItems && marqueeItems.length > 0) {
      setItems(marqueeItems);
    }
  }, [marqueeItems]);

  const handleChange = (index, value) => {
    setItems(prev => prev.map((item, i) => i === index ? value : item));
  };

  const addItem = () => {
    setItems(prev => [...prev, '']);
  };

  const removeItem = (index) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const moveItem = (index, direction) => {
    const newItems = [...items];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setItems(newItems);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const filtered = items.filter(item => item.trim() !== '');
    if (filtered.length === 0) {
      showToast('Add at least one marquee item!', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await authFetch('/api/marquee', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: filtered }),
      });

      if (res.ok) {
        showToast('Marquee saved successfully!');
        refreshData();
        onSave?.();
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.message || 'Failed to save', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Toast {...toast} />
      <div className="max-w-2xl">
        <form onSubmit={handleSave} className="space-y-6">

          {/* Info Banner */}
          <div className="bg-olivia-gold/10 border border-olivia-gold/20 rounded-2xl p-4 sm:p-5">
            <p className="text-sm text-olivia-green font-medium">
              <span className="font-bold">💡 Marquee Strip</span> — These text items scroll across the golden banner between sections. Add, remove, or reorder them below.
            </p>
          </div>

          {/* Items List */}
          <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 border-b pb-4">
              <h3 className="text-xl font-bold font-serif text-olivia-green">
                Banner Items ({items.length})
              </h3>
              <button
                type="button"
                onClick={addItem}
                className="bg-olivia-gold px-5 py-2 rounded-full font-bold text-sm hover:bg-yellow-500 shadow-sm"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2 sm:gap-3 group">
                  {/* Reorder buttons */}
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0}
                      className="text-gray-300 hover:text-olivia-green disabled:opacity-30 text-xs leading-none"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, 1)}
                      disabled={index === items.length - 1}
                      className="text-gray-300 hover:text-olivia-green disabled:opacity-30 text-xs leading-none"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Index badge */}
                  <span className="text-xs font-bold text-gray-300 w-5 text-center shrink-0">
                    {index + 1}
                  </span>

                  {/* Input */}
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleChange(index, e.target.value)}
                    placeholder="e.g. UI/UX Design"
                    className="flex-1 bg-white border border-gray-200 p-3 rounded-xl text-black text-sm focus:ring-2 focus:ring-olivia-gold focus:border-transparent transition-all"
                  />

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={items.length <= 1}
                    className="text-red-400 hover:text-red-600 font-bold text-lg shrink-0 disabled:opacity-30 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-r from-olivia-gold via-yellow-400 to-olivia-gold rounded-2xl p-4 sm:p-5 overflow-hidden">
            <h4 className="text-xs font-bold uppercase tracking-widest text-olivia-green-deep/60 mb-3">
              Live Preview
            </h4>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {items.filter(i => i.trim()).map((item, i) => (
                <span
                  key={i}
                  className="bg-olivia-green-deep/10 text-olivia-green-deep text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full"
                >
                  {item}
                </span>
              ))}
              {items.filter(i => i.trim()).length === 0 && (
                <span className="text-olivia-green-deep/40 text-sm">No items — add at least one</span>
              )}
            </div>
          </div>

          {/* Save */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-olivia-green text-white font-bold py-4 rounded-full hover:bg-olivia-gold hover:text-black transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Marquee'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminMarquee;
