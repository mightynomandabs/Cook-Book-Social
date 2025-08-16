import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { ChevronRight, Heart, MessageCircle, Share2, Bookmark, Clock, Users } from 'lucide-react';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { Recipe } from '../types';

interface RecipeReelProps {
  recipe: Recipe;
  onNext?: () => void;
  onPrevious?: () => void;
  onLike?: (recipeId: string) => void;
  onSave?: (recipeId: string) => void;
  onShare?: (recipe: Recipe) => void;
  onComment?: (recipeId: string) => void;
}

const RecipeReel: React.FC<RecipeReelProps> = ({
  recipe,
  onNext,
  onPrevious,
  onLike,
  onSave,
  onShare,
  onComment
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const { hapticMedium, hapticLight, hapticSuccess } = useHapticFeedback();
  
  // Motion values for swipe gestures
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform values for animations
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 0.5, 1, 0.5, 0]);
  const scale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8]);
  
  // Right swipe threshold for ingredients
  const rightSwipeThreshold = 100;
  
  const handlePan = useCallback((event: any, info: PanInfo) => {
    const { offset } = info;
    
    // Right swipe to show ingredients
    if (offset.x > rightSwipeThreshold && !showIngredients) {
      setShowIngredients(true);
      hapticSuccess();
    }
    
    // Left swipe to hide ingredients
    if (offset.x < -rightSwipeThreshold && showIngredients) {
      setShowIngredients(false);
      hapticLight();
    }
    
    // Vertical swipe for next/previous
    if (Math.abs(offset.y) > 100) {
      if (offset.y > 0 && onPrevious) {
        onPrevious();
        hapticMedium();
      } else if (offset.y < 0 && onNext) {
        onNext();
        hapticMedium();
      }
    }
  }, [showIngredients, onNext, onPrevious, hapticSuccess, hapticLight, hapticMedium]);
  
  const handleLike = useCallback(() => {
    setIsLiked(!isLiked);
    hapticMedium();
    onLike?.(recipe.id);
  }, [isLiked, hapticMedium, onLike, recipe.id]);
  
  const handleSave = useCallback(() => {
    setIsSaved(!isSaved);
    hapticMedium();
    onSave?.(recipe.id);
  }, [isSaved, hapticMedium, onSave, recipe.id]);
  
  const handleShare = useCallback(() => {
    hapticSuccess();
    onShare?.(recipe);
  }, [hapticSuccess, onShare, recipe]);
  
  const handleComment = useCallback(() => {
    hapticLight();
    onComment?.(recipe.id);
  }, [hapticLight, onComment, recipe.id]);
  
  const nextStep = useCallback(() => {
    if (currentStep < (recipe.method?.length || 0) - 1) {
      setCurrentStep(prev => prev + 1);
      hapticLight();
    }
  }, [currentStep, recipe.method?.length, hapticLight]);
  
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      hapticLight();
    }
  }, [currentStep, hapticLight]);

  return (
    <motion.div
      className="relative w-full h-screen bg-black overflow-hidden"
      style={{ x, y, rotate, opacity, scale }}
      onPan={handlePan}
      drag="x"
      dragConstraints={{ left: -200, right: 200 }}
      dragElastic={0.1}
    >
      {/* Recipe Video/Image Background */}
      <div className="absolute inset-0">
        {recipe.video ? (
          <video
            className="w-full h-full object-cover"
            src={recipe.video}
            loop
            muted
            playsInline
            autoPlay
          />
        ) : (
          <img
            className="w-full h-full object-cover"
            src={recipe.image}
            alt={recipe.title}
          />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* Right Side Action Buttons (TikTok Style) */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6 z-20">
        {/* Profile Avatar */}
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden">
            <img
              src={recipe.creator.avatar}
              alt={recipe.creator.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-xs">+</span>
          </div>
        </div>

        {/* Like Button */}
        <motion.button
          onClick={handleLike}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center space-y-1"
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isLiked ? 'bg-red-500' : 'bg-white/20 backdrop-blur-sm'
          }`}>
            <Heart
              size={24}
              className={isLiked ? 'text-white fill-white' : 'text-white'}
            />
          </div>
          <span className="text-white text-xs font-medium">{recipe.likes}</span>
        </motion.button>

        {/* Comment Button */}
        <motion.button
          onClick={handleComment}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center space-y-1"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <MessageCircle size={24} className="text-white" />
          </div>
          <span className="text-white text-xs font-medium">{recipe.comments || 0}</span>
        </motion.button>

        {/* Share Button */}
        <motion.button
          onClick={handleShare}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center space-y-1"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Share2 size={24} className="text-white" />
          </div>
          <span className="text-white text-xs font-medium">Share</span>
        </motion.button>

        {/* Save Button */}
        <motion.button
          onClick={handleSave}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center space-y-1"
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isSaved ? 'bg-orange-500' : 'bg-white/20 backdrop-blur-sm'
          }`}>
            <Bookmark
              size={24}
              className={isSaved ? 'text-white fill-white' : 'text-white'}
            />
          </div>
          <span className="text-white text-xs font-medium">Save</span>
        </motion.button>
      </div>

      {/* Bottom Recipe Info */}
      <div className="absolute bottom-8 left-4 right-20 z-20">
        <h2 className="text-white text-2xl font-bold mb-2">{recipe.title}</h2>
        <p className="text-white/90 text-sm mb-3 line-clamp-2">{recipe.description}</p>
        
        {/* Recipe Stats */}
        <div className="flex items-center space-x-4 text-white/80 text-sm">
          <div className="flex items-center space-x-1">
            <Clock size={16} />
            <span>{recipe.cookingTime}m</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users size={16} />
            <span>{recipe.servings} servings</span>
          </div>
          <div className="px-2 py-1 bg-white/20 rounded-full text-xs">
            {recipe.difficulty}
          </div>
        </div>
      </div>

      {/* Right Swipe Ingredients Panel */}
      <motion.div
        className="absolute inset-0 bg-white z-30"
        initial={{ x: '100%' }}
        animate={{ x: showIngredients ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="h-full overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Recipe Details</h3>
              <button
                onClick={() => setShowIngredients(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight size={24} className="text-gray-600" />
              </button>
            </div>
            <p className="text-gray-600 mt-1">{recipe.title}</p>
          </div>

          {/* Ingredients Section */}
          <div className="px-6 py-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
              Ingredients
            </h4>
            <div className="space-y-3">
              {recipe.ingredients?.map((ingredient, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">{ingredient.name}</span>
                  </div>
                  <span className="text-gray-600">
                    {ingredient.amount} {ingredient.unit}
                  </span>
                </div>
              )) || (
                <div className="text-gray-500 text-center py-8">
                  <p>Ingredients not available</p>
                </div>
              )}
            </div>
          </div>

          {/* Method Section */}
          <div className="px-6 py-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
              Method
            </h4>
            
            {/* Step Navigation */}
            {recipe.method && recipe.method.length > 0 && (
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Step {currentStep + 1} of {recipe.method.length}
                </span>
                <button
                  onClick={nextStep}
                  disabled={currentStep === recipe.method.length - 1}
                  className="px-3 py-1 bg-orange-500 text-white rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}

            {/* Current Step */}
            {recipe.method && recipe.method[currentStep] ? (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {recipe.method[currentStep].stepNumber}
                  </div>
                  <span className="text-sm text-orange-600 font-medium">
                    {recipe.method[currentStep].time} min
                  </span>
                </div>
                <p className="text-gray-900 leading-relaxed">
                  {recipe.method[currentStep].description}
                </p>
                {recipe.method[currentStep].tips && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-700">
                      💡 <span className="font-medium">Tip:</span> {recipe.method[currentStep].tips}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                <p>Method not available</p>
              </div>
            )}
          </div>

          {/* Swipe Hint */}
          <div className="px-6 py-6 text-center border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              👈 Swipe left to return to recipe
            </p>
          </div>
        </div>
      </motion.div>

      {/* Swipe Hint Overlay */}
      {!showIngredients && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <div className="bg-black/50 backdrop-blur-sm text-white px-6 py-3 rounded-full">
            <p className="text-sm font-medium">👉 Swipe right for ingredients & method</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RecipeReel;
