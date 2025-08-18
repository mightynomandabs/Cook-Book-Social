import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Clock, ChefHat, Plus, Search, Filter, Heart, Bookmark, Share2 } from 'lucide-react';
import { simpleRecipes, SimpleRecipe } from '../data/simpleRecipes';

interface RecipeReelsProps {
  onCreateClick: () => void;
}

const RecipeReels: React.FC<RecipeReelsProps> = ({ onCreateClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [likedRecipes, setLikedRecipes] = useState<Set<string>>(new Set());
  const [savedRecipes, setSavedRecipes] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter recipes based on search and difficulty
  const filteredRecipes = simpleRecipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const currentRecipe = filteredRecipes[currentIndex] || filteredRecipes[0];

  // Reset index when filters change
  useEffect(() => {
    setCurrentIndex(0);
    setShowDetails(false);
  }, [searchQuery, selectedDifficulty]);

  const handleLike = (recipeId: string) => {
    setLikedRecipes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recipeId)) {
        newSet.delete(recipeId);
      } else {
        newSet.add(recipeId);
      }
      return newSet;
    });
  };

  const handleSave = (recipeId: string) => {
    setSavedRecipes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recipeId)) {
        newSet.delete(recipeId);
      } else {
        newSet.add(recipeId);
      }
      return newSet;
    });
  };

  const handleShare = async (recipe: SimpleRecipe) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: `Check out this amazing ${recipe.title} recipe by ${recipe.creator}!`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`Check out this amazing ${recipe.title} recipe by ${recipe.creator}!`);
      alert('Recipe link copied to clipboard! 📋');
    }
  };

  // Handle wheel scroll for recipe navigation
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0 && currentIndex < filteredRecipes.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowDetails(false);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowDetails(false);
    }
  };

  // Handle touch/swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      // Detect horizontal swipe with better threshold
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
        if (deltaX > 0) {
          // Swipe right - show details
          setSwipeDirection('right');
          setShowDetails(true);
        } else {
          // Swipe left - hide details
          setSwipeDirection('left');
          setShowDetails(false);
        }
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      setTimeout(() => setSwipeDirection(null), 300);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  // Add click handler for better mobile experience
  const handleRecipeClick = () => {
    setShowDetails(!showDetails);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        setShowDetails(false);
      } else if (e.key === 'ArrowDown' && currentIndex < filteredRecipes.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setShowDetails(false);
      } else if (e.key === 'ArrowLeft') {
        setShowDetails(true);
      } else if (e.key === 'ArrowRight') {
        setShowDetails(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex]);

  const nextRecipe = () => {
    if (currentIndex < filteredRecipes.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowDetails(false);
    }
  };

  const prevRecipe = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowDetails(false);
    }
  };

  return (
    <div className="h-screen bg-black overflow-hidden relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">🍳</span>
            </div>
            <span className="text-white font-bold text-lg">CookBook</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Search className="w-4 h-4 text-white" />
            </button>
            <button 
              onClick={onCreateClick}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search recipes, ingredients, or creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-white/90 backdrop-blur-sm rounded-2xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
            
            {/* Difficulty Filter */}
            <div className="flex items-center space-x-2 mt-3">
              <span className="text-white/80 text-sm">Difficulty:</span>
              {['all', 'Easy', 'Medium', 'Hard'].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedDifficulty === difficulty
                      ? 'bg-orange-500 text-white'
                      : 'bg-white/20 text-white/80 hover:bg-white/30'
                  }`}
                >
                  {difficulty === 'all' ? 'All' : difficulty}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recipe Counter */}
        <div className="flex items-center justify-between">
          <span className="text-white/80 text-sm">
            {filteredRecipes.length > 0 ? `${currentIndex + 1} / ${filteredRecipes.length}` : 'No recipes found'}
          </span>
          
          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            {filteredRecipes.length > 0 && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="px-3 py-1 bg-white/20 text-white text-xs rounded-full hover:bg-white/30 transition-colors"
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        ref={containerRef}
        className="h-full flex items-center justify-center relative"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
      >
        {/* Empty State */}
        {filteredRecipes.length === 0 && (
          <div className="text-center text-white">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔍</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">No recipes found</h2>
            <p className="text-white/70 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDifficulty('all');
              }}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Recipe Reel */}
        {filteredRecipes.length > 0 && (
          <div 
            className="relative w-full h-full max-w-md cursor-pointer"
            onClick={handleRecipeClick}
          >
            {/* Recipe Image */}
            <div className="absolute inset-0">
              <img 
                src={currentRecipe.image} 
                alt={currentRecipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Recipe Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">
                    {currentRecipe.creator.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <span className="font-semibold">{currentRecipe.creator}</span>
              </div>
              
              <h2 className="text-2xl font-bold mb-3">{currentRecipe.title}</h2>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{currentRecipe.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ChefHat className="w-4 h-4" />
                  <span>{currentRecipe.difficulty}</span>
                </div>
              </div>
            </div>

            {/* Social Action Buttons */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(currentRecipe.id);
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  likedRecipes.has(currentRecipe.id)
                    ? 'bg-red-500 text-white scale-110'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart className={`w-6 h-6 ${likedRecipes.has(currentRecipe.id) ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave(currentRecipe.id);
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  savedRecipes.has(currentRecipe.id)
                    ? 'bg-orange-500 text-white scale-110'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Bookmark className={`w-6 h-6 ${savedRecipes.has(currentRecipe.id) ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare(currentRecipe);
                }}
                className="w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
              >
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Swipe Hint */}
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white/60 text-center">
              <div className="w-8 h-8 border-2 border-white/30 rounded-full flex items-center justify-center mb-2">
                <ChevronRight className="w-4 h-4" />
              </div>
              <span className="text-xs">Swipe right</span>
            </div>
          </div>
        )}

        {/* Details Panel (Left Swipe) */}
        {filteredRecipes.length > 0 && (
          <div 
            className={`absolute inset-0 bg-white transform transition-transform duration-300 ease-out ${
              showDetails ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="h-full overflow-y-auto p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={() => setShowDetails(false)}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-500">Recipe Details</span>
              </div>

              {/* Recipe Image */}
              <div className="w-full h-48 rounded-2xl overflow-hidden mb-6">
                <img 
                  src={currentRecipe.image} 
                  alt={currentRecipe.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Recipe Info */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">{currentRecipe.title}</h1>
                <p className="text-gray-600 mb-4">by {currentRecipe.creator}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-5 h-5" />
                    <span>{currentRecipe.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ChefHat className="w-5 h-5" />
                    <span>{currentRecipe.difficulty}</span>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
                <ul className="space-y-2">
                  {currentRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Method */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Method</h3>
                <ol className="space-y-3">
                  {currentRecipe.method.map((step, index) => (
                    <li key={index} className="flex space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Dots */}
      {filteredRecipes.length > 0 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {filteredRecipes.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setShowDetails(false);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      )}

      {/* Navigation Buttons */}
      {filteredRecipes.length > 0 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button
            onClick={prevRecipe}
            disabled={currentIndex === 0}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center disabled:opacity-50"
          >
            <ChevronUp className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextRecipe}
            disabled={currentIndex === filteredRecipes.length - 1}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center disabled:opacity-50"
          >
            <ChevronDown className="w-6 h-6 text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeReels;
