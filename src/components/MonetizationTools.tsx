import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  Star,
  Award,
  Gift,
  ShoppingBag,
  ExternalLink,
  Plus,
  Settings,
  BarChart3,
  Target,
  Zap,
  Crown,
  Heart,
  MessageCircle
} from 'lucide-react';

interface Partnership {
  id: string;
  brand: string;
  logo: string;
  type: 'sponsored_post' | 'affiliate' | 'brand_ambassador' | 'product_placement';
  status: 'active' | 'pending' | 'completed' | 'rejected';
  startDate: Date;
  endDate: Date;
  compensation: number;
  compensationType: 'fixed' | 'commission' | 'product' | 'hybrid';
  requirements: string[];
  performance: {
    views: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
}

interface RevenueStream {
  id: string;
  name: string;
  type: 'partnerships' | 'affiliate' | 'merchandise' | 'subscriptions' | 'donations';
  currentMonth: number;
  previousMonth: number;
  growth: number;
  target: number;
  icon: string;
  color: string;
}

interface AffiliateProduct {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  commission: number;
  clicks: number;
  conversions: number;
  revenue: number;
  status: 'active' | 'inactive';
}

const MonetizationTools: React.FC = () => {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [revenueStreams, setRevenueStreams] = useState<RevenueStream[]>([]);
  const [affiliateProducts, setAffiliateProducts] = useState<AffiliateProduct[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonetizationData();
  }, [selectedPeriod]);

