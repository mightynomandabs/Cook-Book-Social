import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Heart, MessageCircle, Bookmark, Share2, User } from 'lucide-react';
import { sampleRecipes } from '../data/sampleRecipes';
import { Recipe } from '../types';

const KitchenFeed: React.FC = () => {
  const navigate = useNavigate();
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes] = useState<Recipe[]>(sampleRecipes);

  // Filter recipes based on search
  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentRecipe = filteredRecipes[currentRecipeIndex];

  const handleNext = () => {
    if (currentRecipeIndex < filteredRecipes.length - 1) {
      setCurrentRecipeIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentRecipeIndex > 0) {
      setCurrentRecipeIndex(prev => prev - 1);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      handleNext();
    } else {
      handlePrevious();
    }
  };

  const handleRecipeClick = () => {
    navigate(`/recipe/${currentRecipe.id}`);
  };

  if (!currentRecipe) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-4xl">🍳</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">No recipes found</h2>
          <p className="text-gray-400">Try adjusting your search or check back later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent pt-12 pb-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">🍳</span>
            </div>
            <h1 className="text-xl font-bold text-white">CookBook</h1>
          </div>
          
          <button
            onClick={() => navigate('/create')}
            className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search recipes, cuisines, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Recipe Feed */}
      <div 
        className="h-full flex items-center justify-center"
        onWheel={handleWheel}
      >
        <div className="relative w-full max-w-md mx-auto">
          {/* Recipe Card */}
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
            {/* Recipe Media */}
            <div className="relative aspect-[9/16] bg-gray-900">
              {currentRecipe.video ? (
                <video
                  src={currentRecipe.video}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={currentRecipe.image}
                  alt={currentRecipe.title}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Recipe Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                <div className="text-white">
                  <h2 className="text-2xl font-bold mb-2">{currentRecipe.title}</h2>
                  <p className="text-white/90 mb-3 line-clamp-2">{currentRecipe.teaser}</p>
                  
                  {/* Creator Info */}
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src={currentRecipe.creator.avatar}
                      alt={currentRecipe.creator.name}
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                    <div>
                      <p className="font-medium text-sm">{currentRecipe.creator.name}</p>
                      <p className="text-white/70 text-xs">{currentRecipe.cuisine} • {currentRecipe.difficulty}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4">
              <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
              <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <MessageCircle className="w-6 h-6" />
              </button>
              <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <Bookmark className="w-6 h-6" />
              </button>
              <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Recipe Stats */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4">
              <div className="text-center">
                <div className="text-white font-bold text-lg">{currentRecipe.likes_count}</div>
                <div className="text-white/70 text-xs">likes</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-lg">{currentRecipe.comments_count}</div>
                <div className="text-white/70 text-xs">comments</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-lg">{currentRecipe.saves_count}</div>
                <div className="text-white/70 text-xs">saves</div>
              </div>
            </div>
          </div>

          {/* Tap to View Instructions */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 backdrop-blur-sm text-white px-6 py-3 rounded-full opacity-0 hover:opacity-100 transition-opacity pointer-events-auto">
              <p className="text-sm font-medium">Tap to view recipe details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20">
        <div className="flex flex-col space-y-2">
          {filteredRecipes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentRecipeIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentRecipeIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="h-1 bg-white/20">
          <div
            className="h-full bg-orange-500 transition-all duration-300"
            style={{ width: `${((currentRecipeIndex + 1) / filteredRecipes.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Recipe Counter */}
      <div className="absolute top-20 left-6 z-20">
        <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full">
          <span className="text-sm font-medium">
            {currentRecipeIndex + 1} / {filteredRecipes.length}
          </span>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent z-20">
        <div className="flex items-center justify-around px-6 py-4">
          <button className="flex flex-col items-center space-y-1 text-white">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🍳</span>
            </div>
            <span className="text-xs">Feed</span>
          </button>
          
          <button 
            onClick={() => navigate('/create')}
            className="flex flex-col items-center space-y-1 text-white/70"
          >
            <Plus className="w-6 h-6" />
            <span className="text-xs">Create</span>
          </button>
          
          <button 
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center space-y-1 text-white/70"
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>

      {/* Click Handler for Recipe Details */}
      <div 
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={handleRecipeClick}
      />
    </div>
  );
};

export default KitchenFeed;
