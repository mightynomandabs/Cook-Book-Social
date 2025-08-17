import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WebGLMotionSystem } from './WebGLMotionSystem';
import { RecipeReel } from './RecipeReel';
import { GamificationSystem } from './GamificationSystem';
import { Community } from './Community';
import { HeatShimmer, BokehSteam, LiquidFill, ParticleEmitter, Badge3D } from './WebGLMotionSystem';

// Sample data for demos
const sampleRecipes = [
  {
    id: '1',
    title: 'Spicy Paneer Tikka with Mint Chutney',
    creator: {
      name: 'Chef Priya',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      verified: true
    },
    video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop',
    duration: 45,
    likes: 1247,
    saves: 89,
    comments: 23,
    shares: 12,
    ingredients: ['Paneer', 'Yogurt', 'Garam Masala', 'Red Chili Powder', 'Ginger Garlic Paste'],
    steps: [
      'Marinate paneer in spiced yogurt mixture',
      'Thread onto skewers and grill until charred',
      'Serve hot with mint chutney and onion rings'
    ],
    tags: ['Indian', 'Vegetarian', 'Grilled', 'Spicy'],
    difficulty: 'Medium' as const,
    timeToCook: '45 min',
    cuisine: 'Indian'
  },
  {
    id: '2',
    title: 'Classic Margherita Pizza from Scratch',
    creator: {
      name: 'Pizza Master Marco',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      verified: true
    },
    video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop',
    duration: 60,
    likes: 2156,
    saves: 156,
    comments: 45,
    shares: 28,
    ingredients: ['Flour', 'Fresh Mozzarella', 'San Marzano Tomatoes', 'Fresh Basil', 'Extra Virgin Olive Oil'],
    steps: [
      'Make pizza dough and let it rise',
      'Stretch dough and add toppings',
      'Bake in hot oven until crispy'
    ],
    tags: ['Italian', 'Pizza', 'Homemade', 'Classic'],
    difficulty: 'Hard' as const,
    timeToCook: '2 hours',
    cuisine: 'Italian'
  }
];

const sampleUserStats = {
  level: 15,
  xp: 1250,
  xpToNext: 2000,
  streak: 23,
  totalRecipes: 47,
  totalLikes: 1247,
  totalSaves: 89,
  totalComments: 23,
  totalShares: 12,
  badges: [
    {
      id: '1',
      name: 'Tandoor Ace',
      description: 'Mastered 10 Indian recipes',
      icon: '🔥',
      category: 'cuisine' as const,
      rarity: 'rare' as const,
      unlockedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Dessert Maestro',
      description: 'Created 5 dessert recipes',
      icon: '🍰',
      category: 'skill' as const,
      rarity: 'epic' as const,
      unlockedAt: new Date('2024-01-20')
    },
    {
      id: '3',
      name: 'Social Butterfly',
      description: 'Interacted with 100+ recipes',
      icon: '🦋',
      category: 'social' as const,
      rarity: 'common' as const,
      unlockedAt: new Date('2024-01-10')
    }
  ],
  activeQuests: [
    {
      id: '1',
      title: 'Veggie Week',
      description: 'Cook 3 vegetarian dishes this week',
      type: 'weekly' as const,
      target: 3,
      current: 2,
      reward: { xp: 150, badge: 'Veggie Lover' },
      expiresAt: new Date('2024-01-28'),
      isCompleted: false
    },
    {
      id: '2',
      title: 'Spice Master',
      description: 'Use 5 different spices in one recipe',
      type: 'daily' as const,
      target: 5,
      current: 3,
      reward: { xp: 75 },
      expiresAt: new Date('2024-01-22'),
      isCompleted: false
    }
  ],
  completedQuests: []
};

