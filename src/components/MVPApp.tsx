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
                  <div className="min-h-screen bg-appetit-primary p-4">
          <div className="max-w-2xl mx-auto">
            {/* Profile Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 appetit-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-3xl">👨‍🍳</span>
              </div>
              <h1 className="text-3xl font-bold appetit-text-primary mb-2">Home Chef</h1>
              <p className="appetit-text-secondary">Ready to cook amazing recipes!</p>
            </div>

                          {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="appetit-card rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold appetit-orange">8</div>
                <div className="text-sm appetit-text-secondary">Recipes</div>
              </div>
              <div className="appetit-card rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-green-500">3</div>
                <div className="text-sm appetit-text-secondary">Categories</div>
              </div>
              <div className="appetit-card rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-500">4</div>
                <div className="text-sm appetit-text-secondary">Achievements</div>
              </div>
            </div>

              {/* Achievements Section */}
              <div className="appetit-card rounded-2xl p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2 appetit-text-primary">
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
                        ? 'border-appetit-orange/30 bg-appetit-orange-light' 
                        : 'border-appetit-purple/20 bg-appetit-purple-light'
                    }`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">{achievement.icon}</span>
                        <span className={`font-medium text-sm ${
                          achievement.unlocked ? 'appetit-orange' : 'appetit-text-secondary'
                        }`}>
                          {achievement.name}
                        </span>
                      </div>
                      <p className={`text-xs ${
                        achievement.unlocked ? 'appetit-orange' : 'appetit-text-tertiary'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button onClick={() => setCurrentTab('create')} className="appetit-button-primary w-full">
                  Create Your First Recipe
                </button>
                <button onClick={() => setCurrentTab('feed')} className="appetit-button-secondary w-full">
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
