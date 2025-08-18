import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Bookmark, Share2, Clock, Users, Flame, Check, ShoppingCart, Globe } from 'lucide-react';
import { sampleRecipe } from '../data/sampleRecipe';

const RecipeDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'method'>('ingredients');
  const [currentLanguage, setCurrentLanguage] = useState('English');

  // In a real app, you'd fetch the recipe by ID
  const recipe = sampleRecipe;

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
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 dark:text-slate-300 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600 dark:text-slate-300 hover:text-orange-500 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 dark:text-slate-300 hover:text-orange-500 transition-colors">
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
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-slate-400" />
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
              <span>Serves: {recipe.servings}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4" />
              <span>{recipe.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="p-6 space-y-6">
        {/* Creator Info */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm">
            {recipe.creator.avatar ? (
              <img
                src={recipe.creator.avatar}
                alt={recipe.creator.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl">👨‍🍳</span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
              {recipe.creator.name}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {recipe.creator.bio}
            </p>
          </div>
        </div>

        {/* Recipe Description */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">About this recipe</h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 rounded-2xl p-1">
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'ingredients'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Ingredients ({recipe.ingredients.length})
          </button>
          <button
            onClick={() => setActiveTab('method')}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'method'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Method ({recipe.method.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'ingredients' ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Ingredients</h3>
            <div className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={ingredient.id} className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <button
                    onClick={() => handleMarkAsHave(ingredient.id)}
                    className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center hover:border-orange-500 transition-colors"
                  >
                    <Check className="w-4 h-4 text-orange-500 hidden" />
                  </button>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {ingredient.name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {ingredient.amount} {ingredient.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Method</h3>
            <div className="space-y-4">
              {recipe.method.map((step, index) => (
                <div key={step.id} className="flex space-x-4">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    {step.stepNumber}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {step.description}
                    </p>
                    {step.tips && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 italic">
                        💡 {step.tips}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nutrition Info */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Nutrition Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{recipe.nutrition.calories}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Calories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{recipe.nutrition.protein}g</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Protein</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{recipe.nutrition.carbs}g</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Carbs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{recipe.nutrition.fat}g</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Fat</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
