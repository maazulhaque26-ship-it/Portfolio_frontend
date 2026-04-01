import { useContext } from 'react';
import { PortfolioContext } from '../context/PortfolioContext';

const LiveEditBar = () => {
  const { isEditing, saveChanges, cancelChanges } = useContext(PortfolioContext);

  if (!isEditing) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] bg-white border border-gray-200 shadow-2xl rounded-full px-6 py-3 flex items-center gap-4 animate-bounce">
      <div className="flex items-center gap-2 mr-4">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <span className="font-bold text-gray-800 text-sm uppercase tracking-wider">Live Edit Mode</span>
      </div>
      <button 
        onClick={cancelChanges}
        className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
      >
        <span className="text-red-500 font-bold mr-1">×</span> Exit
      </button>
      <button 
        onClick={saveChanges}
        className="px-6 py-2 bg-olivia-gold hover:bg-olivia-gold-light text-black font-bold rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer"
      >
        Save Changes
      </button>
    </div>
  );
};

export default LiveEditBar;
