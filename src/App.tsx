import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import AuthCallback from './components/AuthCallback';
import KitchenFeed from './components/KitchenFeed';
import RecipeDetail from './components/RecipeDetail';
import Profile from './components/Profile';
import Community from './components/Community';
import RestaurantHub from './components/RestaurantHub';
import SmartPantry from './components/SmartPantry';
import MealPlanner from './components/MealPlanner';
import Notifications from './components/Notifications';
import BottomNavigation from './components/BottomNavigation';
import DatabaseSetup from './components/DatabaseSetup';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App font-inter bg-white dark:bg-slate-900 min-h-screen transition-colors duration-300">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/onboarding" element={<Onboarding />} />

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
          <Route path="/profile/:id" element={
            <div className="pb-20">
              <Profile />
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
          <Route path="/database-setup" element={<DatabaseSetup />} />
        </Routes>
              </div>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
