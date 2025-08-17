import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import KitchenFeed from './components/KitchenFeed';
import RecipeDetail from './components/RecipeDetail';
import Profile from './components/Profile';
import Community from './components/Community';
import RestaurantHub from './components/RestaurantHub';
import SmartPantry from './components/SmartPantry';
import MealPlanner from './components/MealPlanner';
import Notifications from './components/Notifications';
import Onboarding from './components/Onboarding';
import Login from './components/Login';
import AuthCallback from './components/AuthCallback';
import DatabaseSetup from './components/DatabaseSetup';
import RecipeCreate from './components/RecipeCreate';
// import CreatorDashboard from './components/CreatorDashboard';
// import ContentManager from './components/ContentManager';
// import MonetizationTools from './components/MonetizationTools';
// import CreatorProfile from './components/CreatorProfile';
import BottomNavigation from './components/BottomNavigation';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App font-inter bg-white dark:bg-slate-900 min-h-screen transition-colors duration-300">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Onboarding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/database-setup" element={<DatabaseSetup />} />
              
              {/* Main App Routes */}
              <Route path="/feed" element={
                <div className="pb-20">
                  <KitchenFeed />
                  <BottomNavigation />
                </div>
              } />
              
              <Route path="/recipe/:id" element={
                <div className="pb-20">
                  <RecipeDetail />
                  <BottomNavigation />
                </div>
              } />
              
              <Route path="/create" element={
                <div className="pb-20">
                  <RecipeCreate />
                  <BottomNavigation />
                </div>
              } />
              
              <Route path="/community" element={
                <div className="pb-20">
                  <Community />
                  <BottomNavigation />
                </div>
              } />
              
              <Route path="/restaurants" element={
                <div className="pb-20">
                  <RestaurantHub />
                  <BottomNavigation />
                </div>
              } />
              
              <Route path="/pantry" element={
                <div className="pb-20">
                  <SmartPantry />
                  <BottomNavigation />
                </div>
              } />
              
              <Route path="/meal-planner" element={
                <div className="pb-20">
                  <MealPlanner />
                  <BottomNavigation />
                </div>
              } />
              
              <Route path="/notifications" element={
                <div className="pb-20">
                  <Notifications />
                  <BottomNavigation />
                </div>
              } />
              
              <Route path="/profile/:id" element={
                <div className="pb-20">
                  <Profile />
                  <BottomNavigation />
                </div>
              } />
              
              {/* Creator Tools Routes - Temporarily Commented Out */}
              {/* <Route path="/creator/dashboard" element={
                <div className="pb-20">
                  <CreatorDashboard />
                  <BottomNavigation />
                </div>
              } />
              
              <Route path="/creator/content" element={
                <div className="pb-20">
                  <ContentManager />
                  <BottomNavigation />
                </div>
              } />
              
              <Route path="/creator/monetization" element={
                <div className="pb-20">
                  <MonetizationTools />
                  <BottomNavigation />
                </div>
              } />
              
              <Route path="/creator/profile" element={
                <div className="pb-20">
                  <CreatorProfile />
                  <BottomNavigation />
                </div>
              } /> */}
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
