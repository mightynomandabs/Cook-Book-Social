import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Bookmark, Share2, Clock, Users, Flame, Check, ShoppingCart, Globe } from 'lucide-react';
import { sampleRecipe } from '../data/sampleRecipe';
import BuyNowModal from './BuyNowModal';

const RecipeDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'method'>('ingredients');
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState('English');

  // In a real app, you'd fetch the recipe by ID
  const recipe = sampleRecipe;

  const handleBuyNow = (ingredientId: string) => {
    setSelectedIngredient(ingredientId);
    setShowBuyNowModal(true);
  };

  const handleMarkAsHave = (ingredientId: string) => {
    // Toggle ingredient availability
    console.log('Marked as have:', ingredientId);
  };

  const languages = [
    { code: 'English', name: 'English' },
    { code: 'Hindi', name: 'हिंदी' },
    { code: 'Marathi', name: 'मराठी' },
    { code: 'Tamil', name: 'தமிழ்' },
    { code: 'Telugu', name: 'తెలుగు' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 hover:text-cookbook-orange transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:text-cookbook-orange transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-cookbook-yellow transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recipe Hero Image */}
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-80 object-cover"
        />
        
        {/* Language Selector */}
        <div className="absolute top-4 right-4">
          <div className="relative">
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-cookbook-black focus:outline-none focus:ring-2 focus:ring-cookbook-orange"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
        </div>

        {/* Recipe Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
          <h1 className="text-white font-bold text-2xl mb-3">
            {currentLanguage === 'English' ? recipe.title : recipe.translations[currentLanguage] || recipe.title}
          </h1>
          
          <div className="flex items-center space-x-6 text-white/90 text-sm mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Prep: {recipe.prepTime}m</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Cook: {recipe.cookTime}m</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>

          {/* Difficulty and Cuisine Badges */}
          <div className="flex space-x-2">
            <span className="px-3 py-1 bg-cookbook-orange/90 text-white text-xs rounded-full font-medium">
              {recipe.difficulty}
            </span>
            <span className="px-3 py-1 bg-cookbook-green/90 text-white text-xs rounded-full font-medium">
              {recipe.cuisine}
            </span>
          </div>
        </div>
      </div>

      {/* Creator Info */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={recipe.creator.avatar}
              alt={recipe.creator.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            {recipe.creator.cookingLevel >= 80 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-cookbook-orange rounded-full flex items-center justify-center">
                <Flame className="w-3 h-3 text-white" />
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
          <button className="bg-cookbook-orange text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-cookbook-orange/90 transition-colors">
            Follow
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'ingredients'
                ? 'bg-white text-cookbook-orange shadow-sm'
                : 'text-gray-600 hover:text-cookbook-orange'
            }`}
          >
            Ingredients
          </button>
          <button
            onClick={() => setActiveTab('method')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'method'
                ? 'bg-white text-cookbook-orange shadow-sm'
                : 'text-gray-600 hover:text-cookbook-orange'
            }`}
          >
            Method
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-6">
        {activeTab === 'ingredients' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cookbook-black mb-4">Ingredients</h3>
            
            {recipe.ingredients.map((ingredient) => (
              <div key={ingredient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={ingredient.userHas}
                      onChange={() => handleMarkAsHave(ingredient.id)}
                      className="w-5 h-5 text-cookbook-green border-gray-300 rounded focus:ring-cookbook-green"
                    />
                    <div>
                      <h4 className="font-medium text-cookbook-black">
                        {ingredient.amount} {ingredient.unit} {ingredient.name}
                      </h4>
                      <p className="text-sm text-gray-500">₹{ingredient.price}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {ingredient.userHas && (
                    <span className="px-2 py-1 bg-cookbook-green/20 text-cookbook-green text-xs rounded-full font-medium">
                      I have this
                    </span>
                  )}
                  <button
                    onClick={() => handleBuyNow(ingredient.id)}
                    className="bg-cookbook-orange text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cookbook-orange/90 transition-colors flex items-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Total Price */}
            <div className="mt-6 p-4 bg-cookbook-yellow/10 border border-cookbook-yellow/20 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-cookbook-black">Total Ingredients Cost:</span>
                <span className="text-2xl font-bold text-cookbook-orange">
                  ₹{recipe.ingredients.reduce((sum, ing) => sum + ing.price, 0)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Add all missing ingredients to cart with one click
              </p>
            </div>
          </div>
        )}

        {activeTab === 'method' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-cookbook-black mb-4">Cooking Method</h3>
            
            {recipe.method.map((step) => (
              <div key={step.id} className="flex space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-cookbook-green text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {step.stepNumber}
                </div>
                <div className="flex-1">
                  <p className="text-cookbook-black mb-2">{step.description}</p>
                  {step.tips && (
                    <div className="bg-cookbook-yellow/10 border-l-4 border-cookbook-yellow p-3 rounded-r-lg">
                      <p className="text-sm text-cookbook-black">
                        <span className="font-medium">💡 Tip:</span> {step.tips}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{step.time} minutes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nutrition Info */}
      <div className="px-4 py-6 bg-gray-50">
        <h3 className="text-lg font-semibold text-cookbook-black mb-4">Nutrition Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl">
            <div className="text-2xl font-bold text-cookbook-orange">{recipe.nutrition.calories}</div>
            <div className="text-sm text-gray-600">Calories</div>
          </div>
          <div className="bg-white p-4 rounded-xl">
            <div className="text-2xl font-bold text-cookbook-green">{recipe.nutrition.protein}g</div>
            <div className="text-sm text-gray-600">Protein</div>
          </div>
          <div className="bg-white p-4 rounded-xl">
            <div className="text-2xl font-bold text-cookbook-yellow">{recipe.nutrition.carbs}g</div>
            <div className="text-sm text-gray-600">Carbs</div>
          </div>
          <div className="bg-white p-4 rounded-xl">
            <div className="text-2xl font-bold text-cookbook-orange">{recipe.nutrition.fat}g</div>
            <div className="text-sm text-gray-600">Fat</div>
          </div>
        </div>
      </div>

      {/* Buy Now Modal */}
      {showBuyNowModal && selectedIngredient && (
        <BuyNowModal
          ingredient={recipe.ingredients.find(i => i.id === selectedIngredient)!}
          onClose={() => setShowBuyNowModal(false)}
        />
      )}
    </div>
  );
};

export default RecipeDetail;
