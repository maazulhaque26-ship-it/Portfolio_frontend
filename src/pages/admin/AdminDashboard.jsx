// ============================================================
// frontend/src/pages/admin/AdminDashboard.jsx
// ============================================================
// Clean admin dashboard — no heavy animations, all 11 tabs.
// ============================================================

import { useState, useContext } from 'react';
import { PortfolioContext } from '../../context/PortfolioContext';
import AdminSidebar      from './AdminSidebar';
import AdminProfile      from './AdminProfile';
import AdminContact      from './AdminContact';
import AdminPricing      from './AdminPricing';
import AdminTimeline     from './AdminTimeline';
import AdminServices     from './AdminServices';
import AdminProjects     from './AdminProjects';
import AdminBlogs        from './AdminBlogs';
import AdminTestimonials from './AdminTestimonials';
import AdminTools        from './AdminTools';
import AdminFooter       from './AdminFooter';
import AdminMarquee      from './AdminMarquee';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { refreshData } = useContext(PortfolioContext);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':      return <AdminProfile      onSave={refreshData} />;
      case 'contact':      return <AdminContact      onSave={refreshData} />;
      case 'pricing':      return <AdminPricing      onSave={refreshData} />;
      case 'timeline':     return <AdminTimeline     onSave={refreshData} />;
      case 'services':     return <AdminServices     onSave={refreshData} />;
      case 'projects':     return <AdminProjects     onSave={refreshData} />;
      case 'blogs':        return <AdminBlogs        onSave={refreshData} />;
      case 'testimonials': return <AdminTestimonials onSave={refreshData} />;
      case 'tools':        return <AdminTools        onSave={refreshData} />;
      case 'footer':       return <AdminFooter       onSave={refreshData} />;
      case 'marquee':      return <AdminMarquee      onSave={refreshData} />;
      default:
        return (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center p-10 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
              <span className="text-5xl mb-4 block opacity-50">🚧</span>
              <h3 className="text-xl font-bold font-serif mb-2">Section Under Construction</h3>
              <p className="text-gray-500 text-sm">This module is being built.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f8fafc] text-gray-800 font-sans overflow-hidden w-full absolute inset-0 z-[100]">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-12 py-6 md:py-10">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-olivia-green capitalize">
            Manage {activeTab}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Control your portfolio data securely with controlled inputs.
          </p>
        </div>

        {/* Active Tab Content */}
        <div className="transition-opacity duration-200">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;