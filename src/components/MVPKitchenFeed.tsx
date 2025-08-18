import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Bell, Grid, Video, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { analytics } from '../services/analytics';
import { EmptyFeed, EmptySearch } from './EmptyState';
import { FeedSkeleton, SearchSkeleton } from './LoadingStates';
import RecipeCard from './RecipeCard';
import ThemeToggle from './ThemeToggle';
import FilterButton from './FilterButton';

const MVPKitchenFeed: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'reels'>('reels');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { 
    recipes, 
    stories, 
    loading, 
    error, 
    searchRecipes, 
    filterRecipesByCuisine 
  } = useSupabaseData();

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      searchRecipes(searchQuery);
      if (user) {
        analytics.trackFeedScrolled(user.id, 0);
      }
    }
  }, [searchQuery, searchRecipes, user]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate refresh delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.location.reload();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Track recipe view for analytics
  const handleRecipeView = (recipeId: string) => {
    if (user) {
      analytics.trackRecipeViewed(user.id, recipeId);
    }
    navigate(`/recipe/${recipeId}`);
  };

  // Handle create recipe
  const handleCreateRecipe = () => {
    navigate('/create');
  };

  // Show loading state
  if (loading && !recipes.length) {
    return <FeedSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {error}
          </p>
          <button
            onClick={handleRefresh}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show empty state if no recipes
  if (!loading && (!recipes || recipes.length === 0)) {
    if (searchQuery.trim()) {
      return <EmptySearch />;
    }
    return <EmptyFeed onCreateRecipe={handleCreateRecipe} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 py-4 shadow-sm transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25 overflow-hidden">
              <img 
                src="/cookbook-logo.png" 
                alt="CookBook Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
              CookBook
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <button className="p-3 text-slate-600 hover:text-orange-500 hover:bg-orange-50 dark:text-slate-300 dark:hover:text-orange-400 dark:hover:bg-slate-800 rounded-xl transition-all duration-200">
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
            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:outline-none transition-all duration-200 text-slate-700 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400"
          />
        </div>

        {/* View Mode Toggle & Filter Button */}
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FilterButton onClick={() => setShowFilters(!showFilters)} />
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 rounded-2xl p-1">
              <button
                onClick={() => setViewMode('reels')}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  viewMode === 'reels'
                    ? 'bg-white dark:bg-slate-700 text-orange-500 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Video size={20} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-orange-500 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Grid size={20} />
              </button>
            </div>
          </div>

          {/* Create Recipe Button */}
          <button
            onClick={handleCreateRecipe}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Create</span>
          </button>
        </div>
      </div>

      {/* Recipe Feed */}
      <div className="pb-20">
        {viewMode === 'reels' ? (
          <div className="space-y-4">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="px-4">
                <RecipeCard 
                  recipe={recipe} 
                  onView={() => handleRecipeView(recipe.id)}
                  viewMode="reels"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 p-4">
            {recipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                onView={() => handleRecipeView(recipe.id)}
                viewMode="grid"
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button for Create */}
      <button
        onClick={handleCreateRecipe}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center z-10"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default MVPKitchenFeed;
