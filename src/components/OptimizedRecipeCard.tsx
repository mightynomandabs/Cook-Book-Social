import React, { useState, useCallback, memo, useRef, useEffect } from 'react';
import { Bookmark, Heart, Share2, Eye, Clock, Users } from 'lucide-react';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

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

interface OptimizedRecipeCardProps {
  recipe: Recipe;
  onSave?: (recipeId: string) => void;
  onLike?: (recipeId: string) => void;
  onShare?: (recipe: Recipe) => void;
  onView?: (recipe: Recipe) => void;
  className?: string;
}

const OptimizedRecipeCard: React.FC<OptimizedRecipeCardProps> = memo(({
  recipe,
  onSave,
  onLike,
  onShare,
  onView,
  className = ''
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const { hapticLight, hapticMedium, hapticSuccess } = useHapticFeedback();

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && imageRef.current && !imageLoaded && !imageError) {
            const img = imageRef.current;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();
  }, [imageLoaded, imageError]);

  const handleSave = useCallback(() => {
    setIsSaved(!isSaved);
    hapticMedium();
    onSave?.(recipe.id);
  }, [isSaved, hapticMedium, onSave, recipe.id]);

  const handleLike = useCallback(() => {
    setIsLiked(!isLiked);
    hapticLight();
    onLike?.(recipe.id);
  }, [isLiked, hapticLight, onLike, recipe.id]);

  const handleShare = useCallback(() => {
    hapticSuccess();
    onShare?.(recipe);
  }, [hapticSuccess, onShare, recipe]);

  const handleView = useCallback(() => {
    hapticLight();
    onView?.(recipe);
  }, [hapticLight, onView, recipe]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'Hard': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-800';
    }
  };

  return (
    <article 
      className={`bg-white dark:bg-slate-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 hover:scale-[1.02] border border-slate-100 dark:border-slate-700 cursor-pointer ${className}`}
      onClick={handleView}
    >
      {/* Hero Image with Lazy Loading */}
      <div className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 overflow-hidden">
        {!imageError ? (
          <img
            ref={imageRef}
            data-src={recipe.image}
            alt={recipe.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20">
            🍽️
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
            className={`p-3 rounded-2xl transition-all duration-200 backdrop-blur-sm ${
              isSaved 
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
                : 'bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg'
            }`}
          >
            <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            className={`p-3 rounded-2xl transition-all duration-200 backdrop-blur-sm ${
              isLiked 
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
                : 'bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg'
            }`}
          >
            <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Difficulty Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        </div>

        {/* Stats Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
          <div className="flex items-center space-x-2 text-sm">
            <Clock size={16} />
            <span>{recipe.cookingTime}m</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Users size={16} />
            <span>{recipe.servings}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Eye size={16} />
            <span>{recipe.views}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Creator Info */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm">
            {recipe.creator.avatar ? (
              <img
                src={recipe.creator.avatar}
                alt={recipe.creator.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="text-xl">👨‍🍳</span>
            )}
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
              {recipe.creator.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">2 hours ago</p>
          </div>
        </div>

        {/* Recipe Title */}
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 leading-tight line-clamp-2">
          {recipe.title}
        </h3>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
          {recipe.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {recipe.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-600"
            >
              {tag}
            </span>
          ))}
          {recipe.tags.length > 3 && (
            <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-medium rounded-xl">
              +{recipe.tags.length - 3}
            </span>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center space-x-1">
              <Heart size={16} />
              <span>{recipe.likes}</span>
            </span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </article>
  );
});

OptimizedRecipeCard.displayName = 'OptimizedRecipeCard';

export default OptimizedRecipeCard;
