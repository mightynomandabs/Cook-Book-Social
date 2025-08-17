import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Heart, Bookmark, MessageCircle, Share2, ChefHat, ShoppingCart, Sparkles } from 'lucide-react';
import { LiquidFill } from './WebGLMotionSystem';

interface Recipe {
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

interface RecipeReelProps {
  recipes: Recipe[];
  onLike?: (recipeId: string) => void;
  onSave?: (recipeId: string) => void;
  onComment?: (recipeId: string) => void;
  onShare?: (recipeId: string) => void;
  onRemix?: (recipeId: string) => void;
}

export const RecipeReel: React.FC<RecipeReelProps> = ({
  recipes,
  onLike,
  onSave,
  onComment,
  onShare,
  onRemix
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [tryMode, setTryMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});
  const [isSaved, setIsSaved] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement>>({});

  const currentRecipe = recipes[currentIndex];

  // Handle vertical swipe
  const handleDragEnd = useCallback((event: any, info: PanInfo) => {
    const threshold = 100;
    if (Math.abs(info.offset.y) > threshold) {
      if (info.offset.y > 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (info.offset.y < 0 && currentIndex < recipes.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    }
  }, [currentIndex, recipes.length]);

  // Auto-play current video, pause others
  useEffect(() => {
    recipes.forEach((recipe, index) => {
      const video = videoRefs.current[recipe.id];
      if (video) {
        if (index === currentIndex) {
          video.play().catch(() => {
            // Auto-play blocked, show play button
          });
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentIndex, recipes]);

  // Handle like toggle
  const handleLike = (recipeId: string) => {
    setIsLiked(prev => ({
      ...prev,
      [recipeId]: !prev[recipeId]
    }));
    onLike?.(recipeId);
  };

  // Handle save toggle
  const handleSave = (recipeId: string) => {
    setIsSaved(prev => ({
      ...prev,
      [recipeId]: !prev[recipeId]
    }));
    onSave?.(recipeId);
  };

  // Handle step navigation
  const handleStepChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentStep < currentRecipe.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else if (direction === 'prev' && currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Right rail action buttons
  const ActionButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    count?: number;
    onClick: () => void;
    isActive?: boolean;
    color?: string;
  }> = ({ icon, label, count, onClick, isActive, color = 'white' }) => (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center space-y-2 text-white"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
    >
      <motion.div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isActive ? 'bg-gradient-primary' : 'bg-black/30 backdrop-blur-sm'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {icon}
      </motion.div>
      <span className="text-xs font-medium">{label}</span>
      {count !== undefined && (
        <span className="text-xs opacity-80">{count.toLocaleString()}</span>
      )}
    </motion.button>
  );

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Recipe Reel Container */}
      <motion.div
        ref={containerRef}
        className="relative h-full"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Current Recipe */}
        <div className="relative h-full">
          {/* Video Background */}
          <video
            ref={el => {
              if (el) videoRefs.current[currentRecipe.id] = el;
            }}
            src={currentRecipe.video}
            poster={currentRecipe.thumbnail}
            className="absolute inset-0 w-full h-full object-cover"
            loop
            muted
            playsInline
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            {/* Creator Info */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <img
                  src={currentRecipe.creator.avatar}
                  alt={currentRecipe.creator.name}
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
                {currentRecipe.creator.verified && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold">{currentRecipe.creator.name}</h3>
                <p className="text-sm opacity-80">{currentRecipe.cuisine} • {currentRecipe.timeToCook}</p>
              </div>
            </div>

            {/* Recipe Title */}
            <h2 className="text-2xl font-bold mb-2 line-clamp-2">{currentRecipe.title}</h2>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {currentRecipe.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Difficulty & Time */}
            <div className="flex items-center space-x-4 text-sm opacity-80">
              <span className="flex items-center space-x-1">
                <ChefHat size={16} />
                <span>{currentRecipe.difficulty}</span>
              </span>
              <span>⏱ {currentRecipe.timeToCook}</span>
            </div>
          </div>

          {/* Right Rail Actions */}
          <div className="absolute right-4 bottom-32 space-y-6">
            <ActionButton
              icon={<Heart size={24} fill={isLiked[currentRecipe.id] ? 'currentColor' : 'none'} />}
              label="Like"
              count={currentRecipe.likes}
              onClick={() => handleLike(currentRecipe.id)}
              isActive={isLiked[currentRecipe.id]}
            />

            <ActionButton
              icon={<Bookmark size={24} fill={isSaved[currentRecipe.id] ? 'currentColor' : 'none'} />}
              label="Save"
              count={currentRecipe.saves}
              onClick={() => handleSave(currentRecipe.id)}
              isActive={isSaved[currentRecipe.id]}
            />

            <ActionButton
              icon={<MessageCircle size={24} />}
              label="Comment"
              count={currentRecipe.comments}
              onClick={() => onComment?.(currentRecipe.id)}
            />

            <ActionButton
              icon={<Share2 size={24} />}
              label="Share"
              count={currentRecipe.shares}
              onClick={() => onShare?.(currentRecipe.id)}
            />

            <ActionButton
              icon={<Sparkles size={24} />}
              label="Remix"
              onClick={() => onRemix?.(currentRecipe.id)}
              color="gradient"
            />
          </div>

          {/* CTA Drawer Trigger */}
          <motion.button
            onClick={() => setIsDrawerOpen(true)}
            className="absolute bottom-6 left-6 bg-gradient-primary text-white px-6 py-3 rounded-full font-semibold shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Recipe
          </motion.button>

          {/* Try Mode Toggle */}
          <motion.button
            onClick={() => setTryMode(!tryMode)}
            className={`absolute top-6 left-6 px-4 py-2 rounded-full font-medium transition-all ${
              tryMode 
                ? 'bg-gradient-primary text-white' 
                : 'bg-white/20 backdrop-blur-sm text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tryMode ? 'Exit Try Mode' : 'Try Mode'}
          </motion.button>

          {/* Try Mode Step Overlay */}
          {tryMode && (
            <motion.div
              className="absolute top-20 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">
                  Step {currentStep + 1} of {currentRecipe.steps.length}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStepChange('prev')}
                    disabled={currentStep === 0}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => handleStepChange('next')}
                    disabled={currentStep === currentRecipe.steps.length - 1}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50"
                  >
                    →
                  </button>
                </div>
              </div>
              
              <p className="text-gray-700 mb-3">{currentRecipe.steps[currentStep]}</p>
              
              {/* Step Progress */}
              <LiquidFill
                progress={((currentStep + 1) / currentRecipe.steps.length) * 100}
                height={6}
                className="w-full"
              />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* CTA Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[80vh] overflow-hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Drawer Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Drawer Content */}
              <div className="px-6 pb-6">
                {/* Recipe Header */}
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={currentRecipe.thumbnail}
                    alt={currentRecipe.title}
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 line-clamp-2">
                      {currentRecipe.title}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      by {currentRecipe.creator.name}
                    </p>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-6">
                  {['Ingredients', 'Steps', 'Shop', 'AI Suggest'].map((tab, index) => (
                    <button
                      key={tab}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        index === 0 
                          ? 'bg-white text-gray-800 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Ingredients List */}
                <div className="space-y-3 mb-6">
                  <h3 className="font-semibold text-gray-800">Ingredients</h3>
                  {currentRecipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-primary rounded-full" />
                      <span className="text-gray-700">{ingredient}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <motion.button
                    className="flex-1 bg-gradient-primary text-white py-3 rounded-xl font-semibold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingCart size={20} className="inline mr-2" />
                    Add to Cart
                  </motion.button>
                  
                  <motion.button
                    className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Sparkles size={20} className="inline mr-2" />
                    AI Suggest
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {recipes.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-white w-8' 
                : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeReel;
