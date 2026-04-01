// ============================================================
// frontend/src/pages/admin/AdminTestimonials.jsx
// ============================================================
// UPDATED: Migrated to authFetch() for consistent auth.
// ============================================================

import { useState, useEffect, useContext } from 'react';
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

const EMPTY = { name: '', company: '', text: '', rating: 5, imageUrl: '' };
const Stars = ({ n }) => (
  <span className="text-olivia-gold text-sm">
    {'★'.repeat(Math.min(Number(n) || 0, 5))}{'☆'.repeat(Math.max(0, 5 - (Number(n) || 0)))}
  </span>
);

const AdminTestimonials = ({ onSave }) => {
  const { refreshData } = useContext(PortfolioContext);

  const [testimonials, setTestimonials] = useState([]);
  const [view,         setView]         = useState('list');
  const [formData,     setFormData]     = useState(EMPTY);
  const [uploading,    setUploading]    = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [editingId,    setEditingId]    = useState(null);
  const [toast,        setToast]        = useState({ msg: '', type: 'success' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3500);
  };

  const fetchTestimonials = async () => {
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/testimonials`);
      const data = await res.json();
      setTestimonials(Array.isArray(data) ? data.map((t) => ({
        ...t, name: t.name || t.clientName || '', company: t.company || t.role || '',
      })) : []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('image', file);
    try {
      const res  = await authFetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (res.ok) { setFormData((p) => ({ ...p, imageUrl: data.url })); showToast('Image uploaded ✓'); }
      else showToast(data.message || 'Upload failed', 'error');
    } catch { showToast('Upload error', 'error'); }
    finally { setUploading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...formData, clientName: formData.name, role: formData.company };
    try {
      const endpoint = view === 'edit' ? `/api/testimonials/${editingId}` : '/api/testimonials';
      const method   = view === 'edit' ? 'PUT' : 'POST';
      const res = await authFetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(view === 'edit' ? 'Testimonial updated ✓' : 'Testimonial added ✓');
        setView('list'); fetchTestimonials(); refreshData?.(); onSave?.();
      } else showToast(data.message || 'Save failed', 'error');
    } catch { showToast('Network error', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await authFetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      fetchTestimonials(); refreshData?.(); onSave?.(); showToast('Testimonial deleted');
    } catch { showToast('Delete failed', 'error'); }
  };

  // ── Add / Edit ─────────────────────────────────────────────
  if (view !== 'list') {
    const preview = resolveImageUrl(formData.imageUrl);
    return (
      <>
        <Toast {...toast} />
        <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-10 shadow-sm border border-gray-100 max-w-4xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b pb-4">
            <h3 className="text-2xl font-serif font-bold text-olivia-green">
              {view === 'add' ? 'Add Testimonial' : 'Edit Testimonial'}
            </h3>
            <button onClick={() => setView('list')}
              className="text-gray-500 hover:text-black font-bold text-sm bg-gray-100 px-4 py-2 rounded-lg">← Back</button>
          </div>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-b pb-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-gray-50 overflow-hidden shrink-0 flex items-center justify-center">
                {preview ? <img src={preview} className="w-full h-full object-cover" alt="avatar" />
                         : <span className="text-4xl text-gray-300">👤</span>}
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Client Avatar</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                {uploading && <span className="text-xs text-olivia-gold font-bold mt-2 inline-block animate-pulse">Uploading…</span>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="col-span-3 md:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Client Name</label>
                <input required type="text" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-olivia-gold font-medium" />
              </div>
              <div className="col-span-3 md:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Company / Role</label>
                <input required type="text" value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-olivia-gold font-medium" />
              </div>
              <div className="col-span-3 md:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Rating <Stars n={formData.rating} /></label>
                <input required type="number" min="1" max="5" value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-olivia-gold font-medium" />
              </div>
              <div className="col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Testimonial Quote</label>
                <textarea required rows={4} value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-olivia-gold font-medium resize-none" />
              </div>
            </div>
            <button type="submit" disabled={saving || uploading}
              className="bg-olivia-green text-white font-bold px-10 py-4 rounded-full hover:bg-olivia-gold hover:text-black transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
              {saving ? 'Saving…' : 'Save Review'}
            </button>
          </form>
        </div>
      </>
    );
  }

  // ── List ───────────────────────────────────────────────────
  return (
    <>
      <Toast {...toast} />
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-xl font-bold font-serif text-olivia-green">Stored Testimonials ({testimonials.length})</h2>
          <button onClick={() => { setFormData(EMPTY); setEditingId(null); setView('add'); }}
            className="bg-olivia-gold font-bold px-6 py-3 rounded-full hover:bg-yellow-500 shadow-md">+ Add New Testimonial</button>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-olivia-green text-white">
                <th className="p-4 text-xs font-bold tracking-wider uppercase">Client</th>
                <th className="p-4 text-xs font-bold tracking-wider uppercase hidden md:table-cell">Review</th>
                <th className="p-4 text-xs font-bold tracking-wider uppercase hidden md:table-cell">Rating</th>
                <th className="p-4 text-xs font-bold tracking-wider uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => {
                const src = resolveImageUrl(t.imageUrl);
                return (
                  <tr key={t._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        {src ? <img src={src} className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-200 shrink-0" alt={t.name} />
                             : <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 shrink-0">👤</div>}
                        <div>
                          <p className="font-bold text-olivia-text">{t.name || t.clientName}</p>
                          <p className="text-xs text-olivia-gold font-bold uppercase">{t.company || t.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500 hidden md:table-cell max-w-xs"><p className="truncate">{t.text}</p></td>
                    <td className="p-4 hidden md:table-cell"><Stars n={t.rating} /></td>
                    <td className="p-4 text-right space-x-4 whitespace-nowrap">
                      <button onClick={() => {
                        setFormData({ name: t.name || t.clientName || '', company: t.company || t.role || '', text: t.text || '', rating: t.rating || 5, imageUrl: t.imageUrl || '' });
                        setEditingId(t._id); setView('edit');
                      }} className="text-sm font-bold text-olivia-green hover:underline">Edit</button>
                      <button onClick={() => handleDelete(t._id)}
                        className="text-sm font-bold text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                );
              })}
              {testimonials.length === 0 && (
                <tr><td colSpan="4" className="p-8 text-center text-gray-400 font-medium">No testimonials yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminTestimonials;