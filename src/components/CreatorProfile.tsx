import React, { useState, useEffect } from 'react';
import { 
  Edit, 
  Settings, 
  BarChart3, 
  DollarSign, 
  Users, 
  Heart, 
  Bookmark, 
  MessageCircle,
  TrendingUp,
  Award,
  Star,
  Crown,
  Zap,
  Calendar,
  Target,
  ExternalLink,
  Plus,
  Camera,
  Video,
  Image as ImageIcon
} from 'lucide-react';
import { supabase, TABLES } from '../lib/supabase';

interface CreatorStats {
  totalRecipes: number;
  totalViews: number;
  totalLikes: number;
  totalSaves: number;
  totalComments: number;
  totalFollowers: number;
  totalFollowing: number;
  monthlyGrowth: number;
  engagementRate: number;
  averageViews: number;
  topRecipeViews: number;
}

interface CreatorAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt: Date;
  progress?: number;
  target?: number;
}

interface CreatorMilestone {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'follower' | 'recipe' | 'engagement' | 'revenue';
  value: number;
}

const CreatorProfile: React.FC = () => {
  const [stats, setStats] = useState<CreatorStats>({
    totalRecipes: 0,
    totalViews: 0,
    totalLikes: 0,
    totalSaves: 0,
    totalComments: 0,
    totalFollowers: 0,
    totalFollowing: 0,
    monthlyGrowth: 0,
    engagementRate: 0,
    averageViews: 0,
    topRecipeViews: 0
  });
  const [achievements, setAchievements] = useState<CreatorAchievement[]>([]);
  const [milestones, setMilestones] = useState<CreatorMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'achievements' | 'settings'>('overview');

  // Mock creator ID - in real app, get from auth context
  const creatorId = '11111111-1111-1111-1111-111111111111';

  useEffect(() => {
    fetchCreatorData();
  }, []);

  const fetchCreatorData = async () => {
    try {
      setLoading(true);
      
      // Fetch creator stats from Supabase
      const { data: recipes, error } = await supabase
        .from(TABLES.RECIPES)
        .select('views_count, likes_count, saves_count, comments_count')
        .eq('creator_id', creatorId);

      if (error) throw error;

      // Calculate stats
      const totalViews = recipes?.reduce((sum, recipe) => sum + (recipe.views_count || 0), 0) || 0;
      const totalLikes = recipes?.reduce((sum, recipe) => sum + (recipe.likes_count || 0), 0) || 0;
      const totalSaves = recipes?.reduce((sum, recipe) => sum + (recipe.saves_count || 0), 0) || 0;
      const totalComments = recipes?.reduce((sum, recipe) => sum + (recipe.comments_count || 0), 0) || 0;
      const totalRecipes = recipes?.length || 0;
      
      // Mock data for other stats
      const totalFollowers = 15420;
      const totalFollowing = 892;
      const monthlyGrowth = 12.5;
      const engagementRate = totalViews > 0 ? ((totalLikes + totalSaves + totalComments) / totalViews) * 100 : 0;
      const averageViews = totalRecipes > 0 ? totalViews / totalRecipes : 0;
      const topRecipeViews = Math.max(...(recipes?.map(r => r.views_count || 0) || [0]));

      setStats({
        totalRecipes,
        totalViews,
        totalLikes,
        totalSaves,
        totalComments,
        totalFollowers,
        totalFollowing,
        monthlyGrowth,
        engagementRate,
        averageViews,
        topRecipeViews
      });

      // Mock achievements
      const mockAchievements: CreatorAchievement[] = [
        {
          id: '1',
          name: 'Recipe Master',
          description: 'Created 50+ recipes',
          icon: '🍳',
          color: 'bg-cookbook-orange',
          unlockedAt: new Date('2024-01-15'),
          progress: 156,
          target: 50
        },
        {
          id: '2',
          name: 'Viral Sensation',
          description: 'Recipe with 100K+ views',
          icon: '🔥',
          color: 'bg-red-500',
          unlockedAt: new Date('2024-01-20')
        },
        {
          id: '3',
          name: 'Community Builder',
          description: 'Reached 10K followers',
          icon: '👥',
          color: 'bg-blue-500',
          unlockedAt: new Date('2024-01-10'),
          progress: 15420,
          target: 10000
        },
        {
          id: '4',
          name: 'Engagement Expert',
          description: 'Achieved 5%+ engagement rate',
          icon: '💬',
          color: 'bg-green-500',
          unlockedAt: new Date('2024-01-25'),
          progress: 6.8,
          target: 5
        }
      ];

      setAchievements(mockAchievements);

      // Mock milestones
      const mockMilestones: CreatorMilestone[] = [
        {
          id: '1',
          title: 'First Recipe Published',
          description: 'Started your cooking journey',
          date: new Date('2023-12-01'),
          type: 'recipe',
          value: 1
        },
        {
          id: '2',
          title: '100 Followers',
          description: 'Building your community',
          date: new Date('2023-12-15'),
          type: 'follower',
          value: 100
        },
        {
          id: '3',
          title: '1K Recipe Views',
          description: 'Content gaining traction',
          date: new Date('2024-01-01'),
          type: 'engagement',
          value: 1000
        },
        {
          id: '4',
          title: 'First Brand Partnership',
          description: 'Monetization milestone',
          date: new Date('2024-01-15'),
          type: 'revenue',
          value: 2500
        }
      ];

      setMilestones(mockMilestones);
    } catch (error) {
      console.error('Error fetching creator data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, changeType, color = 'bg-cookbook-orange' }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    change?: string;
    changeType?: 'positive' | 'negative';
    color?: string;
  }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'positive' ? '↗' : '↘'} {change}
            </p>
          )}
        </div>
        <div className={`p-3 ${color}/10 rounded-lg`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  );

  const AchievementCard = ({ achievement }: { achievement: CreatorAchievement }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center space-x-4">
        <div className={`w-16 h-16 ${achievement.color} rounded-xl flex items-center justify-center text-3xl`}>
          {achievement.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{achievement.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
          {achievement.progress !== undefined && achievement.target && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Progress</span>
                <span className="font-medium">{achievement.progress.toLocaleString()} / {achievement.target.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${achievement.color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Unlocked</p>
          <p className="text-sm font-medium text-gray-900">
            {achievement.unlockedAt.toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );

  const MilestoneCard = ({ milestone }: { milestone: CreatorMilestone }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          milestone.type === 'follower' ? 'bg-blue-100 text-blue-600' :
          milestone.type === 'recipe' ? 'bg-cookbook-orange/10 text-cookbook-orange' :
          milestone.type === 'engagement' ? 'bg-green-100 text-green-600' :
          'bg-yellow-100 text-yellow-600'
        }`}>
          {milestone.type === 'follower' ? <Users className="w-6 h-6" /> :
           milestone.type === 'recipe' ? <ImageIcon className="w-6 h-6" /> :
           milestone.type === 'engagement' ? <Heart className="w-6 h-6" /> :
           <DollarSign className="w-6 h-6" />}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{milestone.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {milestone.date.toLocaleDateString()}
            </span>
            <span className="text-sm font-medium text-gray-900">
              {milestone.value.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-xl mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-cookbook-orange to-cookbook-yellow rounded-full flex items-center justify-center text-3xl text-white font-bold">
                CP
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-cookbook-orange rounded-full flex items-center justify-center text-white hover:bg-cookbook-orange/90 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Chef Priya</h1>
                <div className="flex items-center space-x-1 px-3 py-1 bg-cookbook-orange/10 rounded-full">
                  <Crown className="w-4 h-4 text-cookbook-orange" />
                  <span className="text-sm font-medium text-cookbook-orange">Verified Creator</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4 max-w-2xl">
                Passionate home chef from Mumbai. Love experimenting with fusion recipes! 
                Creating content that inspires home cooks to explore new cuisines and techniques.
              </p>
              
              <div className="flex items-center space-x-6 text-sm">
                <span className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{stats.totalFollowers.toLocaleString()}</span>
                  <span className="text-gray-500">followers</span>
                </span>
                <span className="flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{stats.totalRecipes}</span>
                  <span className="text-gray-500">recipes</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{stats.totalLikes.toLocaleString()}</span>
                  <span className="text-gray-500">likes</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button className="px-6 py-3 bg-cookbook-orange text-white rounded-lg hover:bg-cookbook-orange/90 transition-colors font-medium">
                <Plus className="w-4 h-4 inline mr-2" />
                Create Recipe
              </button>
              <button className="p-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {([
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'achievements', label: 'Achievements', icon: Award },
              { id: 'settings', label: 'Settings', icon: Settings }
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-cookbook-orange text-cookbook-orange'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Recipes"
                value={stats.totalRecipes}
                icon={ImageIcon}
                change={`+${Math.floor(Math.random() * 5) + 1} this month`}
                changeType="positive"
                color="bg-cookbook-orange"
              />
              <StatCard
                title="Total Views"
                value={stats.totalViews.toLocaleString()}
                icon={BarChart3}
                change={`+${stats.monthlyGrowth}%`}
                changeType="positive"
                color="bg-blue-500"
              />
              <StatCard
                title="Total Followers"
                value={stats.totalFollowers.toLocaleString()}
                icon={Users}
                change={`+${Math.floor(Math.random() * 200) + 50} this month`}
                changeType="positive"
                color="bg-green-500"
              />
              <StatCard
                title="Engagement Rate"
                value={`${stats.engagementRate.toFixed(1)}%`}
                icon={Heart}
                change={`+${(Math.random() * 2).toFixed(1)}%`}
                changeType="positive"
                color="bg-purple-500"
              />
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Highlights</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Views per Recipe</span>
                    <span className="font-medium">{stats.averageViews.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Top Recipe Views</span>
                    <span className="font-medium">{stats.topRecipeViews.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Saves</span>
                    <span className="font-medium">{stats.totalSaves.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Comments</span>
                    <span className="font-medium">{stats.totalComments.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Milestones</h3>
                <div className="space-y-3">
                  {milestones.slice(0, 3).map((milestone) => (
                    <MilestoneCard key={milestone.id} milestone={milestone} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Performance</h3>
              <p className="text-gray-600">Detailed analytics and insights coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Creator Settings</h3>
              <p className="text-gray-600">Profile and account settings coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorProfile;
