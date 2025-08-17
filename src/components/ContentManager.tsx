import React, { useState, useEffect } from 'react';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Heart, 
  Bookmark, 
  MessageCircle, 
  MoreVertical,
  Filter,
  Search,
  Calendar,
  TrendingUp,
  Clock,
  Star,
  Play,
  Image as ImageIcon
} from 'lucide-react';
import { supabase, TABLES } from '../lib/supabase';

interface ContentItem {
  id: string;
  type: 'recipe' | 'story';
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  views: number;
  likes: number;
  saves: number;
  comments: number;
  status: 'published' | 'draft' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  cuisine?: string;
}

const ContentManager: React.FC = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'all' | 'recipe' | 'story'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'likes' | 'engagement'>('date');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Mock creator ID - in real app, get from auth context
  const creatorId = '11111111-1111-1111-1111-111111111111';

  useEffect(() => {
    fetchContent();
  }, [selectedType, selectedStatus, sortBy]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from(TABLES.RECIPES)
        .select('*')
        .eq('creator_id', creatorId);

      // Apply filters
      if (selectedStatus !== 'all') {
        query = query.eq('is_published', selectedStatus === 'published');
      }

      const { data: recipes, error } = await query;

      if (error) throw error;

      // Transform recipes to ContentItem format
      const recipeItems: ContentItem[] = (recipes || []).map(recipe => ({
        id: recipe.id,
        type: 'recipe' as const,
        title: recipe.title,
        description: recipe.description || '',
        imageUrl: recipe.image_url,
        videoUrl: recipe.video_url,
        views: recipe.views_count || 0,
        likes: recipe.likes_count || 0,
        saves: recipe.saves_count || 0,
        comments: recipe.comments_count || 0,
        status: recipe.is_published ? 'published' : 'draft',
        createdAt: new Date(recipe.created_at),
        updatedAt: new Date(recipe.updated_at),
        tags: recipe.tags || [],
        cuisine: recipe.cuisine
      }));

      // Mock stories data (in real app, fetch from stories table)
      const storyItems: ContentItem[] = [
        {
          id: 'story-1',
          type: 'story',
          title: 'Quick Breakfast Ideas',
          description: '5 healthy breakfast recipes under 10 minutes',
          imageUrl: 'https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?w=400&h=300&fit=crop',
          views: 2340,
          likes: 156,
          saves: 89,
          comments: 23,
          status: 'published',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
          tags: ['Breakfast', 'Quick', 'Healthy']
        }
      ];

      let allContent = [...recipeItems, ...storyItems];

      // Filter by type
      if (selectedType !== 'all') {
        allContent = allContent.filter(item => item.type === selectedType);
      }

      // Sort content
      allContent.sort((a, b) => {
        switch (sortBy) {
          case 'date':
            return b.createdAt.getTime() - a.createdAt.getTime();
          case 'views':
            return b.views - a.views;
          case 'likes':
            return b.likes - a.likes;
          case 'engagement':
            const engagementA = (a.likes + a.saves + a.comments) / Math.max(a.views, 1);
            const engagementB = (b.likes + b.saves + b.comments) / Math.max(b.views, 1);
            return engagementB - engagementA;
          default:
            return 0;
        }
      });

      setContent(allContent);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      try {
        // Delete from Supabase
        const { error } = await supabase
          .from(TABLES.RECIPES)
          .delete()
          .eq('id', id);

        if (error) throw error;

        // Remove from local state
        setContent(prev => prev.filter(item => item.id !== id));
        setSelectedItems(prev => prev.filter(itemId => itemId !== id));
      } catch (error) {
        console.error('Error deleting content:', error);
        alert('Failed to delete content. Please try again.');
      }
    }
  };

  const handleBulkAction = async (action: 'delete' | 'archive' | 'publish') => {
    if (selectedItems.length === 0) return;

    const actionText = action === 'delete' ? 'delete' : action === 'archive' ? 'archive' : 'publish';
    if (!window.confirm(`Are you sure you want to ${actionText} ${selectedItems.length} selected items?`)) return;

    try {
      if (action === 'delete') {
        // Bulk delete
        const { error } = await supabase
          .from(TABLES.RECIPES)
          .delete()
          .in('id', selectedItems);

        if (error) throw error;
        setContent(prev => prev.filter(item => !selectedItems.includes(item.id)));
      } else if (action === 'archive') {
        // Bulk archive (update status)
        const { error } = await supabase
          .from(TABLES.RECIPES)
          .update({ is_published: false })
          .in('id', selectedItems);

        if (error) throw error;
        setContent(prev => prev.map(item => 
          selectedItems.includes(item.id) 
            ? { ...item, status: 'archived' as const }
            : item
        ));
      } else if (action === 'publish') {
        // Bulk publish
        const { error } = await supabase
          .from(TABLES.RECIPES)
          .update({ is_published: true })
          .in('id', selectedItems);

        if (error) throw error;
        setContent(prev => prev.map(item => 
          selectedItems.includes(item.id) 
            ? { ...item, status: 'published' as const }
            : item
        ));
      }

      setSelectedItems([]);
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
      alert(`Failed to ${action} content. Please try again.`);
    }
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const filteredContent = content.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const ContentCard = ({ item }: { item: ContentItem }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Content Preview */}
      <div className="relative h-48 bg-gray-100">
        {item.videoUrl ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Play className="w-12 h-12 text-white opacity-80" />
          </div>
        ) : item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.status === 'published' ? 'bg-green-100 text-green-800' :
            item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {item.type === 'recipe' ? '🍳 Recipe' : '📖 Story'}
          </span>
        </div>

        {/* Selection Checkbox */}
        <div className="absolute top-3 left-3">
          <input
            type="checkbox"
            checked={selectedItems.includes(item.id)}
            onChange={() => toggleItemSelection(item.id)}
            className="w-4 h-4 text-cookbook-orange bg-gray-100 border-gray-300 rounded focus:ring-cookbook-orange focus:ring-2"
          />
        </div>
      </div>

      {/* Content Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{item.title}</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{item.description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              +{item.tags.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{item.views.toLocaleString()}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Heart className="w-3 h-3" />
              <span>{item.likes.toLocaleString()}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Bookmark className="w-3 h-3" />
              <span>{item.saves.toLocaleString()}</span>
            </span>
          </div>
          <span className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{item.createdAt.toLocaleDateString()}</span>
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <Edit className="w-3 h-3" />
            <span>Edit</span>
          </button>
          <button 
            onClick={() => handleDelete(item.id)}
            className="flex items-center justify-center px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Content Manager</h1>
            <p className="text-gray-600 mt-2">Manage your recipes, stories, and content performance</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {selectedItems.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedItems.length} selected
                </span>
                <button
                  onClick={() => handleBulkAction('publish')}
                  className="px-4 py-2 text-sm font-medium text-white bg-cookbook-green rounded-lg hover:bg-cookbook-green/90 transition-colors"
                >
                  Publish
                </button>
                <button
                  onClick={() => handleBulkAction('archive')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Archive
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
            
            <button className="px-6 py-3 bg-cookbook-orange text-white rounded-lg hover:bg-cookbook-orange/90 transition-colors font-medium">
              Create New
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              {/* Type Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cookbook-orange focus:border-transparent"
                >
                  <option value="all">All Content</option>
                  <option value="recipe">Recipes</option>
                  <option value="story">Stories</option>
                </select>
              </div>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cookbook-orange focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cookbook-orange focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="views">Sort by Views</option>
                <option value="likes">Sort by Likes</option>
                <option value="engagement">Sort by Engagement</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cookbook-orange focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredContent.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>

        {/* Empty State */}
        {filteredContent.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedType !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Start creating your first recipe or story to get started'
              }
            </p>
            <button className="px-6 py-3 bg-cookbook-orange text-white rounded-lg hover:bg-cookbook-orange/90 transition-colors font-medium">
              Create Your First Content
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentManager;
