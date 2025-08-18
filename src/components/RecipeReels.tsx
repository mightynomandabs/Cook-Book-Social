import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Clock, ChefHat, Plus } from 'lucide-react';
import { simpleRecipes, SimpleRecipe } from '../data/simpleRecipes';

interface RecipeReelsProps {
  onCreateClick: () => void;
}

const RecipeReels: React.FC<RecipeReelsProps> = ({ onCreateClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentRecipe = simpleRecipes[currentIndex];

  // Handle wheel scroll for recipe navigation
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0 && currentIndex < simpleRecipes.length - 1) {
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

      // Detect horizontal swipe
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
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

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        setShowDetails(false);
      } else if (e.key === 'ArrowDown' && currentIndex < simpleRecipes.length - 1) {
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
    if (currentIndex < simpleRecipes.length - 1) {
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
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">🍳</span>
          </div>
          <span className="text-white font-bold text-lg">CookBook</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-white text-sm">
            {currentIndex + 1} / {simpleRecipes.length}
          </span>
          <button 
            onClick={onCreateClick}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div 
        ref={containerRef}
        className="h-full flex items-center justify-center relative"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
      >
        {/* Recipe Reel */}
        <div className="relative w-full h-full max-w-md">
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

          {/* Swipe Hint */}
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white/60 text-center">
            <div className="w-8 h-8 border-2 border-white/30 rounded-full flex items-center justify-center mb-2">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <span className="text-xs">Swipe left</span>
          </div>
        </div>

        {/* Details Panel (Left Swipe) */}
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
                  <Clock className="w-4 h-4" />
                  <span>{currentRecipe.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ChefHat className="w-4 h-4" />
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
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {simpleRecipes.map((_, index) => (
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

      {/* Navigation Buttons */}
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
          disabled={currentIndex === simpleRecipes.length - 1}
          className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center disabled:opacity-50"
        >
          <ChevronDown className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default RecipeReels;
