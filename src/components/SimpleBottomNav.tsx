import React from 'react';
import { Home, Plus, User } from 'lucide-react';

interface SimpleBottomNavProps {
  currentTab: 'feed' | 'create' | 'profile';
  onTabChange: (tab: 'feed' | 'create' | 'profile') => void;
}

const SimpleBottomNav: React.FC<SimpleBottomNavProps> = ({ currentTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Feed Tab */}
        <button
          onClick={() => onTabChange('feed')}
          className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-xl transition-colors ${
            currentTab === 'feed'
              ? 'text-orange-500 bg-orange-50'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">Feed</span>
        </button>

        {/* Create Tab */}
        <button
          onClick={() => onTabChange('create')}
          className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-xl transition-colors ${
            currentTab === 'create'
              ? 'text-orange-500 bg-orange-50'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Plus className="w-6 h-6" />
          <span className="text-xs font-medium">Create</span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-xl transition-colors ${
            currentTab === 'profile'
              ? 'text-orange-500 bg-orange-50'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default SimpleBottomNav;
