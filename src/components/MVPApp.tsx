import React, { useState } from 'react';
import RecipeReels from './RecipeReels';
import SimpleRecipeCreate from './SimpleRecipeCreate';
import SimpleBottomNav from './SimpleBottomNav';

const MVPApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'feed' | 'create' | 'profile'>('feed');

  const handleBackToFeed = () => {
    setCurrentTab('feed');
  };

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'feed':
        return <RecipeReels onCreateClick={() => setCurrentTab('create')} />;
      case 'create':
        return <SimpleRecipeCreate onBackToFeed={handleBackToFeed} />;
      case 'profile':
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
            <div className="max-w-2xl mx-auto">
              {/* Profile Header */}
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-4xl">👨‍🍳</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Home Chef</h1>
                <p className="text-slate-600">Ready to cook amazing recipes!</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-orange-500">8</div>
                  <div className="text-sm text-slate-600">Recipes</div>
                </div>
                <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-green-500">3</div>
                  <div className="text-sm text-slate-600">Categories</div>
                </div>
                <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
                                              <div className="text-2xl font-bold text-blue-500">4</div>
                  <div className="text-sm text-slate-600">Achievements</div>
                </div>
              </div>

              {/* Achievements Section */}
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                  <span className="text-2xl">🏆</span>
                  <span>Achievements</span>
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'First Steps', icon: '👣', description: 'View your first recipe', unlocked: true },
                    { name: 'World Explorer', icon: '🌍', description: 'Explore 3+ cuisines', unlocked: true },
                    { name: 'Master Chef', icon: '👨‍🍳', description: 'Try a hard recipe', unlocked: false },
                    { name: 'Recipe Hunter', icon: '🔍', description: 'View 5+ recipes', unlocked: false }
                  ].map((achievement, index) => (
                    <div key={index} className={`p-3 rounded-xl border-2 ${
                      achievement.unlocked 
                        ? 'border-orange-200 bg-orange-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">{achievement.icon}</span>
                        <span className={`font-medium text-sm ${
                          achievement.unlocked ? 'text-orange-700' : 'text-gray-500'
                        }`}>
                          {achievement.name}
                        </span>
                      </div>
                      <p className={`text-xs ${
                        achievement.unlocked ? 'text-orange-600' : 'text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button onClick={() => setCurrentTab('create')} className="w-full px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors">
                  Create Your First Recipe
                </button>
                <button onClick={() => setCurrentTab('feed')} className="w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
                  Browse More Recipes
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <RecipeReels onCreateClick={() => setCurrentTab('create')} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentTab()}
      <SimpleBottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};

export default MVPApp;
