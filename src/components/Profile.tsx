import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Settings, Edit, Flame, MapPin, Mail, Phone, Globe, Camera, Heart, Bookmark, Share2 } from 'lucide-react';
import { sampleUser } from '../data/sampleRecipe';

const Profile: React.FC = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'resume'>('posts');
  
  // In a real app, you'd fetch the user by ID
  const user = sampleUser;

  const getBadgeColor = (color: string) => {
    switch (color) {
      case 'orange': return 'bg-cookbook-orange/20 text-cookbook-orange border-cookbook-orange/30';
      case 'yellow': return 'bg-cookbook-yellow/20 text-cookbook-yellow border-cookbook-yellow/30';
      case 'green': return 'bg-cookbook-green/20 text-cookbook-green border-cookbook-green/30';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-br from-cookbook-orange/20 via-cookbook-yellow/20 to-cookbook-green/20 relative">
          <div className="absolute inset-0 bg-black/10" />
          
          {/* Profile Actions */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-4 pb-4">
          <div className="flex items-end space-x-4 -mt-16">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-cookbook-orange text-white p-2 rounded-full hover:bg-cookbook-orange/90 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold text-cookbook-black mb-1">{user.name}</h1>
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
              <p className="text-gray-600 mb-3">{user.bio}</p>
              
              {/* Follow Button */}
              <button className="bg-cookbook-orange text-white px-6 py-2 rounded-full font-medium hover:bg-cookbook-orange/90 transition-colors">
                Follow
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-around py-4 border-t border-gray-100 mt-4">
            <div className="text-center">
              <div className="text-xl font-bold text-cookbook-black">{user.posts}</div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-cookbook-black">{user.followers}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-cookbook-black">{user.following}</div>
              <div className="text-sm text-gray-600">Following</div>
            </div>
          </div>

          {/* Cooking Level */}
          <div className="bg-gradient-to-r from-cookbook-orange/10 to-cookbook-yellow/10 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-cookbook-orange" />
                <span className="font-semibold text-cookbook-black">Cooking Level</span>
              </div>
              <span className="text-lg font-bold text-cookbook-orange">{user.cookingLevelTitle}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-cookbook-orange to-cookbook-yellow h-3 rounded-full transition-all duration-300"
                style={{ width: `${user.cookingLevel}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>Beginner</span>
              <span>Expert</span>
            </div>
          </div>

          {/* Badges */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-cookbook-black mb-3">Achievements</h3>
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`px-3 py-2 rounded-full border text-sm font-medium ${getBadgeColor(badge.color)}`}
                >
                  <span className="mr-2">{badge.icon}</span>
                  {badge.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 border-t border-gray-100">
        <div className="flex space-x-1 py-3">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'posts'
                ? 'bg-cookbook-orange text-white'
                : 'text-gray-600 hover:text-cookbook-orange'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'saved'
                ? 'bg-cookbook-orange text-white'
                : 'text-gray-600 hover:text-cookbook-orange'
            }`}
          >
            Saved
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'resume'
                ? 'bg-cookbook-orange text-white'
                : 'text-gray-600 hover:text-cookbook-orange'
            }`}
          >
            Foodie Resume
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 pb-20">
        {activeTab === 'posts' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-cookbook-black mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-4">Share your first recipe with the community!</p>
            <button className="bg-cookbook-orange text-white px-6 py-3 rounded-xl font-medium hover:bg-cookbook-orange/90 transition-colors">
              Create Your First Post
            </button>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Bookmark className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-cookbook-black mb-2">No saved recipes</h3>
            <p className="text-gray-600">Save recipes you love to cook later!</p>
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="space-y-6 py-4">
            {/* Skills */}
            <div>
              <h3 className="text-lg font-semibold text-cookbook-black mb-3">Cooking Skills</h3>
              <div className="grid grid-cols-2 gap-3">
                {user.interests.map((skill) => (
                  <div key={skill} className="bg-gray-50 p-3 rounded-xl text-center">
                    <span className="font-medium text-cookbook-black">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dietary Preferences */}
            <div>
              <h3 className="text-lg font-semibold text-cookbook-black mb-3">Dietary Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {user.dietaryPreferences.map((diet) => (
                  <span
                    key={diet}
                    className="px-3 py-2 bg-cookbook-green/20 text-cookbook-green rounded-full text-sm font-medium"
                  >
                    {diet}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 className="text-lg font-semibold text-cookbook-black mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {user.preferredLanguages.map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-2 bg-cookbook-yellow/20 text-cookbook-yellow rounded-full text-sm font-medium"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-cookbook-black mb-3">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <Mail className="w-5 h-5 text-cookbook-orange" />
                  <span className="text-gray-700">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-cookbook-green" />
                  <span className="text-gray-700">{user.location}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
