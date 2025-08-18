import React from 'react';
import { Home, Plus, User } from 'lucide-react';

interface SimpleBottomNavProps {
  currentTab: 'feed' | 'create' | 'profile';
  onTabChange: (tab: 'feed' | 'create' | 'profile') => void;
}

const SimpleBottomNav: React.FC<SimpleBottomNavProps> = ({ currentTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 appetit-bottom-nav border-t border-appetit-purple/10 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Feed Tab */}
        <button
          onClick={() => onTabChange('feed')}
          className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-xl transition-all duration-300 ${
            currentTab === 'feed'
              ? 'text-appetit-orange bg-appetit-orange-light'
              : 'appetit-text-secondary hover:appetit-text-primary hover:bg-appetit-purple-light'
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
              ? 'text-appetit-orange bg-appetit-orange-light'
              : 'appetit-text-secondary hover:appetit-text-primary hover:bg-appetit-purple-light'
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
              ? 'text-appetit-orange bg-appetit-orange-light'
              : 'appetit-text-secondary hover:appetit-text-primary hover:bg-appetit-purple-light'
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
