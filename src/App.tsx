import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import MVPKitchenFeed from './components/MVPKitchenFeed';
import RecipeDetail from './components/RecipeDetail';
import RecipeCreate from './components/RecipeCreate';
import Profile from './components/Profile';
import MVPBottomNavigation from './components/MVPBottomNavigation';
import Login from './components/Login';
import AuthCallback from './components/AuthCallback';
import Onboarding from './components/Onboarding';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ErrorBoundary>
            <div className="App font-inter bg-white dark:bg-slate-900 min-h-screen transition-colors duration-300">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Login />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                
                {/* Main App Routes - MVP Only */}
                <Route path="/feed" element={
                  <div className="pb-20">
                    <MVPKitchenFeed />
                    <MVPBottomNavigation />
                  </div>
                } />
                
                <Route path="/recipe/:id" element={
                  <div className="pb-20">
                    <RecipeDetail />
                    <MVPBottomNavigation />
                  </div>
                } />
                
                <Route path="/create" element={
                  <div className="pb-20">
                    <RecipeCreate />
                    <MVPBottomNavigation />
                  </div>
                } />
                
                <Route path="/profile/:id" element={
                  <div className="pb-20">
                    <Profile />
                    <MVPBottomNavigation />
                  </div>
                } />
              </Routes>
            </div>
          </ErrorBoundary>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
