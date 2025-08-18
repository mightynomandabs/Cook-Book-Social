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
            <div className="max-w-md mx-auto text-center pt-20">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">👨‍🍳</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Your Profile</h1>
              <p className="text-slate-600 mb-8">This is where your recipes will appear</p>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Coming Soon!</h2>
                <p className="text-slate-600 mb-4">
                  Create some recipes first, then they'll show up here in your profile.
                </p>
                <button
                  onClick={() => setCurrentTab('create')}
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                >
                  Create Your First Recipe
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