const sampleGroups = [
  {
    id: '1',
    name: 'Indian Cooking Masters',
    description: 'A community for lovers of Indian cuisine. Share recipes, tips, and techniques for authentic Indian cooking.',
    coverPhoto: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    memberCount: 1247,
    activeNow: 23,
    tags: ['Indian', 'Spicy', 'Traditional', 'Vegetarian'],
    isLive: true,
    liveRoom: {
      id: '1',
      title: 'Tandoor Secrets Revealed',
      host: {
        id: '1',
        name: 'Chef Priya',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        verified: true,
        isOnline: true
      },
      participants: [
        {
          id: '1',
          name: 'Chef Priya',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          verified: true,
          isOnline: true
        }
      ],
      isAudioOnly: true,
      currentTopic: 'Perfect Tandoori Chicken',
      duration: 45
    },
    pinnedChallenges: [
      {
        id: '1',
        title: 'Spice Challenge',
        description: 'Create a recipe using at least 5 different spices',
        deadline: new Date('2024-01-28'),
        participants: 45,
        prize: 'Exclusive Spice Master Badge',
        isActive: true
      }
    ],
    topRecipes: [
      {
        id: '1',
        title: 'Spicy Paneer Tikka',
        creator: {
          id: '1',
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
    weeklyPrompt: 'Create a fusion dish combining Indian and Italian flavors'
  },
  {
    id: '2',
    name: 'Pizza Night Enthusiasts',
    description: 'For pizza lovers who want to perfect their dough, sauce, and topping game.',
    coverPhoto: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    memberCount: 892,
    activeNow: 15,
    tags: ['Pizza', 'Italian', 'Dough', 'Homemade'],
    isLive: false,
    pinnedChallenges: [
      {
        id: '2',
        title: 'Perfect Crust',
        description: 'Bake a pizza with the perfect crispy crust',
        deadline: new Date('2024-01-30'),
        participants: 67,
        prize: 'Crust Master Badge',
        isActive: true
      }
    ],
    topRecipes: [
      {
        id: '2',
        title: 'Classic Margherita',
        creator: {
          id: '2',
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
    weeklyPrompt: 'Create a dessert pizza with sweet toppings'
  }
];

export const DesignSystemDemo: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'motion' | 'reel' | 'gamification' | 'community'>('motion');
  const [showParticleDemo, setShowParticleDemo] = useState(false);
  const [showBadgeDemo, setShowBadgeDemo] = useState(false);

  const sections = [
    { id: 'motion', label: 'WebGL Motion', icon: '🎨' },
    { id: 'reel', label: 'Recipe Reel', icon: '📱' },
    { id: 'gamification', label: 'Gamification', icon: '🏆' },
    { id: 'community', label: 'Community', icon: '👥' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                CookBook Design System
              </h1>
              <p className="text-gray-600">Advanced WebGL Motion, Gamification & Community Features</p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => setShowParticleDemo(true)}
                className="bg-gradient-primary text-white px-4 py-2 rounded-xl font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Particle Demo
              </motion.button>
              <motion.button
                onClick={() => setShowBadgeDemo(true)}
                className="bg-gradient-primary text-white px-4 py-2 rounded-xl font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Badge Demo
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1 py-2">
            {sections.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeSection === id
                    ? 'bg-gradient-primary text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeSection === 'motion' && (
            <motion.div
              key="motion"
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">WebGL Motion System</h2>
                <p className="text-xl text-gray-600">Advanced visual effects with performance optimization</p>
              </div>

              {/* Heat Shimmer Demo */}
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Heat Shimmer Effect</h3>
                <HeatShimmer intensity={0.03} speed={3}>
                  <div className="bg-gradient-primary text-white p-8 rounded-2xl text-center">
                    <h4 className="text-3xl font-bold mb-4">CookBook App</h4>
                    <p className="text-lg">Where foodies find their feed</p>
                  </div>
                </HeatShimmer>
              </div>

              {/* Bokeh Steam Demo */}
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Bokeh Steam Particles</h3>
                <div className="relative h-64 bg-gradient-to-b from-blue-900 to-purple-900 rounded-2xl">
                  <BokehSteam particleCount={80} intensity={1.5} />
                  <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="text-white text-center">
                      <h4 className="text-2xl font-bold mb-2">Steamy Kitchen</h4>
                      <p className="text-blue-200">Watch the magic happen</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Liquid Fill Demo */}
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Liquid Fill Progress</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Level Progress</h4>
                    <LiquidFill progress={75} height={16} className="w-full" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Recipe Completion</h4>
                    <LiquidFill progress={45} height={12} className="w-full" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Challenge Progress</h4>
                    <LiquidFill progress={90} height={20} className="w-full" />
                  </div>
                </div>
              </div>

              {/* Performance Monitor */}
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Performance Monitoring</h3>
                <WebGLMotionSystem />
              </div>
            </motion.div>
          )}

          {activeSection === 'reel' && (
            <motion.div
              key="reel"
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">TikTok-Style Recipe Reel</h2>
                <p className="text-xl text-gray-600">Vertical scrolling with advanced interactions</p>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <RecipeReel
                  recipes={sampleRecipes}
                  onLike={(id) => console.log('Liked:', id)}
                  onSave={(id) => console.log('Saved:', id)}
                  onComment={(id) => console.log('Comment:', id)}
                  onShare={(id) => console.log('Share:', id)}
                  onRemix={(id) => console.log('Remix:', id)}
                />
              </div>
            </motion.div>
          )}

          {activeSection === 'gamification' && (
            <motion.div
              key="gamification"
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Gamification System</h2>
                <p className="text-xl text-gray-600">Streaks, levels, badges, and quests</p>
              </div>

              <GamificationSystem
                userStats={sampleUserStats}
                onLevelUp={(level) => console.log('Level up to:', level)}
                onBadgeUnlocked={(badge) => console.log('Badge unlocked:', badge.name)}
                onQuestCompleted={(quest) => console.log('Quest completed:', quest.title)}
              />
            </motion.div>
          )}

          {activeSection === 'community' && (
            <motion.div
              key="community"
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Community & Groups</h2>
                <p className="text-xl text-gray-600">Connect, share, and grow together</p>
              </div>

              <Community
                groups={sampleGroups}
                onJoinGroup={(id) => console.log('Join group:', id)}
                onLeaveGroup={(id) => console.log('Leave group:', id)}
                onJoinLiveRoom={(id) => console.log('Join live room:', id)}
                onParticipateInChallenge={(id) => console.log('Participate in challenge:', id)}
                onViewRecipe={(id) => console.log('View recipe:', id)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Particle Demo Modal */}
      <AnimatePresence>
        {showParticleDemo && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowParticleDemo(false)}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 max-w-md w-full text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Particle Effects Demo</h3>
              <div className="relative h-64 bg-gradient-to-b from-purple-900 to-pink-900 rounded-2xl mb-6">
                <ParticleEmitter
                  isActive={true}
                  particleCount={30}
                  colors={['#FF7A00', '#FF3D71', '#FFD166', '#22C55E']}
                  onComplete={() => setShowParticleDemo(false)}
                />
              </div>
              <p className="text-gray-600 mb-4">Watch the particle explosion!</p>
              <button
                onClick={() => setShowParticleDemo(false)}
                className="bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge Demo Modal */}
      <AnimatePresence>
        {showBadgeDemo && (
          <Badge3D
            isVisible={showBadgeDemo}
            icon="🏆"
            title="Design System Master!"
            subtitle="You've explored all the features"
            onComplete={() => setShowBadgeDemo(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DesignSystemDemo;
