import React, { useState } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Trophy, Bookmark, AtSign, Clock } from 'lucide-react';

const Notifications: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const sampleNotifications = [
    {
      id: '1',
      type: 'like',
      title: 'New like on your recipe',
      message: 'Chef Raj liked your "Perfect Basmati Rice" recipe',
      user: {
        name: 'Chef Raj',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
      },
      recipe: {
        title: 'Perfect Basmati Rice',
        image: 'https://images.unsplash.com/photo-1563379091339-3b21d0c1d146?w=60&h=60&fit=crop'
      },
      isRead: false,
      createdAt: new Date('2024-01-20T10:30:00'),
      actionUrl: '/recipe/1'
    },
    {
      id: '2',
      type: 'comment',
      title: 'New comment on your recipe',
      message: 'Chef Meera commented: "This looks amazing! Can I substitute brown rice?"',
      user: {
        name: 'Chef Meera',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
      },
      recipe: {
        title: 'Perfect Basmati Rice',
        image: 'https://images.unsplash.com/photo-1563379091339-3b21d0c1d146?w=60&h=60&fit=crop'
      },
      isRead: false,
      createdAt: new Date('2024-01-20T09:15:00'),
      actionUrl: '/recipe/1'
    },
    {
      id: '3',
      type: 'follow',
      title: 'New follower',
      message: 'Foodie Alex started following you',
      user: {
        name: 'Foodie Alex',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
      },
      isRead: true,
      createdAt: new Date('2024-01-20T08:45:00'),
      actionUrl: '/profile/alex'
    },
    {
      id: '4',
      type: 'mention',
      title: 'You were mentioned',
      message: 'Chef Priya mentioned you in a comment: "@ChefRaj check out this amazing recipe!"',
      user: {
        name: 'Chef Priya',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
      },
      isRead: true,
      createdAt: new Date('2024-01-20T07:30:00'),
      actionUrl: '/recipe/mention'
    },
    {
      id: '5',
      type: 'contest',
      title: 'Contest Reminder',
      message: 'The Amul Cheese Challenge ends in 3 days! Submit your recipe now.',
      isRead: false,
      createdAt: new Date('2024-01-20T06:00:00'),
      actionUrl: '/community/contest/amul'
    },
    {
      id: '6',
      type: 'reminder',
      title: 'Recipe Reminder',
      message: 'You saved "Mumbai Street Style Vada Pav" 2 days ago. Time to cook it!',
      recipe: {
        title: 'Mumbai Street Style Vada Pav',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=60&h=60&fit=crop'
      },
      isRead: true,
      createdAt: new Date('2024-01-20T05:30:00'),
      actionUrl: '/recipe/2'
    }
  ];

  const filters = [
    { id: 'all', label: 'All', count: sampleNotifications.length },
    { id: 'unread', label: 'Unread', count: sampleNotifications.filter(n => !n.isRead).length },
    { id: 'likes', label: 'Likes', count: sampleNotifications.filter(n => n.type === 'like').length },
    { id: 'comments', label: 'Comments', count: sampleNotifications.filter(n => n.type === 'comment').length },
    { id: 'follows', label: 'Follows', count: sampleNotifications.filter(n => n.type === 'follow').length }
  ];

  const filteredNotifications = sampleNotifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.isRead;
    return notification.type === activeFilter;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment': return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow': return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'mention': return <AtSign className="w-5 h-5 text-purple-500" />;
      case 'contest': return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'reminder': return <Bookmark className="w-5 h-5 text-cookbook-orange" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like': return 'bg-red-50 border-red-200';
      case 'comment': return 'bg-blue-50 border-blue-200';
      case 'follow': return 'bg-green-50 border-green-200';
      case 'mention': return 'bg-purple-50 border-purple-200';
      case 'contest': return 'bg-yellow-50 border-yellow-200';
      case 'reminder': return 'bg-cookbook-orange/10 border-cookbook-orange/20';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const markAllAsRead = () => {
    // In a real app, this would update the backend
    console.log('Marking all notifications as read');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-cookbook-black">Notifications</h1>
          <button
            onClick={markAllAsRead}
            className="text-cookbook-orange text-sm font-medium hover:text-cookbook-orange/80 transition-colors"
          >
            Mark all as read
          </button>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter.id
                  ? 'bg-cookbook-orange text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 pb-20">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-cookbook-black mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up! Check back later for new updates.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                  notification.isRead 
                    ? 'bg-white border-gray-200' 
                    : `${getNotificationColor(notification.type)} border-l-4 border-l-cookbook-orange`
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-cookbook-black mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">
                          {notification.message}
                        </p>
                        
                        {/* User Info */}
                        {notification.user && (
                          <div className="flex items-center space-x-2 mb-2">
                            <img
                              src={notification.user.avatar}
                              alt={notification.user.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-sm font-medium text-cookbook-black">
                              {notification.user.name}
                            </span>
                          </div>
                        )}

                        {/* Recipe Preview */}
                        {notification.recipe && (
                          <div className="flex items-center space-x-3 p-2 bg-white rounded-lg border border-gray-200">
                            <img
                              src={notification.recipe.image}
                              alt={notification.recipe.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-cookbook-black text-sm truncate">
                                {notification.recipe.title}
                              </h5>
                              <p className="text-xs text-gray-500">Tap to view recipe</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Time and Status */}
                      <div className="flex flex-col items-end space-y-2">
                        <span className="text-xs text-gray-500 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeAgo(notification.createdAt)}</span>
                        </span>
                        
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-cookbook-orange rounded-full"></div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 mt-3">
                      <button className="bg-cookbook-orange text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-cookbook-orange/90 transition-colors">
                        View
                      </button>
                      
                      {notification.type === 'follow' && (
                        <button className="bg-cookbook-green text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-cookbook-green/90 transition-colors">
                          Follow Back
                        </button>
                      )}
                      
                      {notification.type === 'contest' && (
                        <button className="bg-cookbook-yellow text-cookbook-black px-3 py-1 rounded-lg text-xs font-medium hover:bg-cookbook-yellow/90 transition-colors">
                          Participate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notification Settings */}
        <div className="mt-8 bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-cookbook-black mb-3">Notification Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-cookbook-black">Recipe Interactions</h4>
                <p className="text-sm text-gray-600">Likes, comments, and shares on your recipes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cookbook-orange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cookbook-orange"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-cookbook-black">New Followers</h4>
                <p className="text-sm text-gray-600">When someone starts following you</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cookbook-orange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cookbook-orange"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-cookbook-black">Contest Updates</h4>
                <p className="text-sm text-gray-600">New contests, deadlines, and results</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cookbook-orange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cookbook-orange"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
