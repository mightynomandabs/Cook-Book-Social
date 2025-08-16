import React, { useState } from 'react';
import { Search, Users, Trophy, Calendar, MapPin, Star, Plus } from 'lucide-react';

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'groups' | 'contests'>('groups');
  const [searchQuery, setSearchQuery] = useState('');

  const sampleGroups = [
    {
      id: '1',
      name: 'Mumbai Street Foodies',
      description: 'Discover the best street food across Mumbai! Share hidden gems and food adventures.',
      avatar: '🌶️',
      coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop',
      members: 12450,
      posts: 8920,
      isJoined: true,
      tags: ['Street Food', 'Mumbai', 'Local'],
      location: 'Mumbai, Maharashtra'
    },
    {
      id: '2',
      name: 'Keto Lovers India',
      description: 'Low-carb, high-fat recipes perfect for the Indian palate. Share your keto journey!',
      avatar: '🥑',
      coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop',
      members: 5670,
      posts: 3420,
      isJoined: false,
      tags: ['Keto', 'Low-Carb', 'Healthy'],
      location: 'All India'
    },
    {
      id: '3',
      name: 'South Indian Kitchen',
      description: 'Traditional and modern South Indian recipes. From dosas to biryanis!',
      avatar: '🍛',
      coverImage: 'https://images.unsplash.com/photo-1563379091339-3b21d0c1d146?w=400&h=200&fit=crop',
      members: 8900,
      posts: 5670,
      isJoined: true,
      tags: ['South Indian', 'Traditional', 'Vegetarian'],
      location: 'South India'
    }
  ];

  const sampleContests = [
    {
      id: '1',
      title: 'The Amul Cheese Challenge',
      description: 'Create the most innovative dish using Amul cheese. Show us your creativity!',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop',
      prize: '₹50,000 + Amul Hamper',
      deadline: new Date('2024-02-15'),
      participants: 2340,
      isParticipating: false,
      rules: [
        'Must use Amul cheese as main ingredient',
        'Original recipe only',
        'Submit video + photos',
        'Deadline: Feb 15, 2024'
      ]
    },
    {
      id: '2',
      title: 'Monsoon Comfort Food',
      description: 'Share your favorite rainy day recipes. Warm, comforting dishes that brighten gloomy days.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop',
      prize: '₹25,000 + Featured on CookBook',
      deadline: new Date('2024-01-30'),
      participants: 1560,
      isParticipating: true,
      rules: [
        'Must be comfort food',
        'Perfect for monsoon',
        'Include cooking video',
        'Deadline: Jan 30, 2024'
      ]
    }
  ];

  const filteredGroups = sampleGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredContests = sampleContests.filter(contest =>
    contest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contest.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDeadline = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Ended';
    if (diffDays === 0) return 'Ends today';
    if (diffDays === 1) return 'Ends tomorrow';
    return `Ends in ${diffDays} days`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <h1 className="text-2xl font-bold text-cookbook-black mb-4">Community</h1>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search groups, contests, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cookbook-orange focus:border-transparent focus:outline-none"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'groups'
                ? 'bg-white text-cookbook-orange shadow-sm'
                : 'text-gray-600 hover:text-cookbook-orange'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Groups</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('contests')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'contests'
                ? 'bg-white text-cookbook-orange shadow-sm'
                : 'text-gray-600 hover:text-cookbook-orange'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Contests</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 pb-20">
        {activeTab === 'groups' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-cookbook-black">Food Groups</h2>
              <button className="bg-cookbook-orange text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cookbook-orange/90 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Group</span>
              </button>
            </div>

            {filteredGroups.map((group) => (
              <div key={group.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Cover Image */}
                <div className="relative h-32 bg-gray-200">
                  <img
                    src={group.coverImage}
                    alt={group.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg">
                      {group.avatar}
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <button
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        group.isJoined
                          ? 'bg-cookbook-green text-white'
                          : 'bg-white text-cookbook-orange hover:bg-cookbook-orange hover:text-white'
                      }`}
                    >
                      {group.isJoined ? 'Joined' : 'Join'}
                    </button>
                  </div>
                </div>

                {/* Group Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-cookbook-black mb-2">{group.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{group.description}</p>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{group.location}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {group.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-600">
                        <Users className="w-4 h-4 inline mr-1" />
                        {group.members.toLocaleString()} members
                      </span>
                      <span className="text-gray-600">
                        {group.posts.toLocaleString()} posts
                      </span>
                    </div>
                    {group.isJoined && (
                      <span className="text-cookbook-green font-medium">✓ Member</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'contests' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-cookbook-black">Active Contests</h2>
              <button className="bg-cookbook-yellow text-cookbook-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-cookbook-yellow/90 transition-colors">
                View All
              </button>
            </div>

            {filteredContests.map((contest) => (
              <div key={contest.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Contest Image */}
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={contest.image}
                    alt={contest.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <div className="bg-cookbook-orange text-white px-3 py-1 rounded-full text-sm font-medium">
                      <Trophy className="w-4 h-4 inline mr-1" />
                      Contest
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-cookbook-black">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {formatDeadline(contest.deadline)}
                    </div>
                  </div>
                </div>

                {/* Contest Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-cookbook-black mb-2">{contest.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{contest.description}</p>
                  
                  {/* Prize */}
                  <div className="bg-gradient-to-r from-cookbook-yellow/20 to-cookbook-orange/20 border border-cookbook-yellow/30 rounded-lg p-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-cookbook-orange" />
                      <span className="font-semibold text-cookbook-black">Prize:</span>
                      <span className="text-cookbook-orange font-bold">{contest.prize}</span>
                    </div>
                  </div>

                  {/* Rules */}
                  <div className="mb-3">
                    <h4 className="font-medium text-cookbook-black mb-2">Rules:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {contest.rules.slice(0, 3).map((rule, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-cookbook-orange mt-1">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <Users className="w-4 h-4 inline mr-1" />
                      {contest.participants.toLocaleString()} participants
                    </div>
                    <button
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        contest.isParticipating
                          ? 'bg-cookbook-green text-white'
                          : 'bg-cookbook-orange text-white hover:bg-cookbook-orange/90'
                      }`}
                    >
                      {contest.isParticipating ? 'Participating' : 'Join Contest'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
