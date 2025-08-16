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
    <article className="bg-white rounded-2xl card-shadow overflow-hidden">
      {/* Hero Image */}
      <div className="relative h-48 bg-gradient-to-br from-cookbook-orange/20 to-cookbook-yellow/20">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🍽️
          </div>
        )}
        <div className="absolute top-3 right-3">
          <button
            onClick={handleSave}
            className={`p-2 rounded-full transition-colors ${
              isSaved 
                ? 'bg-cookbook-yellow text-cookbook-black' 
                : 'bg-white/80 text-cookbook-black hover:bg-white'
            }`}
          >
            <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Creator Info */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-cookbook-orange/10 flex items-center justify-center overflow-hidden">
            {recipe.creator.avatar ? (
              <img
                src={recipe.creator.avatar}
                alt={recipe.creator.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg">👨‍🍳</span>
            )}
          </div>
          <div>
            <p className="font-medium text-cookbook-black text-sm">
              {recipe.creator.name}
            </p>
            <p className="text-xs text-gray-500">2 hours ago</p>
          </div>
        </div>

        {/* Recipe Title */}
        <h3 className="text-lg font-bold text-cookbook-black font-poppins leading-tight">
          {recipe.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {recipe.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-cookbook-green/10 text-cookbook-green text-xs font-medium rounded-full"
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
