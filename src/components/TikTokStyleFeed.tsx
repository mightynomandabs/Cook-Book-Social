import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Home, Search, Plus, Heart, User } from 'lucide-react';
import { RecipeReel } from './RecipeReel';
import { Recipe } from '../types';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

// Local interface for RecipeReel component
interface RecipeReelRecipe {
  id: string;
  title: string;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  video: string;
  thumbnail: string;
  duration: number;
  likes: number;
  saves: number;
  comments: number;
  shares: number;
  ingredients: string[];
  steps: string[];
  tags: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeToCook: string;
  cuisine: string;
}

interface TikTokStyleFeedProps {
  recipes: Recipe[];
  onLike?: (recipeId: string) => void;
  onSave?: (recipeId: string) => void;
  onShare?: (recipe: Recipe) => void;
  onComment?: (recipeId: string) => void;
}

const TikTokStyleFeed: React.FC<TikTokStyleFeedProps> = ({
  recipes,
  onLike,
  onSave,
  onShare,
  onComment
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { hapticMedium } = useHapticFeedback();

  // Map shared Recipe to RecipeReel format
  const mapToRecipeReelFormat = (recipe: Recipe): RecipeReelRecipe => ({
    id: recipe.id,
    title: recipe.title,
    creator: {
      name: recipe.creator.name,
      avatar: recipe.creator.avatar,
      verified: false // Default value since shared type doesn't have this
    },
    video: recipe.video || '',
    thumbnail: recipe.image,
    duration: 0, // Default value since shared type doesn't have this
    likes: recipe.likes,
    saves: recipe.saves,
    comments: recipe.comments,
    shares: 0, // Default value since shared type doesn't have this
    ingredients: recipe.ingredients.map(ing => ing.name),
    steps: recipe.method.map(step => step.description),
    tags: recipe.tags,
    difficulty: recipe.difficulty,
    timeToCook: `${recipe.cookTime} min`,
    cuisine: recipe.cuisine
  });

  // Handle next recipe
  const handleNext = useCallback(() => {
    if (currentIndex < recipes.length - 1) {
      setCurrentIndex(prev => prev + 1);
      hapticMedium();
    }
  }, [currentIndex, recipes.length, hapticMedium]);

  // Handle previous recipe
  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      hapticMedium();
    }
  }, [currentIndex, hapticMedium]);

  // Handle wheel scroll
  const handleWheel = useCallback((e: WheelEvent) => {
    if (isScrolling) return;
    
    setIsScrolling(true);
    
    if (e.deltaY > 0) {
      handleNext();
    } else {
      handlePrevious();
    }
    
    // Debounce scrolling
    setTimeout(() => setIsScrolling(false), 500);
  }, [isScrolling, handleNext, handlePrevious]);

  // Handle touch gestures
  const handleTouchStart = useRef<{ y: number } | null>(null);
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!handleTouchStart.current) return;
    
    const touch = e.touches[0];
    const deltaY = handleTouchStart.current.y - touch.clientY;
    
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
      handleTouchStart.current = null;
    }
  }, [handleNext, handlePrevious]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        handlePrevious();
        break;
      case 'ArrowDown':
        e.preventDefault();
        handleNext();
        break;
      case ' ':
        e.preventDefault();
        handleNext();
        break;
    }
  }, [handleNext, handlePrevious]);

  // Add event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', (e) => {
      handleTouchStart.current = { y: e.touches[0].clientY };
    });
    container.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', (e) => {
        handleTouchStart.current = { y: e.touches[0].clientY };
      });
      container.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel, handleTouchMove, handleKeyDown]);

  // Auto-advance for demo purposes (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      if (recipes.length > 1) {
        setCurrentIndex(prev => (prev + 1) % recipes.length);
      }
    }, 30000); // 30 seconds per recipe

    return () => clearInterval(interval);
  }, [recipes.length]);

  if (!recipes.length) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-4xl">🍳</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">No recipes available</h2>
          <p className="text-gray-400">Check back later for delicious recipes!</p>
        </div>
      </div>
    );
  }

  const currentRecipe = recipes[currentIndex];

  return (
    <div className="relative h-screen bg-black overflow-hidden" ref={containerRef}>
      {/* Current Recipe Reel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRecipe.id}
          className="absolute inset-0"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <RecipeReel
            recipes={recipes.map(mapToRecipeReelFormat)}
            onLike={onLike}
            onSave={onSave}
            onShare={(recipeId) => {
              const recipe = recipes.find(r => r.id === recipeId);
              if (recipe) onShare?.(recipe);
            }}
            onComment={onComment}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20">
        <div className="flex flex-col space-y-2">
          {recipes.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="h-1 bg-white/20">
          <motion.div
            className="h-full bg-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / recipes.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20">
        <div className="flex flex-col space-y-4">
          <motion.button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              currentIndex === 0 
                ? 'bg-white/20 text-white/50' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronUp size={24} />
          </motion.button>
          
          <motion.button
            onClick={handleNext}
            disabled={currentIndex === recipes.length - 1}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              currentIndex === recipes.length - 1 
                ? 'bg-white/20 text-white/50' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronDown size={24} />
          </motion.button>
        </div>
      </div>

      {/* Recipe Counter */}
      <div className="absolute top-6 left-6 z-20">
        <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
          <span className="text-sm font-medium">
            {currentIndex + 1} / {recipes.length}
          </span>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent z-20">
        <div className="flex items-center justify-around px-6 py-4">
          <button className="flex flex-col items-center space-y-1 text-white">
            <Home size={24} className="text-orange-500" />
            <span className="text-xs">Home</span>
          </button>
          
          <button className="flex flex-col items-center space-y-1 text-white/70">
            <Search size={24} />
            <span className="text-xs">Search</span>
          </button>
          
          <button className="flex flex-col items-center space-y-1 text-white/70">
            <Plus size={24} />
            <span className="text-xs">Create</span>
          </button>
          
          <button className="flex flex-col items-center space-y-1 text-white/70">
            <Heart size={24} />
            <span className="text-xs">Likes</span>
          </button>
          
          <button className="flex flex-col items-center space-y-1 text-white/70">
            <User size={24} />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>

      {/* Swipe Instructions */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 10 }}
      >
        <div className="bg-black/50 backdrop-blur-sm text-white px-6 py-3 rounded-full">
          <p className="text-sm font-medium">
            📱 Swipe up/down to navigate • 👉 Swipe right for recipe details
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TikTokStyleFeed;
