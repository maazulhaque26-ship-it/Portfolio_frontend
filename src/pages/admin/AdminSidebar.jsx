// ============================================================
// frontend/src/pages/admin/AdminSidebar.jsx
// ============================================================
// Clean sidebar — no GSAP, all 11 tabs, CSS-only transitions.
// ============================================================

import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const tabs = [
    { id: 'profile',      label: 'Profile',       icon: '👤' },
    { id: 'contact',      label: 'Contact',        icon: '📬' },
    { id: 'pricing',      label: 'Pricing',        icon: '💰' },
    { id: 'timeline',     label: 'Timeline',       icon: '🗓️' },
    { id: 'achievements', label: 'Achievements',   icon: '🏆' },
    { id: 'services',     label: 'Services',       icon: '✨' },
    { id: 'projects',     label: 'Projects',       icon: '📁' },
    { id: 'blogs',        label: 'Blogs',           icon: '📝' },
    { id: 'testimonials', label: 'Testimonials',   icon: '⭐' },
    { id: 'tools',        label: 'Tools',           icon: '🛠️' },
    { id: 'footer',       label: 'Footer',          icon: '🔻' },
    { id: 'marquee',      label: 'Marquee',         icon: '📢' },
  ];

  return (
    <div className="w-full md:w-64 bg-olivia-green text-white flex flex-col h-auto md:h-full shadow-2xl z-10 shrink-0 border-b md:border-b-0 md:border-r border-white/10">
      {/* Header */}
      <div className="hidden md:block p-8 pb-4 mb-2 border-b border-white/10">
        <h2 className="text-2xl font-serif font-bold text-olivia-gold">Master Panel</h2>
        <p className="text-[10px] text-gray-300 mt-1 uppercase tracking-widest font-bold">Dashboard V2</p>
      </div>

      {/* Navigation */}
      <nav className="flex-none md:flex-1 px-3 py-3 md:py-0 md:space-y-1 md:mt-2 flex flex-row md:flex-col overflow-x-auto whitespace-nowrap gap-1.5 md:gap-0 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-none md:w-full text-left flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-xl transition-all duration-200 cursor-pointer text-xs md:text-sm ${
              activeTab === tab.id
                ? 'bg-olivia-gold text-[#0a1f14] font-bold shadow-md'
                : 'text-gray-300 hover:bg-white/10 hover:text-white font-medium'
            }`}
          >
            <span className="text-base md:text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 md:p-5 border-t border-white/10 mt-auto shrink-0 flex flex-row md:flex-col gap-2 md:gap-2 items-center w-full">
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="flex-1 md:w-full text-center bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg md:rounded-xl py-2 md:py-2.5 px-2 text-[10px] md:text-xs transition-colors font-bold uppercase tracking-wider block"
        >
          End Session
        </button>
        <a
          href="/"
          className="flex-1 md:w-full text-center bg-white/5 hover:bg-white/10 text-white rounded-lg md:rounded-xl py-2 md:py-2.5 px-2 text-[10px] md:text-xs transition-colors font-bold uppercase tracking-wider block"
        >
          Live Site
        </a>
      </div>
    </div>
  );
};

export default AdminSidebar;