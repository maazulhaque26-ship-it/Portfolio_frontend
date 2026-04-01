// ============================================================
// frontend/src/pages/admin/AdminTools.jsx
// ============================================================
// Admin panel for "Favorite Tools" section. Uses authFetch().
// ============================================================

import { useState, useEffect, useContext } from 'react';
import { PortfolioContext } from '../../context/PortfolioContext';
import { authFetch, API_BASE, resolveImageUrl } from '../../utils/api';

const Toast = ({ msg, type }) => {
  if (!msg) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-2xl border font-semibold text-sm shadow-xl
      ${type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
      {msg}
    </div>
  );
};

const EMPTY = { name: '', icon: '', percentage: '90%', imageUrl: '' };

const AdminTools = ({ onSave }) => {
  const { refreshData } = useContext(PortfolioContext);

  const [tools,     setTools]     = useState([]);
  const [view,      setView]      = useState('list');
  const [formData,  setFormData]  = useState(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast,     setToast]     = useState({ msg: '', type: 'success' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3500);
  };

  // Fetch all tools from backend
  const fetchTools = async () => {
    try {
      const res  = await fetch(`${API_BASE}/api/tools`);
      const data = await res.json();
      setTools(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[AdminTools] Fetch error:', err);
    }
  };

  useEffect(() => { fetchTools(); }, []);

  // Upload tool icon image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append('image', file);
    try {
      const res = await authFetch('/api/upload', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (res.ok) {
        setFormData((p) => ({ ...p, imageUrl: data.url }));
        showToast('Icon uploaded ✓');
      } else {
        showToast(data.message || 'Upload failed', 'error');
      }
    } catch {
      showToast('Upload error', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Save (create or update) a tool
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      showToast('Tool name is required!', 'error');
      return;
    }

    setSaving(true);
    try {
      const endpoint = view === 'edit' ? `/api/tools/${editingId}` : '/api/tools';
      const method   = view === 'edit' ? 'PUT' : 'POST';

      const res = await authFetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(view === 'edit' ? 'Tool updated ✓' : 'Tool added ✓');
        setView('list');
        fetchTools();
        refreshData?.();
        onSave?.();
      } else {
        showToast(data.message || 'Save failed', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete a tool
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tool?')) return;
    try {
      await authFetch(`/api/tools/${id}`, { method: 'DELETE' });
      fetchTools();
      refreshData?.();
      onSave?.();
      showToast('Tool deleted');
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  const inputStyle =
    'w-full bg-white border border-gray-200 p-4 rounded-xl text-black focus:ring-2 focus:ring-olivia-gold focus:border-transparent transition-all';

  // ── Add / Edit Form ────────────────────────────────────────
  if (view !== 'list') {
    const preview = resolveImageUrl(formData.imageUrl);
    return (
      <>
        <Toast {...toast} />
        <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 shadow-sm border border-gray-100 max-w-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b pb-4">
            <h3 className="text-2xl font-serif font-bold text-olivia-green">
              {view === 'add' ? 'Add New Tool' : 'Edit Tool'}
            </h3>
            <button
              onClick={() => setView('list')}
              className="text-gray-500 hover:text-black font-bold text-sm bg-gray-100 px-4 py-2 rounded-lg"
            >
              ← Back
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Tool Icon Image */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Tool Icon (optional image)
              </label>
              {preview && (
                <img
                  src={preview}
                  className="w-16 h-16 object-contain rounded-xl mb-3 border shadow-sm bg-gray-50 p-1"
                  alt="icon preview"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-olivia-gold/10 file:text-olivia-green hover:file:bg-olivia-gold/20"
              />
              {uploading && (
                <span className="text-xs text-olivia-gold font-bold mt-2 inline-block animate-pulse">
                  Uploading…
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Tool Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Figma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Icon Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. F, Ai, Id"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Proficiency %
                </label>
                <input
                  type="text"
                  placeholder="e.g. 98%"
                  value={formData.percentage}
                  onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                  className={inputStyle}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving || uploading}
              className="bg-olivia-green text-white font-bold px-10 py-4 rounded-full hover:bg-olivia-gold hover:text-black transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Save Tool'}
            </button>
          </form>
        </div>
      </>
    );
  }

  // ── List View ──────────────────────────────────────────────
  return (
    <>
      <Toast {...toast} />
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-xl font-bold font-serif text-olivia-green">
            Favorite Tools ({tools.length})
          </h2>
          <button
            onClick={() => { setFormData(EMPTY); setEditingId(null); setView('add'); }}
            className="bg-olivia-gold font-bold px-6 py-3 rounded-full hover:bg-yellow-500 shadow-md"
          >
            + Add New Tool
          </button>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tools.map((tool) => {
            const iconSrc = resolveImageUrl(tool.imageUrl);
            return (
              <div
                key={tool._id}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-shadow"
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center mb-3 shadow-sm">
                  {iconSrc ? (
                    <img src={iconSrc} className="w-10 h-10 object-contain" alt={tool.name} />
                  ) : (
                    <span className="text-2xl font-bold text-olivia-green">
                      {tool.icon || '✦'}
                    </span>
                  )}
                </div>

                {/* Info */}
                <h4 className="font-bold text-olivia-green text-lg">{tool.percentage}</h4>
                <p className="text-gray-500 text-sm font-medium mt-1">{tool.name}</p>

                {/* Actions */}
                <div className="flex gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setFormData({
                        name:       tool.name       || '',
                        icon:       tool.icon       || '',
                        percentage: tool.percentage || '90%',
                        imageUrl:   tool.imageUrl   || '',
                      });
                      setEditingId(tool._id);
                      setView('edit');
                    }}
                    className="text-xs font-bold text-olivia-green hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tool._id)}
                    className="text-xs font-bold text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}

          {tools.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-16 border-2 border-dashed border-gray-200 rounded-3xl">
              No tools added yet. Click "+ Add New Tool" to get started.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminTools;