import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronUp, ChevronDown, Clock, ChefHat, Plus, Search, Heart, Bookmark, Share2, ShoppingCart, Timer } from 'lucide-react';
import { simpleRecipes, SimpleRecipe } from '../data/simpleRecipes';

interface RecipeReelsProps {
  onCreateClick: () => void;
}

const RecipeReels: React.FC<RecipeReelsProps> = ({ onCreateClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [likedRecipes, setLikedRecipes] = useState<Set<string>>(new Set());
  const [savedRecipes, setSavedRecipes] = useState<Set<string>>(new Set());
  const [showTimer, setShowTimer] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // in seconds
  const [achievements, setAchievements] = useState<string[]>([]);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Timer functions
  const startTimer = () => {
    setIsTimerRunning(true);
    setTimeLeft(timerMinutes * 60);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Timer finished
          setIsTimerRunning(false);
          if (timerRef.current) clearInterval(timerRef.current);
          
          // Play notification sound or show alert
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Timer Complete!', {
              body: `Your ${timerMinutes} minute timer is done!`,
              icon: '🍳'
            });
          } else {
            alert(`⏰ Timer Complete! Your ${timerMinutes} minute timer is done!`);
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetTimer = () => {
    stopTimer();
    setTimeLeft(timerMinutes * 60);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Achievement system
  const checkAchievements = (recipe: SimpleRecipe) => {
    const newAchievements: string[] = [];
    
    // First recipe viewed
    if (achievements.length === 0) {
      newAchievements.push('First Steps');
    }
    
    // Different cuisines explored
    const cuisineCount = new Set(simpleRecipes.map(r => r.category)).size;
    if (cuisineCount >= 3 && !achievements.includes('World Explorer')) {
      newAchievements.push('World Explorer');
    }
    
    // Difficulty progression
    if (recipe.difficulty === 'Hard' && !achievements.includes('Master Chef')) {
      newAchievements.push('Master Chef');
    }
    
    // Recipe count milestones
    const viewedCount = achievements.length + 1;
    if (viewedCount >= 5 && !achievements.includes('Recipe Hunter')) {
      newAchievements.push('Recipe Hunter');
    }
    
    // Check for new achievements
    newAchievements.forEach(achievement => {
      if (!achievements.includes(achievement)) {
        setShowAchievement(achievement);
        setTimeout(() => setShowAchievement(null), 3000);
      }
    });
    
    // Update achievements - simple array concatenation
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
    }
  };

  // Check achievements when recipe changes
  useEffect(() => {
    if (currentRecipe) {
      checkAchievements(currentRecipe);
    }
  }, [currentRecipe]);

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
           setShowDetails(true);
         } else {
           // Swipe left - hide details
           setShowDetails(false);
         }
       }
    };

         const handleTouchEnd = () => {
       document.removeEventListener('touchmove', handleTouchMove);
       document.removeEventListener('touchend', handleTouchEnd);
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
      {/* Achievement Toast */}
      {showAchievement && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg animate-bounce">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🏆</span>
            <span className="font-bold">Achievement Unlocked: {showAchievement}</span>
          </div>
        </div>
      )}
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

        {/* Trending & Collections */}
        {filteredRecipes.length > 0 && !showDetails && (
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white/80">
            {/* Trending Badge */}
            <div className="mb-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                <span className="text-white text-lg">🔥</span>
              </div>
              <span className="text-xs font-medium">Trending</span>
            </div>
            
            {/* Quick Collections */}
            <div className="space-y-3">
              {['Quick & Easy', 'Chef Specials', 'Healthy Options'].map((collection, index) => (
                <button
                  key={collection}
                  onClick={() => {
                    // Filter by collection type
                    if (collection === 'Quick & Easy') {
                      setSelectedDifficulty('Easy');
                    } else if (collection === 'Chef Specials') {
                      setSelectedDifficulty('Hard');
                                         } else if (collection === 'Healthy Options') {
                       // Filter by healthy ingredients - placeholder for future implementation
                       // This would need more sophisticated filtering in a real app
                     }
                  }}
                  className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm"
                  title={collection}
                >
                  <span className="text-white text-lg">
                    {collection === 'Quick & Easy' ? '⚡' : 
                     collection === 'Chef Specials' ? '👨‍🍳' : '🥗'}
                  </span>
                </button>
              ))}
            </div>
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

                 {/* Cooking Timer */}
                 <div className="mt-4 p-4 bg-orange-50 rounded-xl">
                   <div className="flex items-center justify-between mb-3">
                     <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
                       <Timer className="w-5 h-5 text-orange-500" />
                       <span>Cooking Timer</span>
                     </h4>
                     <button
                       onClick={() => setShowTimer(!showTimer)}
                       className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                     >
                       {showTimer ? 'Hide' : 'Show'}
                     </button>
                   </div>
                   
                   {showTimer && (
                     <div className="space-y-3">
                       <div className="flex items-center space-x-3">
                         <input
                           type="range"
                           min="1"
                           max="60"
                           value={timerMinutes}
                           onChange={(e) => setTimerMinutes(Number(e.target.value))}
                           className="flex-1"
                           disabled={isTimerRunning}
                         />
                         <span className="text-lg font-bold text-gray-800 min-w-[3rem]">
                           {timerMinutes}m
                         </span>
                       </div>
                       
                       {isTimerRunning && (
                         <div className="text-center">
                           <div className="text-2xl font-bold text-orange-500">
                             {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                           </div>
                         </div>
                       )}
                       
                       <div className="flex space-x-2">
                         {!isTimerRunning ? (
                           <button
                             onClick={startTimer}
                             className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                           >
                             Start Timer
                           </button>
                         ) : (
                           <>
                             <button
                               onClick={stopTimer}
                               className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
                             >
                               Pause
                             </button>
                             <button
                               onClick={resetTimer}
                               className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                             >
                               Reset
                             </button>
                           </>
                         )}
                       </div>
                     </div>
                   )}
                 </div>
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Ingredients</h3>
                  
                  {/* Quick Order All Button */}
                  <button
                    onClick={() => {
                      const allIngredients = currentRecipe.ingredients.join(', ');
                      const searchQuery = encodeURIComponent(allIngredients);
                      // Open Blinkit by default for bulk order
                      window.open(`https://blinkit.com/search?q=${searchQuery}`, '_blank');
                    }}
                    className="px-3 py-1 bg-orange-500 text-white text-xs rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-1"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    <span>Quick Order All</span>
                  </button>
                </div>
                
                {/* Info Text */}
                <p className="text-sm text-gray-500 mb-3">
                  Click on any delivery service below to order ingredients directly
                </p>
                
                <ul className="space-y-4">
                  {currentRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-gray-700 font-medium">{ingredient}</span>
                      </div>
                      
                      {/* Delivery Service Options */}
                      <div className="ml-5 flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Get on:</span>
                        
                        {/* Blinkit */}
                        <button
                          onClick={() => {
                            const searchQuery = encodeURIComponent(ingredient);
                            window.open(`https://blinkit.com/search?q=${searchQuery}`, '_blank');
                          }}
                          className="px-2 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-colors flex items-center space-x-1"
                          title="Order from Blinkit (10 min delivery)"
                        >
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                          <span>Blinkit</span>
                        </button>
                        
                        {/* Instamart */}
                        <button
                          onClick={() => {
                            const searchQuery = encodeURIComponent(ingredient);
                            window.open(`https://www.zepto.in/search?q=${searchQuery}`, '_blank');
                          }}
                          className="px-2 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-1"
                          title="Order from Instamart (15 min delivery)"
                        >
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                          <span>Instamart</span>
                        </button>
                        
                        {/* Zepto */}
                        <button
                          onClick={() => {
                            const searchQuery = encodeURIComponent(ingredient);
                            window.open(`https://www.zepto.in/search?q=${searchQuery}`, '_blank');
                          }}
                          className="px-2 py-1 bg-purple-500 text-white text-xs rounded-md hover:bg-purple-600 transition-colors flex items-center space-x-1"
                          title="Order from Zepto (10 min delivery)"
                        >
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                          <span>Zepto</span>
                        </button>
                      </div>
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

              {/* Recipe Recommendations */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">You Might Also Like</h3>
                <div className="grid grid-cols-2 gap-3">
                  {simpleRecipes
                    .filter(recipe => 
                      recipe.id !== currentRecipe.id && 
                      (recipe.category === currentRecipe.category || 
                       recipe.difficulty === currentRecipe.difficulty ||
                       recipe.ingredients.some(ing => 
                         currentRecipe.ingredients.some(currIng => 
                           currIng.toLowerCase().includes(ing.toLowerCase().split(' ')[0]) ||
                           ing.toLowerCase().includes(currIng.toLowerCase().split(' ')[0])
                         )
                       ))
                    )
                    .slice(0, 4)
                    .map((recipe) => (
                      <button
                        key={recipe.id}
                        onClick={() => {
                          const recipeIndex = simpleRecipes.findIndex(r => r.id === recipe.id);
                          if (recipeIndex !== -1) {
                            setCurrentIndex(recipeIndex);
                            setShowDetails(false);
                          }
                        }}
                        className="text-left bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors group"
                      >
                        <div className="w-full h-20 rounded-lg overflow-hidden mb-2">
                          <img 
                            src={recipe.image} 
                            alt={recipe.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-1">{recipe.title}</h4>
                        <p className="text-xs text-gray-500">{recipe.creator}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">{recipe.time}</span>
                          <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full">{recipe.difficulty}</span>
                        </div>
                      </button>
                    ))}
                </div>
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
