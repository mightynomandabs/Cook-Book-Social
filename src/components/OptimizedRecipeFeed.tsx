import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Grid, List, Search } from 'lucide-react';
import MasonryGrid from './MasonryGrid';
import OptimizedRecipeCard from './OptimizedRecipeCard';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';
import VirtualScroll from './VirtualScroll';
import { StaggerContainer, StaggerItem, TextReveal, Confetti } from './AdvancedAnimations';

interface Recipe {
  id: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  creator: {
    name: string;
    avatar?: string;
  };
  cookingTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  likes: number;
  views: number;
}

interface OptimizedRecipeFeedProps {
  recipes: Recipe[];
  searchQuery?: string;
  showFilters?: boolean;
  onFilterByCuisine?: (cuisine: string) => void;
  className?: string;
}

const OptimizedRecipeFeed: React.FC<OptimizedRecipeFeedProps> = ({
  recipes,
  searchQuery = '',
  showFilters = false,
  onFilterByCuisine,
  className = ''
}) => {
  const navigate = useNavigate();
  const { hapticMedium } = useHapticFeedback();
  const { metrics, startRenderMeasure, endRenderMeasure } = usePerformanceMonitor();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [columns, setColumns] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Filtered and sorted recipes
  const filteredRecipes = useMemo(() => {
    let filtered = recipes;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        recipe.creator.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by popularity (likes + views)
    return filtered.sort((a, b) => (b.likes + b.views) - (a.likes + a.views));
  }, [recipes, searchQuery]);

  // Paginated recipes for infinite scroll
  const paginatedRecipes = useMemo(() => {
    const itemsPerPage = 20;
    return filteredRecipes.slice(0, currentPage * itemsPerPage);
  }, [filteredRecipes, currentPage]);

  // Handle load more
  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    hapticMedium();

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    setCurrentPage(prev => prev + 1);
    
    // Check if we've loaded all recipes
    if (paginatedRecipes.length >= filteredRecipes.length) {
      setHasMore(false);
    }

    setLoading(false);
  }, [loading, hasMore, paginatedRecipes.length, filteredRecipes.length, hapticMedium]);

  // Handle view mode change
  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
    hapticMedium();
    
    if (mode === 'grid') {
      setColumns(2);
    } else {
      setColumns(1);
    }
    
    // Show confetti for fun!
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, [hapticMedium]);

  // Handle recipe actions
  const handleSave = useCallback((recipeId: string) => {
    hapticMedium();
    // TODO: Implement save functionality
    console.log('Saving recipe:', recipeId);
  }, [hapticMedium]);

  const handleLike = useCallback((recipeId: string) => {
    hapticMedium();
    // TODO: Implement like functionality
    console.log('Liking recipe:', recipeId);
  }, [hapticMedium]);

  const handleShare = useCallback((recipe: Recipe) => {
    hapticMedium();
    // TODO: Implement share functionality
    console.log('Sharing recipe:', recipe.title);
  }, [hapticMedium]);

  const handleView = useCallback((recipe: Recipe) => {
    hapticMedium();
    navigate(`/recipe/${recipe.id}`);
  }, [hapticMedium, navigate]);

  // Render recipe item
  const renderRecipeItem = useCallback((recipe: Recipe, index: number) => (
    <OptimizedRecipeCard
      key={`${recipe.id}-${index}`}
      recipe={recipe}
      onSave={handleSave}
      onLike={handleLike}
      onShare={handleShare}
      onView={handleView}
      className={viewMode === 'list' ? 'w-full' : ''}
    />
  ), [handleSave, handleLike, handleShare, handleView, viewMode]);

  // Cuisine filter options
  const cuisineOptions = [
    'Indian', 'Italian', 'Chinese', 'Mexican', 'Japanese', 'Thai', 'French', 'Mediterranean'
  ];

  // Performance monitoring
  useEffect(() => {
    startRenderMeasure();
    return () => endRenderMeasure();
  }, [startRenderMeasure, endRenderMeasure]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Performance Monitor */}
      {metrics.isLowPerformance && (
        <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            ⚠️ Performance mode enabled - FPS: {metrics.fps}, Memory: {metrics.memoryUsage ? `${Math.round(metrics.memoryUsage / 1024 / 1024)}MB` : 'N/A'}
          </p>
        </div>
      )}

      {/* View Mode Toggle and Filters */}
      <div className="flex items-center justify-between px-4">
        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 rounded-2xl p-1">
          <button
            onClick={() => handleViewModeChange('grid')}
            className={`p-2 rounded-xl transition-all duration-200 ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-700 text-orange-500 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => handleViewModeChange('list')}
            className={`p-2 rounded-xl transition-all duration-200 ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-700 text-orange-500 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <List size={20} />
          </button>
        </div>

        {/* Results Count */}
        <div className="text-sm text-slate-600 dark:text-slate-400">
          {filteredRecipes.length} recipes found
        </div>
      </div>

      {/* Cuisine Filters */}
      {showFilters && (
        <div className="px-4">
          <div className="flex items-center space-x-3 mb-4">
            <Filter size={20} className="text-slate-600 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter by Cuisine:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {cuisineOptions.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => {
                  onFilterByCuisine?.(cuisine);
                  hapticMedium();
                }}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-orange-100 dark:hover:bg-orange-900/20 hover:text-orange-700 dark:hover:text-orange-400 transition-all duration-200"
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recipe Grid/List */}
      {paginatedRecipes.length > 0 ? (
        viewMode === 'list' ? (
          <VirtualScroll
            items={paginatedRecipes}
            itemHeight={400}
            containerHeight={600}
            renderItem={renderRecipeItem}
            className="px-4"
          />
        ) : (
          <StaggerContainer className="px-4">
            <MasonryGrid
              items={paginatedRecipes}
              renderItem={(recipe, index) => (
                <StaggerItem key={recipe.id}>
                  {renderRecipeItem(recipe, index)}
                </StaggerItem>
              )}
              columns={columns}
              gap={16}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              loading={loading}
            />
          </StaggerContainer>
        )
      ) : (
        <div className="px-4 py-20 text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <Search size={32} className="text-slate-400" />
          </div>
          <TextReveal
            text="No recipes found"
            className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2"
          />
          <TextReveal
            text={searchQuery ? `No recipes match "${searchQuery}"` : 'Try adjusting your search or filters'}
            className="text-slate-500 dark:text-slate-400"
          />
        </div>
      )}

      {/* Confetti Animation */}
      <Confetti isVisible={showConfetti} />
    </div>
  );
};

export default OptimizedRecipeFeed;
