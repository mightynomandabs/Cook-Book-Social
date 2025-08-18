import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronUp, ChevronDown, ChefHat, Plus, Search, Star, Play, ArrowUpRight, Flame, CircleDot, Utensils, Circle } from 'lucide-react';
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

  const [achievements, setAchievements] = useState<string[]>([]);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
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





  // Achievement system
  const checkAchievements = (recipe: SimpleRecipe) => {
    const newAchievements: string[] = [];
    
    if (achievements.length === 0) {
      newAchievements.push('First Steps');
    }
    
    const cuisineCount = new Set(simpleRecipes.map(r => r.category)).size;
    if (cuisineCount >= 3 && !achievements.includes('World Explorer')) {
      newAchievements.push('World Explorer');
    }
    
    if (recipe.difficulty === 'Hard' && !achievements.includes('Master Chef')) {
      newAchievements.push('Master Chef');
    }
    
    const viewedCount = achievements.length + 1;
    if (viewedCount >= 5 && !achievements.includes('Recipe Hunter')) {
      newAchievements.push('Recipe Hunter');
    }
    
    newAchievements.forEach(achievement => {
      if (!achievements.includes(achievement)) {
        setShowAchievement(achievement);
        setTimeout(() => setShowAchievement(null), 3000);
      }
    });
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
    }
  };

  useEffect(() => {
    if (currentRecipe) {
      checkAchievements(currentRecipe);
    }
  }, [currentRecipe]);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
        if (deltaX > 0) {
          setShowDetails(true);
        } else {
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
    <div className="h-screen bg-appetit-primary overflow-hidden relative">
      {/* Achievement Toast */}
      {showAchievement && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 appetit-gradient text-white px-6 py-3 rounded-full shadow-lg animate-bounce">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🏆</span>
            <span className="font-bold">Achievement Unlocked: {showAchievement}</span>
          </div>
        </div>
      )}

             {/* Header */}
       <div className="absolute top-0 left-0 right-0 z-20 p-4 appetit-status-bar">
         {/* Top Row */}
         <div className="flex items-center justify-between mb-4">
           <div className="flex items-center space-x-3">
             <div className="w-8 h-8 appetit-avatar rounded-full flex items-center justify-center">
               <span className="appetit-text-white font-bold text-sm">S</span>
             </div>
             <span className="appetit-text-primary font-bold text-lg">Santiago &gt;</span>
           </div>
           
           <div className="flex items-center space-x-3">
             <button 
               onClick={() => setShowSearch(!showSearch)}
               className="w-8 h-8 appetit-glass-effect rounded-full flex items-center justify-center hover:appetit-glass-effect-hover transition-all"
             >
               <Search className="w-4 h-4 appetit-text-primary" />
             </button>
             <button 
               onClick={() => onCreateClick()}
               className="w-8 h-8 appetit-glass-effect rounded-full flex items-center justify-center hover:appetit-glass-effect-hover transition-all"
             >
               <Plus className="w-4 h-4 appetit-text-primary" />
             </button>
             <div className="relative">
               <button className="w-8 h-8 appetit-purple rounded-full flex items-center justify-center text-white font-bold text-sm">
                 458
               </button>
               <div className="absolute -top-1 -right-1 w-3 h-3 appetit-orange rounded-full"></div>
             </div>
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
                 className="w-full px-4 py-3 pl-12 appetit-input text-base"
               />
               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 appetit-text-tertiary" />
             </div>
             
             {/* Difficulty Filter */}
             <div className="flex flex-wrap items-center gap-2 mt-3">
               <span className="appetit-text-secondary text-sm">Difficulty:</span>
               {['all', 'Easy', 'Medium', 'Hard'].map((difficulty) => (
                 <button
                   key={difficulty}
                   onClick={() => setSelectedDifficulty(difficulty)}
                   className={`appetit-category-pill ${
                     selectedDifficulty === difficulty ? 'active' : ''
                   }`}
                 >
                   {difficulty === 'all' ? 'All' : difficulty}
                 </button>
               ))}
             </div>
           </div>
         )}
      </div>

      {/* Main Content */}
      <div 
        ref={containerRef}
        className="h-full flex items-center justify-center relative pt-20"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
      >
                 {/* Empty State */}
         {filteredRecipes.length === 0 && (
           <div className="text-center appetit-text-primary">
             <div className="w-24 h-24 appetit-card rounded-full flex items-center justify-center mx-auto mb-6">
               <span className="text-4xl">🔍</span>
             </div>
             <h2 className="text-2xl font-bold mb-2">No recipes found</h2>
             <p className="appetit-text-secondary mb-6">Try adjusting your search or filters</p>
             <button
               onClick={() => {
                 setSearchQuery('');
                 setSelectedDifficulty('all');
               }}
               className="appetit-button-primary"
             >
               Clear Filters
             </button>
           </div>
         )}

                 {/* Recipe Discovery Interface */}
         {filteredRecipes.length > 0 && !showDetails && (
           <div className="w-full max-w-md px-4">
             {/* Recipe of the Day */}
             <div className="text-center mb-6">
               <h2 className="appetit-text-secondary text-sm font-medium mb-2">RECIPE OF THE DAY</h2>
               <div className="relative">
                 <div className="w-full h-64 rounded-2xl overflow-hidden mb-4 appetit-recipe-card">
                   <img 
                     src={currentRecipe.image} 
                     alt={currentRecipe.title}
                     className="w-full h-full object-cover"
                   />
                   <div className="absolute top-3 right-3 appetit-glass-effect rounded-full px-3 py-1">
                     <span className="appetit-text-primary text-sm font-bold">+75</span>
                   </div>
                 </div>
                 
                 <div className="text-left">
                   <h3 className="text-xl font-bold appetit-text-primary mb-2">{currentRecipe.title}</h3>
                   <div className="flex items-center space-x-2 mb-3">
                     <div className="flex space-x-1">
                       {[1, 2, 3, 4, 5].map((star) => (
                         <Star key={star} className="w-4 h-4 appetit-star-rating fill-current" />
                       ))}
                     </div>
                     <span className="appetit-text-secondary text-sm">4.6</span>
                   </div>
                 </div>
               </div>
             </div>

                         {/* Random Recipe Card */}
             <div className="appetit-card rounded-2xl p-4 mb-6">
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 appetit-purple-light rounded-full flex items-center justify-center">
                     <span className="text-xl">🎲</span>
                   </div>
                   <div>
                     <h4 className="appetit-text-primary font-semibold">Random recipe</h4>
                     <p className="appetit-text-secondary text-sm">Don't know what to cook?</p>
                   </div>
                 </div>
                 <button className="w-10 h-10 appetit-gradient rounded-full flex items-center justify-center">
                   <ArrowUpRight className="w-5 h-5 text-white" />
                 </button>
               </div>
             </div>

                         {/* Recipe Thumbnails */}
             <div className="grid grid-cols-2 gap-3">
               {filteredRecipes.slice(0, 4).map((recipe, index) => (
                 <div key={recipe.id} className="appetit-recipe-card rounded-xl overflow-hidden">
                   <div className="w-full h-20">
                     <img 
                       src={recipe.image} 
                       alt={recipe.title}
                       className="w-full h-full object-cover"
                     />
                   </div>
                   <div className="p-2">
                     <h5 className="appetit-text-primary text-sm font-medium line-clamp-1">{recipe.title}</h5>
                     <p className="appetit-text-secondary text-xs">{recipe.creator}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

                 {/* Recipe Details Panel */}
         {filteredRecipes.length > 0 && showDetails && (
           <div className="absolute inset-0 bg-appetit-secondary transform transition-transform duration-300 ease-out translate-x-0">
             <div className="h-full overflow-y-auto p-4">
               {/* Header */}
               <div className="flex items-center justify-between mb-6">
                 <button 
                   onClick={() => setShowDetails(false)}
                   className="w-10 h-10 appetit-glass-effect rounded-full flex items-center justify-center hover:appetit-glass-effect-hover transition-all"
                 >
                   <ChevronRight className="w-5 h-5 appetit-text-primary" />
                 </button>
                 <span className="text-sm appetit-text-secondary">Recipe Details</span>
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
                 <div className="flex items-center space-x-2 mb-2">
                   <span className="appetit-text-secondary text-sm">BY {currentRecipe.creator.toUpperCase()}</span>
                   <div className="appetit-purple-light rounded-full px-2 py-1">
                     <span className="appetit-text-primary text-xs font-bold">+75</span>
                   </div>
                 </div>
                 
                 <h1 className="text-2xl font-bold appetit-text-primary mb-3">{currentRecipe.title}</h1>
                 
                 <div className="flex items-center space-x-4 text-sm appetit-text-secondary mb-4">
                   <div className="flex items-center space-x-1">
                     <Star className="w-4 h-4 appetit-star-rating fill-current" />
                     <Star className="w-4 h-4 appetit-star-rating fill-current" />
                     <Star className="w-4 h-4 appetit-star-rating fill-current" />
                     <Star className="w-4 h-4 appetit-star-rating fill-current" />
                   </div>
                   <span>{currentRecipe.time}</span>
                   <span>{currentRecipe.difficulty}</span>
                 </div>

                                 {/* AI Sous Chef Banner */}
                 <div className="appetit-gradient rounded-2xl p-4 mb-6">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                         <ChefHat className="w-5 h-5 text-white" />
                       </div>
                       <div>
                         <h4 className="text-white font-semibold">Start cooking!</h4>
                         <p className="text-white/90 text-sm">Our AI sous chef will help you.</p>
                       </div>
                     </div>
                     <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                       <Play className="w-6 h-6 text-white" />
                     </button>
                   </div>
                 </div>

                                 {/* Navigation Tabs */}
                 <div className="flex space-x-1 mb-6">
                   {['Overview', 'Ingredients 15', 'Directions'].map((tab, index) => (
                     <button
                       key={tab}
                       className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                         index === 1 
                           ? 'appetit-gradient text-white' 
                           : 'appetit-text-secondary hover:appetit-text-primary'
                       }`}
                     >
                       {tab}
                     </button>
                   ))}
                 </div>

                                 {/* Nutritional Value */}
                 <div className="appetit-card rounded-2xl p-4 mb-6">
                   <h4 className="appetit-text-primary font-semibold mb-3">The nutritional value</h4>
                   <div className="grid grid-cols-2 gap-3">
                     <div className="flex items-center">
                       <div className="appetit-nutrition-icon appetit-nutrition-calories">
                         <Flame className="w-3 h-3 text-white" />
                       </div>
                       <span className="appetit-text-primary text-sm">176 kcal</span>
                     </div>
                     <div className="flex items-center">
                       <div className="appetit-nutrition-icon appetit-nutrition-fat">
                         <CircleDot className="w-3 h-3 text-white" />
                       </div>
                       <span className="appetit-text-primary text-sm">4g fat</span>
                     </div>
                     <div className="flex items-center">
                       <div className="appetit-nutrition-icon appetit-nutrition-carbs">
                         <Utensils className="w-3 h-3 text-white" />
                       </div>
                       <span className="appetit-text-primary text-sm">19g carbo</span>
                     </div>
                     <div className="flex items-center">
                       <div className="appetit-nutrition-icon appetit-nutrition-protein">
                         <Circle className="w-3 h-3 text-white" />
                       </div>
                       <span className="appetit-text-primary text-sm">17g prot</span>
                     </div>
                   </div>
                 </div>

                                 {/* Servings */}
                 <div className="appetit-card rounded-2xl p-4 mb-6">
                   <h4 className="appetit-text-primary font-semibold mb-2">Servings</h4>
                   <span className="appetit-text-primary text-2xl font-bold">8</span>
                 </div>

                 {/* Ingredients */}
                 <div className="appetit-card rounded-2xl p-4">
                   <h4 className="appetit-text-primary font-semibold mb-3">Ingredients</h4>
                   <div className="space-y-3">
                     {currentRecipe.ingredients.slice(0, 5).map((ingredient, index) => (
                       <div key={index} className="flex items-center space-x-3">
                         <div className={`w-5 h-5 rounded-full border-2 ${
                           index === 4 ? 'border-green-500 bg-green-500' : 'border-appetit-purple'
                         } flex items-center justify-center`}>
                           {index === 4 && <div className="w-2 h-2 bg-white rounded-full"></div>}
                         </div>
                         <span className="appetit-text-primary text-sm">{ingredient}</span>
                       </div>
                     ))}
                   </div>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

             {/* Navigation Dots */}
       {filteredRecipes.length > 0 && (
         <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 appetit-dots">
           {filteredRecipes.map((_, index) => (
             <button
               key={index}
               onClick={() => {
                 setCurrentIndex(index);
                 setShowDetails(false);
               }}
               className={`appetit-dot ${
                 index === currentIndex ? 'active' : ''
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
             className="w-12 h-12 appetit-glass-effect rounded-full flex items-center justify-center disabled:opacity-50 hover:appetit-glass-effect-hover transition-all"
           >
             <ChevronUp className="w-6 h-6 appetit-text-primary" />
           </button>
           <button
             onClick={nextRecipe}
             disabled={currentIndex === filteredRecipes.length - 1}
             className="w-12 h-12 appetit-glass-effect rounded-full flex items-center justify-center disabled:opacity-50 hover:appetit-glass-effect-hover transition-all"
           >
             <ChevronDown className="w-6 h-6 appetit-text-primary" />
           </button>
         </div>
       )}
    </div>
  );
};

export default RecipeReels;