  const fetchMonetizationData = async () => {
    try {
      setLoading(true);
      
      // Mock data - in real app, fetch from Supabase
      const mockPartnerships: Partnership[] = [
        {
          id: '1',
          brand: 'Organic Valley',
          logo: '🥛',
          type: 'sponsored_post',
          status: 'active',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-03-31'),
          compensation: 2500,
          compensationType: 'fixed',
          requirements: ['Create 3 recipe videos', 'Include product placement', 'Use #OrganicValley hashtag'],
          performance: {
            views: 45000,
            clicks: 1200,
            conversions: 89,
            revenue: 2500
          }
        },
        {
          id: '2',
          brand: 'KitchenAid',
          logo: '🔧',
          type: 'affiliate',
          status: 'active',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-12-31'),
          compensation: 0,
          compensationType: 'commission',
          requirements: ['Promote KitchenAid products', 'Include affiliate links', 'Share cooking tips'],
          performance: {
            views: 32000,
            clicks: 890,
            conversions: 45,
            revenue: 675
          }
        }
      ];

      const mockRevenueStreams: RevenueStream[] = [
        {
          id: '1',
          name: 'Brand Partnerships',
          type: 'partnerships',
          currentMonth: 2500,
          previousMonth: 1800,
          growth: 38.9,
          target: 5000,
          icon: '🤝',
          color: 'bg-blue-500'
        },
        {
          id: '2',
          name: 'Affiliate Marketing',
          type: 'affiliate',
          currentMonth: 675,
          previousMonth: 420,
          growth: 60.7,
          target: 1000,
          icon: '🔗',
          color: 'bg-green-500'
        },
        {
          id: '3',
          name: 'Merchandise Sales',
          type: 'merchandise',
          currentMonth: 320,
          previousMonth: 280,
          growth: 14.3,
          target: 500,
          icon: '🛍️',
          color: 'bg-purple-500'
        },
        {
          id: '4',
          name: 'Premium Subscriptions',
          type: 'subscriptions',
          currentMonth: 180,
          previousMonth: 150,
          growth: 20.0,
          target: 300,
          icon: '👑',
          color: 'bg-yellow-500'
        }
      ];

      const mockAffiliateProducts: AffiliateProduct[] = [
        {
          id: '1',
          name: 'Professional Chef Knife Set',
          brand: 'KitchenAid',
          image: '🔪',
          price: 299.99,
          commission: 15,
          clicks: 890,
          conversions: 45,
          revenue: 675,
          status: 'active'
        },
        {
          id: '2',
          name: 'Organic Cooking Oil',
          brand: 'Organic Valley',
          image: '🫒',
          price: 24.99,
          commission: 20,
          clicks: 1200,
          conversions: 89,
          revenue: 450,
          status: 'active'
        }
      ];

      setPartnerships(mockPartnerships);
      setRevenueStreams(mockRevenueStreams);
      setAffiliateProducts(mockAffiliateProducts);
    } catch (error) {
      console.error('Error fetching monetization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalRevenue = () => {
    return revenueStreams.reduce((total, stream) => total + stream.currentMonth, 0);
  };

  const calculateTotalGrowth = () => {
    const totalPrevious = revenueStreams.reduce((total, stream) => total + stream.previousMonth, 0);
    const totalCurrent = calculateTotalRevenue();
    return totalPrevious > 0 ? ((totalCurrent - totalPrevious) / totalPrevious) * 100 : 0;
  };

  const PartnershipCard = ({ partnership }: { partnership: Partnership }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
            {partnership.logo}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{partnership.brand}</h3>
            <p className="text-sm text-gray-600 capitalize">
              {partnership.type.replace('_', ' ')}
            </p>
          </div>
        </div>
        
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          partnership.status === 'active' ? 'bg-green-100 text-green-800' :
          partnership.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          partnership.status === 'completed' ? 'bg-blue-100 text-blue-800' :
          'bg-red-100 text-red-800'
        }`}>
          {partnership.status.charAt(0).toUpperCase() + partnership.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Compensation</p>
          <p className="font-semibold text-gray-900">
            ${partnership.compensation.toLocaleString()}
            {partnership.compensationType === 'commission' && ' + commission'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Duration</p>
          <p className="font-semibold text-gray-900">
            {partnership.startDate.toLocaleDateString()} - {partnership.endDate.toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Requirements:</p>
        <ul className="space-y-1">
          {partnership.requirements.map((req, index) => (
            <li key={index} className="text-xs text-gray-600 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-cookbook-orange rounded-full"></span>
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t pt-4">
        <p className="text-xs text-gray-500 mb-2">Performance This Month:</p>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="text-center">
            <p className="font-medium text-gray-900">{partnership.performance.views.toLocaleString()}</p>
            <p className="text-gray-500">Views</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-900">{partnership.performance.clicks.toLocaleString()}</p>
            <p className="text-gray-500">Clicks</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-900">{partnership.performance.conversions.toLocaleString()}</p>
            <p className="text-gray-500">Sales</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-900">${partnership.performance.revenue.toLocaleString()}</p>
            <p className="text-gray-500">Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );

  const RevenueCard = ({ stream }: { stream: RevenueStream }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${stream.color} rounded-lg flex items-center justify-center text-2xl text-white`}>
          {stream.icon}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Growth</p>
          <p className={`font-semibold ${
            stream.growth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {stream.growth >= 0 ? '+' : ''}{stream.growth.toFixed(1)}%
          </p>
        </div>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-1">{stream.name}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-2">
        ${stream.currentMonth.toLocaleString()}
      </p>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Target</span>
          <span className="font-medium">${stream.target.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-cookbook-orange h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((stream.currentMonth / stream.target) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Monetization Tools</h1>
            <p className="text-gray-600 mt-2">Track your earnings and manage brand partnerships</p>
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

        {/* Revenue Overview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Revenue Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">${calculateTotalRevenue().toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Revenue This Month</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${
                calculateTotalGrowth() >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {calculateTotalGrowth() >= 0 ? '+' : ''}{calculateTotalGrowth().toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">Growth vs Last Month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{partnerships.length}</p>
              <p className="text-sm text-gray-600">Active Partnerships</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {revenueStreams.map((stream) => (
              <RevenueCard key={stream.id} stream={stream} />
            ))}
          </div>
        </div>

        {/* Brand Partnerships */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Brand Partnerships</h2>
            <button className="flex items-center space-x-2 px-4 py-2 bg-cookbook-orange text-white rounded-lg hover:bg-cookbook-orange/90 transition-colors">
              <Plus className="w-4 h-4" />
              <span>New Partnership</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {partnerships.map((partnership) => (
              <PartnershipCard key={partnership.id} partnership={partnership} />
            ))}
          </div>
        </div>

        {/* Affiliate Products */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Affiliate Products</h2>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {affiliateProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                            {product.image}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.brand}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.commission}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.clicks.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.conversions.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${product.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Monetization Tips */}
        <div className="bg-gradient-to-r from-cookbook-orange to-cookbook-yellow rounded-xl p-6 text-white">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Boost Your Earnings</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  <span>Post consistently to maintain audience engagement</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  <span>Use high-quality visuals and engaging captions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  <span>Engage with your audience through comments and stories</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  <span>Collaborate with other creators to expand your reach</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonetizationTools;
