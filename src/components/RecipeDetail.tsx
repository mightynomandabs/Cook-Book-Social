import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Bookmark, Share2, Clock, Users, Star, Plus } from 'lucide-react';
import { sampleRecipes } from '../data/sampleRecipes';

const RecipeDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Find the recipe by ID
  const recipe = sampleRecipes.find(r => r.id === id);
  
  if (!recipe) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-4xl">🍳</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Recipe not found</h2>
          <p className="text-gray-600 mb-4">This recipe may have been removed or doesn't exist.</p>
          <button 
            onClick={() => navigate('/feed')}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors"
          >
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: recipe.teaser,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Recipe</h1>
          <button
            onClick={handleShare}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Recipe Media */}
      <div className="relative">
        {recipe.video ? (
          <video
            src={recipe.video}
            className="w-full h-80 object-cover"
            controls
            autoPlay
            muted
            playsInline
          />
        ) : (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-80 object-cover"
          />
        )}
        
        {/* Action Buttons Overlay */}
        <div className="absolute right-4 top-4 flex flex-col space-y-3">
          <button
            onClick={handleLike}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
            }`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button className="w-12 h-12 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <MessageCircle className="w-6 h-6" />
          </button>
          <button
            onClick={handleSave}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isSaved 
                ? 'bg-orange-500 text-white' 
                : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
            }`}
          >
            <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Recipe Info */}
      <div className="px-4 py-6">
        {/* Title and Creator */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
          <p className="text-gray-600 mb-4">{recipe.teaser}</p>
          
          <div className="flex items-center space-x-3">
            <img
              src={recipe.creator.avatar}
              alt={recipe.creator.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-900">{recipe.creator.name}</p>
              <p className="text-sm text-gray-600">{recipe.creator.location}</p>
            </div>
          </div>
        </div>

        {/* Recipe Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{recipe.likes_count}</div>
            <div className="text-sm text-gray-600">Likes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{recipe.comments_count}</div>
            <div className="text-sm text-gray-600">Comments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{recipe.saves_count}</div>
            <div className="text-sm text-gray-600">Saves</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{recipe.views}</div>
            <div className="text-sm text-gray-600">Views</div>
          </div>
        </div>

        {/* Recipe Details */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <div>
              <div className="text-sm font-medium text-gray-900">{recipe.totalTime} min</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-orange-500" />
            <div>
              <div className="text-sm font-medium text-gray-900">{recipe.servings}</div>
              <div className="text-xs text-gray-600">Servings</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-orange-500" />
            <div>
              <div className="text-sm font-medium text-gray-900">{recipe.difficulty}</div>
              <div className="text-xs text-gray-600">Level</div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
          <p className="text-gray-700 leading-relaxed">{recipe.description}</p>
        </div>

        {/* Ingredients */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
          <div className="space-y-2">
            {recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{ingredient.name}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Ingredients not available for this recipe.</p>
              </div>
            )}
          </div>
        </div>

        {/* Method Steps */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
          <div className="space-y-4">
            {recipe.method.length > 0 ? (
              recipe.method.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 leading-relaxed">{step.description}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Method steps not available for this recipe.</p>
              </div>
            )}
          </div>
        </div>

        {/* Nutrition Info */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Nutrition (per serving)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Calories</div>
              <div className="text-lg font-bold text-gray-900">{recipe.nutrition.calories}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Protein</div>
              <div className="text-lg font-bold text-gray-900">{recipe.nutrition.protein}g</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Carbs</div>
              <div className="text-lg font-bold text-gray-900">{recipe.nutrition.carbs}g</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Fat</div>
              <div className="text-lg font-bold text-gray-900">{recipe.nutrition.fat}g</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mb-8">
          <button
            onClick={handleLike}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-colors ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isLiked ? 'Liked' : 'Like'}
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-colors ${
              isSaved 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isSaved ? 'Saved' : 'Save'}
          </button>
          <button className="flex-1 py-3 px-6 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors">
            <Plus className="w-5 h-5 inline mr-2" />
            Create Similar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
