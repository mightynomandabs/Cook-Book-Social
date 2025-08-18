import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, Play } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onView: () => void;
  viewMode: 'grid' | 'reels';
  onLike?: (recipeId: string) => void;
  onSave?: (recipeId: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onView, 
  viewMode, 
  onLike, 
  onSave 
}) => {
  const [isLiked, setIsLiked] = useState(recipe.isLiked || false);
  const [isSaved, setIsSaved] = useState(recipe.isSaved || false);
  const [likesCount, setLikesCount] = useState(recipe.likes_count || 0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    if (onLike) {
      onLike(recipe.id);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (onSave) {
      onSave(recipe.id);
    }
  };

  const handleView = () => {
    onView();
  };

  if (viewMode === 'reels') {
    return (
      <article className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-slate-100 dark:border-slate-700">
        {/* Hero Image/Video */}
        <div className="relative h-80 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
          {recipe.image ? (
            <div className="relative w-full h-full">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              {/* Play overlay for video */}
              {recipe.video && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <Play size={24} className="text-slate-800 ml-1" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20">
              🍽️
            </div>
          )}
          
          {/* Save button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={handleSave}
              className={`p-3 rounded-2xl transition-all duration-200 ${
                isSaved 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
                  : 'bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg backdrop-blur-sm'
              }`}
            >
              <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* View button overlay */}
          <button
            onClick={handleView}
            className="absolute inset-0 w-full h-full bg-transparent hover:bg-black/5 transition-colors duration-200"
            aria-label={`View ${recipe.title} recipe`}
          />
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
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
            {recipe.title}
          </h3>

          {/* Teaser */}
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            {recipe.teaser}
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
              <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-600">
                +{recipe.tags.length - 3}
              </span>
            )}
          </div>

          {/* Interaction Buttons */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors ${
                  isLiked ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400 hover:text-orange-500'
                }`}
              >
                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                <span className="text-sm font-medium">{likesCount}</span>
              </button>
              
              <button className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 hover:text-orange-500 transition-colors">
                <MessageCircle size={20} />
                <span className="text-sm font-medium">{recipe.comments_count || 0}</span>
              </button>
            </div>

            <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-orange-500 transition-colors">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </article>
    );
  }

  // Grid view (more compact)
  return (
    <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-100 dark:border-slate-700">
      {/* Hero Image */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
        {recipe.image ? (
          <div className="relative w-full h-full">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            {recipe.video && (
              <div className="absolute top-2 right-2 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center">
                <Play size={16} className="text-white ml-0.5" />
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20">
            🍽️
          </div>
        )}
        
        {/* Save button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={handleSave}
            className={`p-2 rounded-xl transition-all duration-200 ${
              isSaved 
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
                : 'bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg backdrop-blur-sm'
            }`}
          >
            <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* View button overlay */}
        <button
          onClick={handleView}
          className="absolute inset-0 w-full h-full bg-transparent hover:bg-black/5 transition-colors duration-200"
          aria-label={`View ${recipe.title} recipe`}
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Creator Info */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 flex items-center justify-center overflow-hidden border border-white dark:border-slate-700 shadow-sm">
            {recipe.creator.avatar ? (
              <img
                src={recipe.creator.avatar}
                alt={recipe.creator.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm">👨‍🍳</span>
            )}
          </div>
          <div>
            <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">
              {recipe.creator.name}
            </p>
          </div>
        </div>

        {/* Recipe Title */}
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight line-clamp-2">
          {recipe.title}
        </h3>

        {/* Interaction Buttons */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 transition-colors ${
                isLiked ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400 hover:text-orange-500'
              }`}
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              <span className="text-xs font-medium">{likesCount}</span>
            </button>
            
            <button className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 hover:text-orange-500 transition-colors">
              <MessageCircle size={16} />
              <span className="text-xs font-medium">{recipe.comments_count || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default RecipeCard;
