// ============================================================
// frontend/src/pages/admin/AdminBlogs.jsx
// ============================================================
// UPDATED: Migrated from raw fetch + user.token to authFetch()
//          for consistent, centralized token handling.
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

const CATEGORIES = ['Design', 'Technology', 'Career', 'General News'];
const EMPTY = { title: '', content: '', imageUrl: '', category: 'Design' };

const AdminBlogs = ({ onSave }) => {
  const { refreshData } = useContext(PortfolioContext);

  const [blogs,     setBlogs]     = useState([]);
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

  const fetchBlogs = async () => {
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs`);
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchBlogs(); }, []);

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
    try {
      const endpoint = view === 'edit' ? `/api/blogs/${editingId}` : '/api/blogs';
      const method   = view === 'edit' ? 'PUT' : 'POST';
      const res = await authFetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(view === 'edit' ? 'Blog updated ✓' : 'Blog published ✓');
        setView('list'); fetchBlogs(); refreshData?.(); onSave?.();
      } else showToast(data.message || 'Save failed', 'error');
    } catch { showToast('Network error', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await authFetch(`/api/blogs/${id}`, { method: 'DELETE' });
      fetchBlogs(); refreshData?.(); onSave?.(); showToast('Post deleted');
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
              {view === 'add' ? 'Compose New Post' : 'Edit Post'}
            </h3>
            <button onClick={() => setView('list')}
              className="text-gray-500 hover:text-black font-bold text-sm bg-gray-100 px-4 py-2 rounded-lg">← Back</button>
          </div>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Cover Image</label>
              {preview && <img src={preview} className="w-full max-w-sm h-44 object-cover rounded-xl mb-4 border shadow-sm" alt="preview" />}
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-olivia-gold/10 file:text-olivia-green hover:file:bg-olivia-gold/20" />
              {uploading && <span className="text-xs text-olivia-gold font-bold mt-2 inline-block animate-pulse">Uploading…</span>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-olivia-gold font-medium">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Article Title</label>
                <input required type="text" value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-olivia-gold font-medium" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Content / Body</label>
                <textarea required rows={8} value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-olivia-gold font-medium resize-none" />
              </div>
            </div>
            <button type="submit" disabled={saving || uploading}
              className="bg-olivia-green text-white font-bold px-10 py-4 rounded-full hover:bg-olivia-gold hover:text-black transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
              {saving ? 'Publishing…' : 'Publish Post'}
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
          <h2 className="text-xl font-bold font-serif text-olivia-green">Published Posts ({blogs.length})</h2>
          <button onClick={() => { setFormData(EMPTY); setEditingId(null); setView('add'); }}
            className="bg-olivia-gold font-bold px-6 py-3 rounded-full hover:bg-yellow-500 shadow-md">+ Draft New Article</button>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-olivia-green text-white">
                <th className="p-4 text-xs font-bold tracking-wider uppercase">Cover</th>
                <th className="p-4 text-xs font-bold tracking-wider uppercase">Title</th>
                <th className="p-4 text-xs font-bold tracking-wider uppercase hidden md:table-cell">Date</th>
                <th className="p-4 text-xs font-bold tracking-wider uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((b) => {
                const src = resolveImageUrl(b.imageUrl);
                return (
                  <tr key={b._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      {src ? <img src={src} className="w-16 h-12 rounded-lg object-cover shadow-sm border border-gray-200" alt={b.title} />
                           : <div className="w-16 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">No img</div>}
                    </td>
                    <td className="p-4 font-bold text-olivia-text">
                      {b.title}
                      <span className="block text-xs text-olivia-gold font-bold uppercase mt-0.5">{b.category}</span>
                    </td>
                    <td className="p-4 text-sm text-gray-500 hidden md:table-cell">{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right space-x-4 whitespace-nowrap">
                      <button onClick={() => {
                        setFormData({ title: b.title || '', content: b.content || '', imageUrl: b.imageUrl || '', category: b.category || 'Design' });
                        setEditingId(b._id); setView('edit');
                      }} className="text-sm font-bold text-olivia-green hover:underline">Edit</button>
                      <button onClick={() => handleDelete(b._id)}
                        className="text-sm font-bold text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                );
              })}
              {blogs.length === 0 && (
                <tr><td colSpan="4" className="p-8 text-center text-gray-400 font-medium">No posts yet. Click "+ Draft New Article" to start.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminBlogs;