// ============================================================
// frontend/src/pages/admin/AdminServices.jsx
// ============================================================
// UPDATED: Migrated to authFetch() for consistent auth.
// ============================================================

import { useState, useContext } from 'react';
import { PortfolioContext } from '../../context/PortfolioContext';
import { authFetch } from '../../utils/api';

const EMPTY = { title: '', description: '', icon: '' };

const AdminServices = ({ onSave }) => {
  const { services, refreshData } = useContext(PortfolioContext);

  const [view, setView]         = useState('list');
  const [formData, setFormData] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving]     = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isEdit   = view === 'edit' && editingId;
      const endpoint = isEdit ? `/api/services/${editingId}` : '/api/services';
      const method   = isEdit ? 'PUT' : 'POST';

      const res = await authFetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setView('list');
        refreshData();
        onSave?.();
      } else {
        const err = await res.json();
        alert(err.message || 'Error saving service');
      }
    } catch {
      alert('Network Error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      const res = await authFetch(`/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) refreshData();
    } catch {
      alert('Delete failed');
    }
  };

  // ── Add / Edit ─────────────────────────────────────────────
  if (view !== 'list') {
    return (
      <div className="bg-white p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] shadow-sm border border-gray-100 max-w-2xl">
        <h3 className="text-2xl font-bold font-serif text-olivia-green mb-6">
          {view === 'add' ? 'Add Service' : 'Edit Service'}
        </h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Title</label>
            <input placeholder="Service Title" value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-olivia-gold" required />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Icon (emoji)</label>
            <input placeholder="e.g. 🚀" value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-olivia-gold" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Description</label>
            <textarea placeholder="Describe the service..." value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-olivia-gold" rows="4" required />
          </div>
          <div className="flex gap-4 pt-2">
            <button type="submit" disabled={saving}
              className="bg-olivia-green text-white px-8 py-3 rounded-full font-bold hover:bg-olivia-gold hover:text-black transition-colors disabled:opacity-60">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={() => setView('list')}
              className="bg-gray-200 px-8 py-3 rounded-full font-bold hover:bg-gray-300 transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  // ── List ───────────────────────────────────────────────────
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold font-serif text-olivia-green">Services ({services.length})</h2>
        <button onClick={() => { setFormData(EMPTY); setView('add'); }}
          className="bg-olivia-gold px-6 py-3 rounded-full font-bold hover:bg-yellow-500 shadow-md">+ New Service</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((s) => (
          <div key={s._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start">
            <div>
              <h4 className="font-bold text-olivia-green">{s.icon} {s.title}</h4>
              <p className="text-sm text-gray-500 line-clamp-1 mt-1">{s.description}</p>
            </div>
            <div className="flex gap-3 shrink-0 ml-4">
              <button onClick={() => { setFormData(s); setEditingId(s._id); setView('edit'); }}
                className="text-sm font-bold text-olivia-green hover:underline">Edit</button>
              <button onClick={() => handleDelete(s._id)}
                className="text-sm font-bold text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <div className="col-span-full text-center py-10 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400">
            No services yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServices;