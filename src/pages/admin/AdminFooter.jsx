// ============================================================
// frontend/src/pages/admin/AdminFooter.jsx
// ============================================================
// Admin panel for editing footer content. Uses authFetch().
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

const AdminFooter = ({ onSave }) => {
  const { footer, refreshData } = useContext(PortfolioContext);

  const [formData, setFormData] = useState({
    brandName:     '',
    tagline:       '',
    copyrightText: '',
    socials: {
      linkedin:  '',
      twitter:   '',
      dribbble:  '',
      github:    '',
      instagram: '',
    },
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState({ msg: '', type: 'success' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3500);
  };

  // Populate from existing footer data
  useEffect(() => {
    if (footer) {
      setFormData({
        brandName:     footer.brandName     || '',
        tagline:       footer.tagline       || '',
        copyrightText: footer.copyrightText || '',
        socials: {
          linkedin:  footer.socials?.linkedin  || '',
          twitter:   footer.socials?.twitter   || '',
          dribbble:  footer.socials?.dribbble  || '',
          github:    footer.socials?.github    || '',
          instagram: footer.socials?.instagram || '',
        },
      });
    }
  }, [footer]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socials: { ...prev.socials, [platform]: value },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authFetch('/api/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast('Footer saved successfully!');
        refreshData();
        onSave?.();
      } else {
        const err = await res.json();
        showToast(err.message || 'Failed to save', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle =
    'w-full bg-white border border-gray-200 p-4 rounded-xl text-black focus:ring-2 focus:ring-olivia-gold focus:border-transparent transition-all';
  const labelStyle =
    'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2';

  return (
    <>
      <Toast {...toast} />
      <div className="max-w-3xl">
        <form onSubmit={handleSave} className="space-y-8">

          {/* Brand & Copyright */}
          <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold font-serif text-olivia-green mb-6 border-b pb-4">
              Footer Content
            </h2>

            <div className="space-y-5">
              <div>
                <label className={labelStyle}>Brand Name</label>
                <input className={inputStyle} placeholder="Your Brand"
                  value={formData.brandName}
                  onChange={(e) => handleChange('brandName', e.target.value)}
                />
              </div>

              <div>
                <label className={labelStyle}>Tagline (optional)</label>
                <input className={inputStyle} placeholder="Design that speaks louder than words"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                />
              </div>

              <div>
                <label className={labelStyle}>Copyright Text</label>
                <input className={inputStyle}
                  placeholder={`© ${new Date().getFullYear()} Your Name. All rights reserved.`}
                  value={formData.copyrightText}
                  onChange={(e) => handleChange('copyrightText', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Footer Social Links */}
          <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold font-serif text-olivia-green mb-6 border-b pb-4">
              Footer Social Links
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelStyle}>LinkedIn URL</label>
                <input className={inputStyle} placeholder="https://linkedin.com/in/yourname"
                  value={formData.socials.linkedin}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                />
              </div>
              <div>
                <label className={labelStyle}>Twitter / X URL</label>
                <input className={inputStyle} placeholder="https://twitter.com/yourhandle"
                  value={formData.socials.twitter}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                />
              </div>
              <div>
                <label className={labelStyle}>Dribbble URL</label>
                <input className={inputStyle} placeholder="https://dribbble.com/yourname"
                  value={formData.socials.dribbble}
                  onChange={(e) => handleSocialChange('dribbble', e.target.value)}
                />
              </div>
              <div>
                <label className={labelStyle}>GitHub URL</label>
                <input className={inputStyle} placeholder="https://github.com/yourname"
                  value={formData.socials.github}
                  onChange={(e) => handleSocialChange('github', e.target.value)}
                />
              </div>
              <div>
                <label className={labelStyle}>Instagram URL</label>
                <input className={inputStyle} placeholder="https://instagram.com/yourname"
                  value={formData.socials.instagram}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Footer Preview */}
          <div className="bg-olivia-green rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 text-white">
            <h3 className="text-xs font-bold uppercase tracking-widest text-olivia-gold mb-4">
              Live Preview
            </h3>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-olivia-gold rounded-full flex items-center justify-center font-bold text-[#0a1f14]">
                  {formData.brandName?.charAt(0) || '•'}
                </div>
                <span className="font-bold text-white tracking-widest text-lg">
                  {formData.brandName || 'Brand'}
                </span>
              </div>
              <p className="text-white/60 text-sm text-center">
                {formData.copyrightText || `© ${new Date().getFullYear()} Your Name`}
              </p>
              <div className="flex gap-4 text-xs font-bold tracking-wider text-white/50 flex-wrap justify-center">
                {formData.socials.linkedin  && <span className="hover:text-olivia-gold">LinkedIn</span>}
                {formData.socials.twitter   && <span className="hover:text-olivia-gold">Twitter</span>}
                {formData.socials.dribbble  && <span className="hover:text-olivia-gold">Dribbble</span>}
                {formData.socials.github    && <span className="hover:text-olivia-gold">GitHub</span>}
                {formData.socials.instagram && <span className="hover:text-olivia-gold">Instagram</span>}
              </div>
            </div>
            {formData.tagline && (
              <p className="text-center text-white/40 text-xs mt-4 italic">{formData.tagline}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-olivia-green text-white font-bold py-4 rounded-full hover:bg-olivia-gold hover:text-black transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Footer'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminFooter;