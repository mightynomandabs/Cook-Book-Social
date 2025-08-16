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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 ${
              item.isSpecial
                ? 'bg-gradient-to-r from-cookbook-orange to-cookbook-yellow text-white transform -translate-y-3 shadow-lg'
                : isActive(item.path)
                ? 'text-cookbook-orange'
                : 'text-gray-500 hover:text-cookbook-orange'
            }`}
          >
            <div className={`${item.isSpecial ? 'w-12 h-12' : 'w-6 h-6'} flex items-center justify-center`}>
              <item.icon className={item.isSpecial ? 'w-7 h-7' : 'w-6 h-6'} />
            </div>
            <span className={`text-xs mt-1 font-medium ${item.isSpecial ? 'text-white' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
