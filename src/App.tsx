import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import KitchenFeed from './components/KitchenFeed';
import RecipeDetail from './components/RecipeDetail';
import RecipeCreate from './components/RecipeCreate';
import { Community } from './components/Community';
import RestaurantHub from './components/RestaurantHub';
import SmartPantry from './components/SmartPantry';
import MealPlanner from './components/MealPlanner';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import BottomNavigation from './components/BottomNavigation';
import DesignSystemDemo from './components/DesignSystemDemo';
import CreatorDashboard from './components/CreatorDashboard';
import ContentManager from './components/ContentManager';
import MonetizationTools from './components/MonetizationTools';
import CreatorProfile from './components/CreatorProfile';
import Login from './components/Login';
import AuthCallback from './components/AuthCallback';
import DatabaseSetup from './components/DatabaseSetup';
import Onboarding from './components/Onboarding';

// Sample data for Community component
const sampleGroups = [
  {
    id: '1',
    name: 'Indian Cooking Masters',
    description: 'Learn authentic Indian recipes from home chefs',
    coverPhoto: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    memberCount: 1247,
    activeNow: 23,
    isLive: true,
    tags: ['Indian', 'Vegetarian', 'Spicy', 'Traditional'],
    pinnedChallenges: [
      {
        id: 'ch1',
        title: 'Best Butter Chicken',
        description: 'Create your version of the classic butter chicken',
        deadline: new Date('2024-02-15'),
        participants: 45,
        prize: 'Featured Recipe Badge',
        isActive: true
      }
    ],
    topRecipes: [
      {
        id: 'r1',
        title: 'Spicy Paneer Tikka',
        creator: {
          id: 'u1',
          name: 'Chef Priya',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          verified: true,
          isOnline: true
        },
        thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        likes: 1247,
        remixes: 23,
        isRemix: false
      }
    ],
    weeklyPrompt: 'Share your favorite Indian spice blend recipe!'
  },
  {
    id: '2',
    name: 'Pizza Enthusiasts',
    description: 'Everything about making perfect pizza at home',
    coverPhoto: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    memberCount: 892,
    activeNow: 15,
    isLive: false,
    tags: ['Italian', 'Pizza', 'Dough', 'Cheese'],
    pinnedChallenges: [
      {
        id: 'ch2',
        title: 'Perfect Neapolitan Crust',
        description: 'Master the art of authentic Neapolitan pizza',
        deadline: new Date('2024-02-20'),
        participants: 32,
        prize: 'Pizza Master Badge',
        isActive: true
      }
    ],
    topRecipes: [
      {
        id: 'r2',
        title: 'Classic Margherita',
        creator: {
          id: 'u2',
          name: 'Pizza Master Marco',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          verified: true,
          isOnline: false
        },
        thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        likes: 2156,
        remixes: 45,
        isRemix: false
      }
    ],
    weeklyPrompt: 'What\'s your secret to the perfect pizza sauce?'
  },
  {
    id: '3',
    name: 'Healthy Meal Prep',
    description: 'Quick and nutritious meals for busy lifestyles',
    coverPhoto: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    memberCount: 2156,
    activeNow: 34,
    isLive: true,
    tags: ['Healthy', 'Meal Prep', 'Quick', 'Nutritious'],
    pinnedChallenges: [
      {
        id: 'ch3',
        title: '5-Day Meal Prep Challenge',
        description: 'Plan and prepare meals for an entire week',
        deadline: new Date('2024-02-25'),
        participants: 78,
        prize: 'Meal Prep Pro Badge',
        isActive: true
      }
    ],
    topRecipes: [
      {
        id: 'r3',
        title: 'Quinoa Buddha Bowl',
        creator: {
          id: 'u3',
          name: 'Health Coach Sarah',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          verified: true,
          isOnline: true
        },
        thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        likes: 892,
        remixes: 12,
        isRemix: false
      }
    ],
    weeklyPrompt: 'Share your go-to healthy breakfast recipe!'
  }
];

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App font-inter bg-white dark:bg-slate-900 min-h-screen transition-colors duration-300">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Login />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/database-setup" element={<DatabaseSetup />} />
              <Route path="/design-system" element={<DesignSystemDemo />} />
              
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
                  <Community 
                    groups={sampleGroups}
                    onJoinGroup={(groupId) => console.log('Join group:', groupId)}
                    onLeaveGroup={(groupId) => console.log('Leave group:', groupId)}
                    onJoinLiveRoom={(roomId) => console.log('Join live room:', roomId)}
                    onParticipateInChallenge={(challengeId) => console.log('Participate in challenge:', challengeId)}
                    onViewRecipe={(recipeId) => console.log('View recipe:', recipeId)}
                  />
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
