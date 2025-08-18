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
          <div className="min-h-screen bg-dark-primary p-4">
            <div className="max-w-2xl mx-auto">
              {/* Profile Header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-3xl">👨‍🍳</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Home Chef</h1>
                <p className="text-gray-400">Ready to cook amazing recipes!</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="glass-effect rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-pink-500">8</div>
                  <div className="text-sm text-gray-400">Recipes</div>
                </div>
                <div className="glass-effect rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-500">3</div>
                  <div className="text-sm text-gray-400">Categories</div>
                </div>
                <div className="glass-effect rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-500">4</div>
                  <div className="text-sm text-gray-400">Achievements</div>
                </div>
              </div>

              {/* Achievements Section */}
              <div className="glass-effect rounded-2xl p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-white">
                  <span className="text-2xl">🏆</span>
                  <span>Achievements</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: 'First Steps', icon: '👣', description: 'View your first recipe', unlocked: true },
                    { name: 'World Explorer', icon: '🌍', description: 'Explore 3+ cuisines', unlocked: true },
                    { name: 'Master Chef', icon: '👨‍🍳', description: 'Try a hard recipe', unlocked: false },
                    { name: 'Recipe Hunter', icon: '🔍', description: 'View 5+ recipes', unlocked: false }
                  ].map((achievement, index) => (
                    <div key={index} className={`p-3 rounded-xl border-2 ${
                      achievement.unlocked 
                        ? 'border-pink-500/30 bg-pink-500/10' 
                        : 'border-gray-600 bg-gray-800/50'
                    }`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">{achievement.icon}</span>
                        <span className={`font-medium text-sm ${
                          achievement.unlocked ? 'text-pink-400' : 'text-gray-500'
                        }`}>
                          {achievement.name}
                        </span>
                      </div>
                      <p className={`text-xs ${
                        achievement.unlocked ? 'text-pink-300' : 'text-gray-600'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button onClick={() => setCurrentTab('create')} className="w-full px-6 py-3 pink-gradient text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
                  Create Your First Recipe
                </button>
                <button onClick={() => setCurrentTab('feed')} className="w-full px-6 py-3 glass-effect text-white rounded-xl font-semibold hover:glass-effect-hover transition-all">
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
