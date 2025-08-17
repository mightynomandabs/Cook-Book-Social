import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  Bookmark, 
  MessageCircle, 
  Plus,
  Settings,
  DollarSign,
  Target,
  Calendar,
  Star,
  Award,
  Zap
} from 'lucide-react';
import { supabase, TABLES } from '../lib/supabase';

interface CreatorStats {
  totalRecipes: number;
  totalViews: number;
  totalLikes: number;
  totalSaves: number;
  totalComments: number;
  totalFollowers: number;
  monthlyGrowth: number;
  engagementRate: number;
}

interface TopRecipe {
  id: string;
  title: string;
  views: number;
  likes: number;
  saves: number;
  comments: number;
  engagement: number;
}

const CreatorDashboard: React.FC = () => {
  const [stats, setStats] = useState<CreatorStats>({
    totalRecipes: 0,
    totalViews: 0,
    totalLikes: 0,
    totalSaves: 0,
    totalComments: 0,
    totalFollowers: 0,
    monthlyGrowth: 0,
    engagementRate: 0
  });
  const [topRecipes, setTopRecipes] = useState<TopRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  // Mock creator ID - in real app, get from auth context
  const creatorId = '11111111-1111-1111-1111-111111111111';

  useEffect(() => {
    fetchCreatorStats();
    fetchTopRecipes();
  }, [selectedPeriod]);

  const fetchCreatorStats = async () => {
    try {
      setLoading(true);
      
      // Fetch recipes count
      const { count: recipesCount } = await supabase
        .from(TABLES.RECIPES)
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', creatorId);

      // Fetch total views, likes, saves, comments
      const { data: recipes } = await supabase
        .from(TABLES.RECIPES)
        .select('views_count, likes_count, saves_count, comments_count')
        .eq('creator_id', creatorId);

      // Calculate totals
      const totalViews = recipes?.reduce((sum, recipe) => sum + (recipe.views_count || 0), 0) || 0;
      const totalLikes = recipes?.reduce((sum, recipe) => sum + (recipe.likes_count || 0), 0) || 0;
      const totalSaves = recipes?.reduce((sum, recipe) => sum + (recipe.saves_count || 0), 0) || 0;
      const totalComments = recipes?.reduce((sum, recipe) => sum + (recipe.comments_count || 0), 0) || 0;

      // Mock followers count (in real app, fetch from users table)
      const totalFollowers = 15420;
      
      // Calculate engagement rate
      const engagementRate = totalViews > 0 ? ((totalLikes + totalSaves + totalComments) / totalViews) * 100 : 0;
      
      // Mock monthly growth
      const monthlyGrowth = 12.5;

      setStats({
        totalRecipes: recipesCount || 0,
        totalViews,
        totalLikes,
        totalSaves,
        totalComments,
        totalFollowers,
        monthlyGrowth,
        engagementRate
      });
    } catch (error) {
      console.error('Error fetching creator stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopRecipes = async () => {
    try {
      const { data: recipes } = await supabase
        .from(TABLES.RECIPES)
        .select('id, title, views_count, likes_count, saves_count, comments_count')
        .eq('creator_id', creatorId)
        .order('views_count', { ascending: false })
        .limit(5);

      if (recipes) {
        const topRecipesData = recipes.map(recipe => ({
          id: recipe.id,
          title: recipe.title,
          views: recipe.views_count || 0,
          likes: recipe.likes_count || 0,
          saves: recipe.saves_count || 0,
          comments: recipe.comments_count || 0,
          engagement: ((recipe.likes_count || 0) + (recipe.saves_count || 0) + (recipe.comments_count || 0)) / (recipe.views_count || 1) * 100
        }));
        setTopRecipes(topRecipesData);
      }
    } catch (error) {
      console.error('Error fetching top recipes:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, changeType }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    change?: string;
    changeType?: 'positive' | 'negative';
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
        <div className="p-3 bg-cookbook-orange/10 rounded-lg">
          <Icon className="w-6 h-6 text-cookbook-orange" />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, action, color }: {
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    action: () => void;
    color: string;
  }) => (
    <button
      onClick={action}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 text-left group"
    >
      <div className={`p-3 rounded-lg ${color} mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Creator Dashboard</h1>
            <p className="text-gray-600 mt-2">Track your content performance and grow your audience</p>
          </div>
          
          {/* Period Selector */}
          <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm border">
            {(['7d', '30d', '90d'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-cookbook-orange text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Recipes"
            value={stats.totalRecipes}
            icon={Plus}
            change={`+${Math.floor(Math.random() * 5) + 1} this month`}
            changeType="positive"
          />
          <StatCard
            title="Total Views"
            value={stats.totalViews.toLocaleString()}
            icon={Eye}
            change={`+${stats.monthlyGrowth}%`}
            changeType="positive"
          />
          <StatCard
            title="Total Followers"
            value={stats.totalFollowers.toLocaleString()}
            icon={Users}
            change={`+${Math.floor(Math.random() * 200) + 50} this month`}
            changeType="positive"
          />
          <StatCard
            title="Engagement Rate"
            value={`${stats.engagementRate.toFixed(1)}%`}
            icon={Heart}
            change={`+${(Math.random() * 2).toFixed(1)}%`}
            changeType="positive"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionCard
              title="Create Recipe"
              description="Upload a new recipe with photos or video"
              icon={Plus}
              action={() => window.location.href = '/create'}
              color="bg-cookbook-orange"
            />
            <QuickActionCard
              title="View Analytics"
              description="Detailed performance insights"
              icon={BarChart3}
              action={() => {/* Navigate to analytics */}}
              color="bg-cookbook-green"
            />
            <QuickActionCard
              title="Monetization"
              description="Manage partnerships and revenue"
              icon={DollarSign}
              action={() => {/* Navigate to monetization */}}
              color="bg-cookbook-yellow"
            />
            <QuickActionCard
              title="Creator Settings"
              description="Customize your creator profile"
              icon={Settings}
              action={() => {/* Navigate to settings */}}
              color="bg-cookbook-black"
            />
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Performing Recipes</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipe</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Likes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saves</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topRecipes.map((recipe, index) => (
                    <tr key={recipe.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 bg-cookbook-orange rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{recipe.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{recipe.views.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{recipe.likes.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{recipe.saves.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{recipe.comments.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {recipe.engagement.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Activity & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'New follower', user: 'Sarah K.', time: '2 hours ago', type: 'follow' },
                { action: 'Recipe liked', user: 'Mike R.', time: '4 hours ago', type: 'like' },
                { action: 'Recipe saved', user: 'Emma L.', time: '6 hours ago', type: 'save' },
                { action: 'New comment', user: 'David M.', time: '1 day ago', type: 'comment' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'follow' ? 'bg-blue-500' :
                    activity.type === 'like' ? 'bg-red-500' :
                    activity.type === 'save' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Insights */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Insights</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Views up 23%</span>
                </div>
                <span className="text-xs text-green-600">vs last month</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Followers up 15%</span>
                </div>
                <span className="text-xs text-blue-600">vs last month</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Engagement up 8%</span>
                </div>
                <span className="text-xs text-yellow-600">vs last month</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
