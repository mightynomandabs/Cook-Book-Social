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
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cookbook-orange to-cookbook-yellow rounded-full flex items-center justify-center">
              <span className="text-xl">🍳</span>
            </div>
            <h1 className="text-xl font-bold text-cookbook-black">CookBook</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:text-cookbook-orange transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search recipes, chefs, or cuisines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cookbook-orange focus:border-transparent focus:outline-none"
          />
        </div>

        {/* Filter Button */}
        <div className="mt-3 flex justify-between items-center">
          <FilterButton onClick={() => setShowFilters(!showFilters)} />
          <div className="text-sm text-gray-500">
            Showing <span className="font-semibold text-cookbook-orange">trending</span> recipes
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
