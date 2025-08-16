import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onLike?: (recipeId: string) => void;
  onSave?: (recipeId: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onLike, onSave }) => {
  const [isLiked, setIsLiked] = useState(recipe.isLiked || false);
  const [isSaved, setIsSaved] = useState(recipe.isSaved || false);
  const [likesCount, setLikesCount] = useState(recipe.likes || 0);

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

  return (
    <article className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-slate-100">
      {/* Hero Image */}
      <div className="relative h-56 bg-gradient-to-br from-slate-100 to-slate-200">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-orange-100 to-red-100">
            🍽️
          </div>
        )}
        <div className="absolute top-4 right-4">
          <button
            onClick={handleSave}
            className={`p-3 rounded-2xl transition-all duration-200 ${
              isSaved 
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
                : 'bg-white/90 text-slate-700 hover:bg-white hover:shadow-lg backdrop-blur-sm'
            }`}
          >
            <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Creator Info */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
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
            <p className="font-semibold text-slate-800 text-sm">
              {recipe.creator.name}
            </p>
            <p className="text-xs text-slate-500">2 hours ago</p>
          </div>
        </div>

        {/* Recipe Title */}
        <h3 className="text-xl font-bold text-slate-800 leading-tight">
          {recipe.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {recipe.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-xl border border-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Teaser */}
        <p className="text-gray-700 text-sm leading-relaxed">
          {recipe.teaser}
        </p>

        {/* Interaction Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors ${
                isLiked ? 'text-cookbook-orange' : 'text-gray-500 hover:text-cookbook-orange'
              }`}
            >
              <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
              <span className="text-sm font-medium">{likesCount}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-gray-500 hover:text-cookbook-green transition-colors">
              <MessageCircle size={20} />
              <span className="text-sm font-medium">{recipe.comments}</span>
            </button>
          </div>

          <button className="p-2 text-gray-500 hover:text-cookbook-orange transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default RecipeCard;
