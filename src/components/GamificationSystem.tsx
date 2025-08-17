import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, Star, Target, Zap, Crown, Award, TrendingUp, ChefHat, Heart, Bookmark, MessageCircle } from 'lucide-react';
import { LiquidFill } from './WebGLMotionSystem';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'cuisine' | 'achievement' | 'social' | 'skill';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress?: number; // 0-100 for progress-based badges
}

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'achievement';
  target: number;
  current: number;
  reward: {
    xp: number;
    badge?: string;
    perk?: string;
  };
  expiresAt?: Date;
  isCompleted: boolean;
}

interface UserStats {
  level: number;
  xp: number;
  xpToNext: number;
  streak: number;
  totalRecipes: number;
  totalLikes: number;
  totalSaves: number;
  totalComments: number;
  totalShares: number;
  badges: Badge[];
  activeQuests: Quest[];
  completedQuests: Quest[];
}

interface GamificationSystemProps {
  userStats: UserStats;
  onLevelUp?: (newLevel: number) => void;
  onBadgeUnlocked?: (badge: Badge) => void;
  onQuestCompleted?: (quest: Quest) => void;
}

export const GamificationSystem: React.FC<GamificationSystemProps> = ({
  userStats,
  onLevelUp,
  onBadgeUnlocked,
  onQuestCompleted
}) => {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showBadge, setShowBadge] = useState<Badge | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'quests' | 'leaderboard'>('overview');

  // Calculate level progress
  const levelProgress = (userStats.xp / userStats.xpToNext) * 100;

  // Get streak emoji based on length
  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🔥🔥🔥';
    if (streak >= 20) return '🔥🔥';
    if (streak >= 10) return '🔥';
    if (streak >= 5) return '⚡';
    return '💪';
  };

  // Get level title
  const getLevelTitle = (level: number) => {
    if (level >= 50) return 'Legendary Chef';
    if (level >= 40) return 'Master Chef';
    if (level >= 30) return 'Expert Chef';
    if (level >= 20) return 'Advanced Chef';
    if (level >= 10) return 'Intermediate Chef';
    return 'Novice Chef';
  };

  // Get rarity color
  const getRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      case 'common': return 'from-gray-400 to-gray-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  // Level Up Animation
  const LevelUpModal: React.FC<{ level: number; onClose: () => void }> = ({ level, onClose }) => (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative bg-white rounded-3xl p-8 text-center max-w-md mx-4"
        initial={{ scale: 0, rotateY: -90 }}
        animate={{ scale: 1, rotateY: 0 }}
        exit={{ scale: 0, rotateY: 90 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Level Badge */}
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <span className="text-4xl font-bold text-white">{level}</span>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Level Up!
        </motion.h2>

        <motion.p
          className="text-lg text-gray-600 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          You're now a <span className="font-semibold text-orange-500">{getLevelTitle(level)}</span>!
        </motion.p>

        {/* New Perks */}
        <motion.div
          className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-semibold text-gray-800 mb-2">New Perks Unlocked!</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✨ Access to premium recipes</li>
            <li>🎯 Advanced cooking challenges</li>
            <li>🏆 Exclusive badge opportunities</li>
          </ul>
        </motion.div>

        {/* Continue Button */}
        <motion.button
          onClick={onClose}
          className="bg-gradient-primary text-white px-8 py-3 rounded-xl font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Continue Cooking!
        </motion.button>
      </motion.div>
    </motion.div>
  );

  // Badge Unlock Modal
  const BadgeModal: React.FC<{ badge: Badge; onClose: () => void }> = ({ badge, onClose }) => (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative bg-white rounded-3xl p-8 text-center max-w-md mx-4"
        initial={{ scale: 0, rotateY: -90 }}
        animate={{ scale: 1, rotateY: 0 }}
        exit={{ scale: 0, rotateY: 90 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Badge Icon */}
        <motion.div
          className={`w-24 h-24 bg-gradient-to-br ${getRarityColor(badge.rarity)} rounded-full flex items-center justify-center mx-auto mb-6`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <span className="text-4xl">{badge.icon}</span>
        </motion.div>

        {/* Badge Info */}
        <motion.h2
          className="text-2xl font-bold text-gray-800 mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {badge.name}
        </motion.h2>

        <motion.p
          className="text-gray-600 mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {badge.description}
        </motion.p>

        {/* Rarity Badge */}
        <motion.div
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getRarityColor(badge.rarity)} mb-6`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {badge.rarity.toUpperCase()}
        </motion.div>

        {/* Continue Button */}
        <motion.button
          onClick={onClose}
          className="bg-gradient-primary text-white px-8 py-3 rounded-xl font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Awesome!
        </motion.button>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Your Cooking Journey</h1>
              <p className="text-gray-600">Keep the flame alive! 🔥</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-500">{getStreakEmoji(userStats.streak)}</div>
              <div className="text-sm text-gray-600">{userStats.streak} day streak</div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Level {userStats.level} • {getLevelTitle(userStats.level)}
                </h2>
                <p className="text-gray-600">{userStats.xp} / {userStats.xpToNext} XP</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-orange-500">{userStats.level}</div>
                <div className="text-sm text-gray-600">Current Level</div>
              </div>
            </div>
            
            {/* XP Bar */}
            <LiquidFill
              progress={levelProgress}
              height={12}
              color="var(--cb-gradient-primary)"
              className="w-full"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-2 mb-6 shadow-lg">
          <div className="flex space-x-1">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'badges', label: 'Badges', icon: Award },
              { id: 'quests', label: 'Quests', icon: Target },
              { id: 'leaderboard', label: 'Leaderboard', icon: Crown }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id
                    ? 'bg-gradient-primary text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Recipes', value: userStats.totalRecipes, icon: ChefHat, color: 'from-blue-400 to-cyan-500' },
                  { label: 'Likes', value: userStats.totalLikes, icon: Heart, color: 'from-red-400 to-pink-500' },
                  { label: 'Saves', value: userStats.totalSaves, icon: Bookmark, color: 'from-green-400 to-emerald-500' },
                  { label: 'Comments', value: userStats.totalComments, icon: MessageCircle, color: 'from-purple-400 to-pink-500' }
                ].map(({ label, value, icon: Icon, color }) => (
                  <motion.div
                    key={label}
                    className="bg-white rounded-2xl p-4 text-center shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{value.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Achievements */}
              <div className="bg-white rounded-3xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Achievements</h3>
                <div className="space-y-3">
                  {userStats.badges
                    .filter(badge => badge.unlockedAt)
                    .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
                    .slice(0, 3)
                    .map(badge => (
                      <div key={badge.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                        <div className={`w-10 h-10 bg-gradient-to-br ${getRarityColor(badge.rarity)} rounded-full flex items-center justify-center`}>
                          <span className="text-lg">{badge.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{badge.name}</div>
                          <div className="text-sm text-gray-600">{badge.description}</div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(badge.unlockedAt!).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'badges' && (
            <motion.div
              key="badges"
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Badge Categories */}
              <div className="bg-white rounded-3xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Badge Collection</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {userStats.badges.map(badge => (
                    <motion.div
                      key={badge.id}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        badge.unlockedAt
                          ? 'border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50'
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => badge.unlockedAt && setShowBadge(badge)}
                    >
                      <div className={`w-16 h-16 bg-gradient-to-br ${getRarityColor(badge.rarity)} rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <span className="text-2xl">{badge.icon}</span>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-800 mb-1">{badge.name}</div>
                        <div className="text-xs text-gray-600 line-clamp-2">{badge.description}</div>
                        {badge.progress !== undefined && (
                          <div className="mt-2">
                            <LiquidFill
                              progress={badge.progress}
                              height={4}
                              className="w-full"
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'quests' && (
            <motion.div
              key="quests"
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Active Quests */}
              <div className="bg-white rounded-3xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Active Quests</h3>
                <div className="space-y-4">
                  {userStats.activeQuests.map(quest => (
                    <div key={quest.id} className="p-4 border border-gray-200 rounded-2xl">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800">{quest.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          quest.type === 'daily' ? 'bg-blue-100 text-blue-700' :
                          quest.type === 'weekly' ? 'bg-purple-100 text-purple-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {quest.type}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{quest.description}</p>
                      
                      {/* Progress */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">
                          {quest.current} / {quest.target}
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          {Math.round((quest.current / quest.target) * 100)}%
                        </span>
                      </div>
                      
                      <LiquidFill
                        progress={(quest.current / quest.target) * 100}
                        height={8}
                        className="w-full"
                      />
                      
                      {/* Reward */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Reward:</span>
                          <div className="flex items-center space-x-1">
                            <Zap size={16} className="text-yellow-500" />
                            <span className="text-sm font-medium text-gray-800">{quest.reward.xp} XP</span>
                          </div>
                        </div>
                        {quest.reward.badge && (
                          <div className="text-xs text-gray-500">+ Badge</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-3xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Leaderboard</h3>
                <p className="text-gray-600 text-center py-8">
                  Leaderboards coming soon! Compete with your cooking community.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showLevelUp && (
          <LevelUpModal
            level={userStats.level}
            onClose={() => setShowLevelUp(false)}
          />
        )}
        
        {showBadge && (
          <BadgeModal
            badge={showBadge}
            onClose={() => setShowBadge(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamificationSystem;
