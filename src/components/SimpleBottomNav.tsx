import React from 'react';
import { Home, Plus, User } from 'lucide-react';

interface SimpleBottomNavProps {
  currentTab: 'feed' | 'create' | 'profile';
  onTabChange: (tab: 'feed' | 'create' | 'profile') => void;
}

const SimpleBottomNav: React.FC<SimpleBottomNavProps> = ({ currentTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 glass-effect border-t border-white/10 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Feed Tab */}
        <button
          onClick={() => onTabChange('feed')}
          className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-xl transition-all duration-300 ${
            currentTab === 'feed'
              ? 'text-pink-500 bg-pink-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">Feed</span>
        </button>

        {/* Create Tab */}
        <button
          onClick={() => onTabChange('create')}
          className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-xl transition-all duration-300 ${
            currentTab === 'create'
              ? 'text-pink-500 bg-pink-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Plus className="w-6 h-6" />
          <span className="text-xs font-medium">Create</span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-xl transition-all duration-300 ${
            currentTab === 'profile'
              ? 'text-pink-500 bg-pink-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
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
