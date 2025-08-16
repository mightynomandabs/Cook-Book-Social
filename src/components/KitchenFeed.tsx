import React, { useState, useEffect } from 'react';
import { Search, Filter, Bell } from 'lucide-react';
import FeaturedStories from './FeaturedStories';
import RecipeFeed from './RecipeFeed';
import FilterButton from './FilterButton';
import { useSupabaseData } from '../hooks/useSupabaseData';

const KitchenFeed: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { recipes, stories, loading, error, searchRecipes, filterRecipesByCuisine } = useSupabaseData();

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      searchRecipes(searchQuery);
    }
  }, [searchQuery, searchRecipes]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25 overflow-hidden">
              <img 
                src="/cookbook-logo.png" 
                alt="CookBook Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent">
              CookBook
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-3 text-slate-600 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all duration-200">
              <Bell className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search recipes, chefs, or cuisines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:outline-none transition-all duration-200 text-slate-700 placeholder-slate-500"
          />
        </div>

        {/* Filter Button */}
        <div className="mt-4 flex justify-between items-center">
          <FilterButton onClick={() => setShowFilters(!showFilters)} />
          <div className="text-sm text-slate-600">
            Showing <span className="font-semibold text-orange-500">trending</span> recipes
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cookbook-orange"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="px-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Stories Section */}
      {!loading && !error && (
        <div className="px-4 py-4">
          <FeaturedStories stories={stories} />
        </div>
      )}

      {/* Recipe Feed */}
      {!loading && !error && (
        <div className="flex-1">
          <RecipeFeed 
            recipes={recipes} 
            searchQuery={searchQuery} 
            showFilters={showFilters}
            onFilterByCuisine={filterRecipesByCuisine}
          />
        </div>
      )}
    </div>
  );
};

export default KitchenFeed;
