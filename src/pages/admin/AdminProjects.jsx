// ============================================================
// frontend/src/pages/admin/AdminProjects.jsx
// ============================================================
// UPDATED: Migrated from raw fetch + user.token to authFetch()
//          for consistent, centralized token handling.
//          If token is ever invalid, authFetch auto-handles 401.
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

const EMPTY = { title: '', description: '', technologies: '', liveViewUrl: '', githubUrl: '', imageUrl: '' };

const AdminProjects = ({ onSave }) => {
  const { refreshData } = useContext(PortfolioContext);

  const [projects,  setProjects]  = useState([]);
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

  // Fetch all projects (public endpoint, no auth needed)
  const fetchProjects = async () => {
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`);
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchProjects(); }, []);

  // Upload image via authenticated endpoint
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('image', file);
    try {
      const res  = await authFetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (res.ok) {
        setFormData((p) => ({ ...p, imageUrl: data.url }));
        showToast('Image uploaded ✓');
      } else {
        showToast(data.message || 'Upload failed', 'error');
      }
    } catch { showToast('Upload error', 'error'); }
    finally { setUploading(false); }
  };

  // Save (create or update) project
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.imageUrl) {
      showToast('Title, Description and Image are required!', 'error');
      return;
    }
    setSaving(true);

    const techArray = typeof formData.technologies === 'string'
      ? formData.technologies.split(',').map((t) => t.trim()).filter(Boolean)
      : formData.technologies;

    const payload = { ...formData, technologies: techArray };

    try {
      const endpoint = view === 'edit' ? `/api/projects/${editingId}` : '/api/projects';
      const method   = view === 'edit' ? 'PUT' : 'POST';

      const res = await authFetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(view === 'edit' ? 'Project updated ✓' : 'Project added ✓');
        setView('list');
        fetchProjects();
        refreshData?.();
        onSave?.();
      } else {
        showToast(data.message || 'Save failed', 'error');
      }
    } catch { showToast('Network error', 'error'); }
    finally { setSaving(false); }
  };

  // Delete project
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await authFetch(`/api/projects/${id}`, { method: 'DELETE' });
      fetchProjects();
      refreshData?.();
      showToast('Project deleted');
    } catch { showToast('Delete failed', 'error'); }
  };

  // ── Add / Edit Form ────────────────────────────────────────
  if (view !== 'list') {
    const preview = resolveImageUrl(formData.imageUrl);
    return (
      <>
        <Toast {...toast} />
        <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-10 shadow-sm border border-gray-100 max-w-4xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b pb-4">
            <h3 className="text-2xl font-serif font-bold text-olivia-green">
              {view === 'add' ? 'Add New Project' : 'Edit Project'}
            </h3>
            <button onClick={() => setView('list')}
              className="text-gray-500 hover:text-black font-bold text-sm bg-gray-100 px-4 py-2 rounded-lg">← Return to List</button>
          </div>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Project Thumbnail</label>
              {preview && <img src={preview} className="w-full max-w-sm h-48 object-cover rounded-xl mb-4 border shadow-sm" alt="preview" />}
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-olivia-gold/10 file:text-olivia-green hover:file:bg-olivia-gold/20" />
              {uploading && <span className="text-xs text-olivia-gold font-bold mt-2 inline-block animate-pulse">Uploading…</span>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Project Title</label>
                <input required type="text" value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-olivia-gold font-medium" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Technologies <span className="font-normal normal-case text-gray-400">(comma separated)</span>
                </label>
                <input type="text" placeholder="React, Node.js, MongoDB" value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-olivia-gold font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Live View URL</label>
                <input type="url" placeholder="https://" value={formData.liveViewUrl}
                  onChange={(e) => setFormData({ ...formData, liveViewUrl: e.target.value })}
                  className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-olivia-gold font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">GitHub URL</label>
                <input type="url" placeholder="https://github.com/..." value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-olivia-gold font-medium" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Description</label>
                <textarea required rows={5} value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-olivia-gold font-medium resize-none" />
              </div>
            </div>
            <button type="submit" disabled={saving || uploading}
              className="bg-olivia-green text-white font-bold px-10 py-4 rounded-full hover:bg-olivia-gold hover:text-black transition-colors shadow-md disabled:opacity-60">
              {saving ? 'Saving…' : 'Save Project'}
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
          <h2 className="text-xl font-bold font-serif text-olivia-green">Stored Projects ({projects.length})</h2>
          <button onClick={() => { setFormData(EMPTY); setEditingId(null); setView('add'); }}
            className="bg-olivia-gold font-bold px-6 py-3 rounded-full hover:bg-yellow-500 shadow-md">+ Add New Project</button>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-olivia-green text-white">
                <th className="p-4 text-xs font-bold uppercase">Image</th>
                <th className="p-4 text-xs font-bold uppercase">Title</th>
                <th className="p-4 text-xs font-bold uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <img src={resolveImageUrl(p.imageUrl)} className="w-12 h-12 rounded-lg object-cover" alt="" />
                  </td>
                  <td className="p-4 font-bold">{p.title}</td>
                  <td className="p-4 text-right space-x-4">
                    <button onClick={() => {
                      setFormData({
                        ...p,
                        technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies,
                      });
                      setEditingId(p._id);
                      setView('edit');
                    }} className="text-olivia-green font-bold text-sm hover:underline">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-500 font-bold text-sm hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr><td colSpan="3" className="p-8 text-center text-gray-400">No projects yet. Click "+ Add New Project".</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminProjects;