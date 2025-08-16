import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, Share2, Clock, Users, Flame } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeFeedProps {
  recipes: Recipe[];
  searchQuery: string;
  showFilters: boolean;
  onFilterByCuisine: (cuisine: string) => void;
}

const RecipeFeed: React.FC<RecipeFeedProps> = ({ recipes, searchQuery, showFilters, onFilterByCuisine }) => {
  const navigate = useNavigate();

  const handleLike = (recipeId: string) => {
    // This will be handled by the parent component with Supabase
    console.log('Like recipe:', recipeId);
  };

  const handleSave = (recipeId: string) => {
    // This will be handled by the parent component with Supabase
    console.log('Save recipe:', recipeId);
  };

  // Recipes are now filtered by Supabase, so we use them directly
  const displayRecipes = recipes;

  return (
    <div className="space-y-4 pb-4">
      {/* Filter Section */}
      {showFilters && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex space-x-2 overflow-x-auto">
            {['All', 'Trending', 'Indian', 'Italian', 'Chinese', 'Vegetarian', 'Quick', 'Dessert'].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  if (filter === 'All') return;
                  if (['Indian', 'Italian', 'Chinese'].includes(filter)) {
                    onFilterByCuisine(filter);
                  }
                }}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-cookbook-orange hover:text-cookbook-orange transition-colors whitespace-nowrap"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recipe Cards */}
      {displayRecipes.map((recipe) => (
        <div key={recipe.id} className="bg-white border-b border-gray-100">
          {/* Recipe Header */}
          <div className="px-4 py-3 flex items-center space-x-3">
            <div className="relative">
              <img
                src={recipe.creator.avatar}
                alt={recipe.creator.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              {recipe.creator.cookingLevel >= 80 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-cookbook-orange rounded-full flex items-center justify-center">
                  <Flame className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-cookbook-black">{recipe.creator.name}</h4>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{recipe.creator.cookingLevelTitle}</span>
                <span>•</span>
                <span>{recipe.creator.location}</span>
              </div>
            </div>
            <button className="text-cookbook-orange font-semibold text-sm">Follow</button>
          </div>

          {/* Recipe Image/Video */}
          <div className="relative">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-80 object-cover"
            />
            {recipe.video && (
              <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
                ▶️ Video
              </div>
            )}
            
            {/* Recipe Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
              <h3 className="text-white font-bold text-lg mb-2">{recipe.title}</h3>
              <div className="flex items-center space-x-4 text-white/90 text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{recipe.totalTime} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{recipe.servings} servings</span>
                </div>
                <div className="px-2 py-1 bg-cookbook-orange/80 rounded-full text-xs font-medium">
                  {recipe.difficulty}
                </div>
              </div>
            </div>
          </div>

          {/* Recipe Actions */}
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(recipe.id)}
                  className={`flex items-center space-x-2 transition-colors ${
                    recipe.isLiked ? 'text-cookbook-orange' : 'text-gray-500 hover:text-cookbook-orange'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${recipe.isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{recipe.likes}</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-500 hover:text-cookbook-orange transition-colors">
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-sm font-medium">{recipe.comments}</span>
                </button>
                
                <button
                  onClick={() => handleSave(recipe.id)}
                  className={`flex items-center space-x-2 transition-colors ${
                    recipe.isSaved ? 'text-cookbook-yellow' : 'text-gray-500 hover:text-cookbook-yellow'
                  }`}
                >
                  <Bookmark className={`w-6 h-6 ${recipe.isSaved ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{recipe.saves}</span>
                </button>
              </div>
              
              <button className="text-gray-500 hover:text-cookbook-green transition-colors">
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Recipe Tags */}
            <div className="mt-3 flex flex-wrap gap-2">
              {recipe.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Ingredients Preview */}
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Ingredients:</span> {recipe.ingredients.slice(0, 3).map(i => i.name).join(', ')}
                {recipe.ingredients.length > 3 && ` +${recipe.ingredients.length - 3} more`}
              </p>
            </div>

            {/* View Recipe Button */}
            <button
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              className="mt-3 w-full bg-gradient-to-r from-cookbook-orange to-cookbook-yellow text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              View Recipe & Ingredients
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipeFeed;
