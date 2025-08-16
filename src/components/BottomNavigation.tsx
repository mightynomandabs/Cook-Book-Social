import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Plus, Users, User } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/feed', icon: Home, label: 'Home' },
    { path: '/community', icon: Users, label: 'Community' },
    { path: '/create', icon: Plus, label: 'Create', isSpecial: true },
    { path: '/restaurants', icon: Search, label: 'Restaurants' },
    { path: '/profile/1', icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 z-20 shadow-lg shadow-slate-200/50 dark:shadow-slate-800/50 transition-colors duration-300">
      <div className="flex items-center justify-around px-4 py-3">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
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
    </div>
  );
};

export default BottomNavigation;
