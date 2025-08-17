import React, { useState, useRef, useEffect } from 'react';
import { useSpring, animated, config } from 'react-spring';
import { gsap } from 'gsap';
import { LikeButton, SaveButton, ProgressBar } from './MotionSystem';

interface Recipe {
  id: string;
  title: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
    followers: number;
  };
  videoUrl: string;
  thumbnail: string;
  duration: number;
  likes: number;
  saves: number;
  comments: number;
  shares: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  tags: string[];
  ingredients: string[];
  steps: string[];
  cookTime: number;
  servings: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  xpReward: number;
  streakBonus: boolean;
}

interface EnhancedRecipeReelProps {
  recipes: Recipe[];
  onRecipeComplete?: (recipeId: string, xpEarned: number) => void;
  onRecipeSave?: (recipeId: string) => void;
  onRecipeLike?: (recipeId: string) => void;
  onCreatorFollow?: (creatorId: string) => void;
}

export const EnhancedRecipeReel: React.FC<EnhancedRecipeReelProps> = ({
  recipes,
  onRecipeComplete,
  onRecipeSave,
  onRecipeLike,
  onCreatorFollow
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showRecipeDetails, setShowRecipeDetails] = useState(false);
  const [userXP, setUserXP] = useState(1250);
  const [userLevel, setUserLevel] = useState(8);
  const [currentStreak, setCurrentStreak] = useState(5);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>();

  const currentRecipe = recipes[currentIndex];

  // Progress bar animation
  const progressSpring = useSpring({
    width: `${progress}%`,
    config: config.wobbly
  });

  // Recipe card animations
  const cardSpring = useSpring({
    transform: showRecipeDetails ? 'scale(0.95)' : 'scale(1)',
    opacity: showRecipeDetails ? 0.8 : 1,
    config: config.wobbly
  });

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      progressIntervalRef.current = setInterval(() => {
        if (videoRef.current) {
          const currentTime = videoRef.current.currentTime;
          const duration = videoRef.current.duration;
          const newProgress = (currentTime / duration) * 100;
          setProgress(newProgress);
          
          // Auto-advance when video completes
          if (newProgress >= 100) {
            handleVideoComplete();
          }
        }
      }, 100);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying]);

  const handleVideoComplete = () => {
    // Award XP and streak bonus
    const baseXP = currentRecipe.xpReward;
    const streakMultiplier = currentStreak >= 7 ? 2 : 1;
    const totalXP = baseXP * streakMultiplier;
    
    setUserXP(prev => prev + totalXP);
    setCurrentStreak(prev => prev + 1);
    
    // Check for level up
    const newLevel = Math.floor(userXP / 1000) + 1;
    if (newLevel > userLevel) {
      setUserLevel(newLevel);
      showLevelUpAnimation();
    }
    
    onRecipeComplete?.(currentRecipe.id, totalXP);
    
    // Auto-advance to next recipe
    setTimeout(() => {
      handleNextRecipe();
    }, 1500);
  };

  const showLevelUpAnimation = () => {
    const levelUpElement = document.createElement('div');
    levelUpElement.className = 'fixed inset-0 flex items-center justify-center z-50 pointer-events-none';
    levelUpElement.innerHTML = `
      <div class="bg-gradient-cta text-white px-8 py-6 rounded-cb-xl shadow-cb-high text-center">
        <div class="text-4xl mb-2">🎉</div>
        <div class="text-h2 font-bold mb-2">Level Up!</div>
        <div class="text-body">You're now Level ${userLevel + 1}</div>
        <div class="text-caption mt-2">+${currentRecipe.xpReward} XP earned!</div>
      </div>
    `;
    
    document.body.appendChild(levelUpElement);
    
    gsap.fromTo(levelUpElement, 
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
    );
    
    setTimeout(() => {
      gsap.to(levelUpElement, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => document.body.removeChild(levelUpElement)
      });
    }, 2000);
  };

  const handleNextRecipe = () => {
    if (currentIndex < recipes.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
      setIsPlaying(false);
      setShowRecipeDetails(false);
    }
  };

  const handlePrevRecipe = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
      setIsPlaying(false);
      setShowRecipeDetails(false);
    }
  };

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLike = () => {
    onRecipeLike?.(currentRecipe.id);
  };

  const handleSave = () => {
    onRecipeSave?.(currentRecipe.id);
  };

  const handleFollow = () => {
    onCreatorFollow?.(currentRecipe.creator.id);
  };

  const handleLongPress = () => {
    setShowRecipeDetails(true);
  };

  if (!currentRecipe) return null;

  return (
    <div className="relative h-screen bg-cb-charcoal overflow-hidden">
      {/* Video Container */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          src={currentRecipe.videoUrl}
          poster={currentRecipe.thumbnail}
          className="w-full h-full object-cover"
          onClick={handleVideoToggle}
          onTouchStart={() => {
            // Long press detection for mobile
            const timer = setTimeout(() => handleLongPress(), 500);
            const touchEnd = () => {
              clearTimeout(timer);
              document.removeEventListener('touchend', touchEnd);
            };
            document.addEventListener('touchend', touchEnd);
          }}
        />
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-cb-slate/30">
          <animated.div
            className="h-full bg-gradient-to-r from-cb-saffron via-cb-coral to-cb-lemon"
            style={progressSpring}
          />
        </div>

        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-cb-slate/80 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-4xl text-white">▶️</span>
            </div>
          </div>
        )}

        {/* Recipe Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-cb-charcoal/90 via-cb-charcoal/50 to-transparent">
          <div className="flex items-end justify-between">
            <div className="flex-1">
              <h2 className="text-h2 text-white font-bold mb-2">
                {currentRecipe.title}
              </h2>
              
              {/* Creator Info */}
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={currentRecipe.creator.avatar}
                  alt={currentRecipe.creator.name}
                  className="w-10 h-10 rounded-full border-2 border-cb-saffron"
                />
                <div>
                  <p className="text-body text-white font-medium">
                    {currentRecipe.creator.name}
                  </p>
                  <p className="text-caption text-cb-gray-200">
                    {currentRecipe.creator.followers.toLocaleString()} followers
                  </p>
                </div>
                <button
                  onClick={handleFollow}
                  className="px-4 py-2 bg-cb-saffron text-white rounded-cb-lg text-sm font-medium hover:bg-cb-coral transition-colors"
                >
                  Follow
                </button>
              </div>

              {/* Recipe Stats */}
              <div className="flex items-center space-x-4 text-caption text-cb-gray-200">
                <span>⏱️ {currentRecipe.cookTime} min</span>
                <span>👥 {currentRecipe.servings} servings</span>
                <span>🔥 {currentRecipe.difficulty}</span>
                <span>🌍 {currentRecipe.cuisine}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6">
          <LikeButton
            isLiked={false}
            onToggle={handleLike}
            count={currentRecipe.likes}
            size="lg"
          />
          
          <SaveButton
            isSaved={false}
            onToggle={handleSave}
            size="lg"
          />
          
          <div className="flex flex-col items-center space-y-2">
            <button className="w-12 h-12 rounded-full bg-cb-slate/20 hover:bg-cb-slate/30 flex items-center justify-center transition-colors">
              <span className="text-2xl">💬</span>
            </button>
            <span className="text-cb-caption text-white">
              {currentRecipe.comments.toLocaleString()}
            </span>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <button className="w-12 h-12 rounded-full bg-cb-slate/20 hover:bg-cb-slate/30 flex items-center justify-center transition-colors">
              <span className="text-2xl">📤</span>
            </button>
            <span className="text-cb-caption text-white">
              {currentRecipe.shares.toLocaleString()}
            </span>
          </div>
        </div>

        {/* User Stats Bar */}
        <div className="absolute top-4 right-4 bg-cb-slate/80 backdrop-blur-sm rounded-cb-lg p-3 text-white">
          <div className="flex items-center space-x-3">
            <div className="text-center">
              <div className="text-h3 font-bold text-cb-lemon">
                Lv.{userLevel}
              </div>
              <div className="text-caption text-cb-gray-200">Level</div>
            </div>
            
            <div className="text-center">
              <div className="text-h3 font-bold text-cb-saffron">
                🔥{currentStreak}
              </div>
              <div className="text-caption text-cb-gray-200">Streak</div>
            </div>
            
            <div className="text-center">
              <div className="text-h3 font-bold text-cb-coral">
                {userXP}
              </div>
              <div className="text-caption text-cb-gray-200">XP</div>
            </div>
          </div>
        </div>

        {/* Navigation Hints */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-center opacity-60">
          <div className="text-2xl mb-2">⬅️</div>
          <div className="text-caption">Swipe left</div>
        </div>
        
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-center opacity-60">
          <div className="text-2xl mb-2">➡️</div>
          <div className="text-caption">Swipe right</div>
        </div>
      </div>

      {/* Recipe Details Modal */}
      {showRecipeDetails && (
        <animated.div
          className="absolute inset-0 bg-cb-charcoal/95 backdrop-blur-md z-10"
          style={cardSpring}
        >
          <div className="h-full overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-h1 text-white font-bold">
                {currentRecipe.title}
              </h1>
              <button
                onClick={() => setShowRecipeDetails(false)}
                className="w-10 h-10 rounded-full bg-cb-slate/50 text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Recipe Tabs */}
            <div className="space-y-6">
              {/* Ingredients Tab */}
              <div>
                <h3 className="text-h2 text-white font-bold mb-4">Ingredients</h3>
                <div className="grid grid-cols-2 gap-3">
                  {currentRecipe.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="bg-cb-slate/50 rounded-cb-lg p-3 text-white"
                    >
                      {ingredient}
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps Tab */}
              <div>
                <h3 className="text-h2 text-white font-bold mb-4">Steps</h3>
                <div className="space-y-4">
                  {currentRecipe.steps.map((step, index) => (
                    <div
                      key={index}
                      className="bg-cb-slate/50 rounded-cb-lg p-4 text-white"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-cb-saffron text-cb-charcoal font-bold flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-body">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nutrition Tab */}
              <div>
                <h3 className="text-h2 text-white font-bold mb-4">Nutrition</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-cb-slate/50 rounded-cb-lg p-4 text-center">
                    <div className="text-h3 text-cb-saffron font-bold">
                      {currentRecipe.nutrition.calories}
                    </div>
                    <div className="text-caption text-cb-gray-200">Calories</div>
                  </div>
                  <div className="bg-cb-slate/50 rounded-cb-lg p-4 text-center">
                    <div className="text-h3 text-cb-coral font-bold">
                      {currentRecipe.nutrition.protein}g
                    </div>
                    <div className="text-caption text-cb-gray-200">Protein</div>
                  </div>
                  <div className="bg-cb-slate/50 rounded-cb-lg p-4 text-center">
                    <div className="text-h3 text-cb-lemon font-bold">
                      {currentRecipe.nutrition.carbs}g
                    </div>
                    <div className="text-caption text-cb-gray-200">Carbs</div>
                  </div>
                  <div className="bg-cb-slate/50 rounded-cb-lg p-4 text-center">
                    <div className="text-h3 text-cb-coral font-bold">
                      {currentRecipe.nutrition.fat}g
                    </div>
                    <div className="text-caption text-cb-gray-200">Fat</div>
                  </div>
                </div>
              </div>

              {/* XP Reward */}
              <div className="bg-gradient-cta rounded-cb-lg p-6 text-center text-white">
                <div className="text-h2 font-bold mb-2">
                  🎯 Complete Recipe
                </div>
                <div className="text-body mb-4">
                  Earn {currentRecipe.xpReward} XP + streak bonus!
                </div>
                <button
                  onClick={() => {
                    setShowRecipeDetails(false);
                    handleVideoComplete();
                  }}
                  className="bg-white text-cb-charcoal px-8 py-3 rounded-cb-lg font-bold hover:bg-cb-gray-200 transition-colors"
                >
                  Mark as Complete
                </button>
              </div>
            </div>
          </div>
        </animated.div>
      )}
    </div>
  );
};

export default EnhancedRecipeReel;
