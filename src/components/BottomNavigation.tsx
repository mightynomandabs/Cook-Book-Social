import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Plus, Users, User, BarChart3, DollarSign, Settings } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCreatorTools, setShowCreatorTools] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isCreatorRoute = () => {
    return location.pathname.startsWith('/creator');
  };

  const mainNavItems = [
    { path: '/feed', icon: Home, label: 'Home' },
    { path: '/community', icon: Users, label: 'Community' },
    { path: '/create', icon: Plus, label: 'Create', isSpecial: true },
    { path: '/restaurants', icon: Search, label: 'Restaurants' },
    { path: '/profile/1', icon: User, label: 'Profile' }
  ];

  const creatorNavItems = [
    { path: '/creator/dashboard', icon: BarChart3, label: 'Dashboard', isSpecial: false },
    { path: '/creator/content', icon: Plus, label: 'Content', isSpecial: true },
    { path: '/creator/monetization', icon: DollarSign, label: 'Earnings', isSpecial: false },
    { path: '/creator/profile', icon: User, label: 'Profile', isSpecial: false }
  ];

  const currentNavItems = isCreatorRoute() ? creatorNavItems : mainNavItems;

  const handleProfileClick = () => {
    if (isCreatorRoute()) {
      navigate('/creator/profile');
    } else {
      navigate('/profile/1');
    }
  };

  const handleCreateClick = () => {
    if (isCreatorRoute()) {
      navigate('/creator/content');
    } else {
      navigate('/create');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 z-20 shadow-lg shadow-slate-200/50 dark:shadow-slate-800/50 transition-colors duration-300">
      {/* Creator Tools Toggle */}
      {!isCreatorRoute() && (
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setShowCreatorTools(!showCreatorTools)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-cookbook-orange/10 text-cookbook-orange rounded-lg hover:bg-cookbook-orange/20 transition-colors text-sm font-medium"
          >
            <BarChart3 className="w-4 h-4" />
            <span>{showCreatorTools ? 'Hide' : 'Show'} Creator Tools</span>
          </button>
        </div>
      )}

      {/* Creator Tools Quick Access */}
      {showCreatorTools && !isCreatorRoute() && (
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-cookbook-orange/5 to-cookbook-yellow/5">
          <div className="grid grid-cols-4 gap-2">
            {creatorNavItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center py-2 px-1 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <item.icon className="w-5 h-5 text-cookbook-orange mb-1" />
                <span className="text-xs font-medium text-cookbook-orange">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="flex items-center justify-around px-4 py-3">
        {currentNavItems.map((item) => (
          <button
            key={item.path}
            onClick={() => {
              if (item.path === '/profile/1' || item.path === '/creator/profile') {
                handleProfileClick();
              } else if (item.path === '/create' || item.path === '/creator/content') {
                handleCreateClick();
              } else {
                navigate(item.path);
              }
            }}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-300 ${
              item.isSpecial
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white transform -translate-y-4 shadow-xl shadow-orange-500/25'
                : isActive(item.path)
                ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/20'
                : 'text-slate-500 dark:text-slate-400 hover:text-orange-500 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className={`${item.isSpecial ? 'w-14 h-14' : 'w-6 h-6'} flex items-center justify-center`}>
              <item.icon className={item.isSpecial ? 'w-8 h-8' : 'w-6 h-6'} />
            </div>
            <span className={`text-xs mt-1 font-semibold ${item.isSpecial ? 'text-white' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Creator Mode Indicator */}
      {isCreatorRoute() && (
        <div className="px-4 py-2 bg-gradient-to-r from-cookbook-orange to-cookbook-yellow text-white text-center text-sm font-medium">
          🎯 Creator Mode Active
        </div>
      )}
    </div>
  );
};

export default BottomNavigation;
