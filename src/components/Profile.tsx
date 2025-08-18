import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings, Edit, Camera, Heart, Bookmark, Share2, Plus } from 'lucide-react';
import { sampleUser } from '../data/sampleRecipe';

const Profile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  
  // In a real app, you'd fetch the user by ID
  const user = sampleUser;

  // Mock user recipes for MVP
  const userRecipes = [
    {
      id: '1',
      title: 'Butter Chicken',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
      likes: 1247,
      saves: 456
    },
    {
      id: '2',
      title: 'Homemade Pizza',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      likes: 892,
      saves: 234
    },
    {
      id: '3',
      title: 'Thai Green Curry',
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400',
      likes: 1567,
      saves: 567
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-br from-orange-100 via-yellow-100 to-green-100 relative">
          <div className="absolute inset-0 bg-black/5" />
          
          {/* Profile Actions */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button className="p-2 bg-white/20 backdrop-blur-sm text-gray-700 rounded-full hover:bg-white/30 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/20 backdrop-blur-sm text-gray-700 rounded-full hover:bg-white/30 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-4 pb-4">
          <div className="flex items-end space-x-4 -mt-16">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 pb-2">
              <h1 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h1>
              <p className="text-gray-600 mb-3 text-sm">{user.bio}</p>
              
              {/* Follow Button */}
              <button className="bg-orange-500 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition-colors text-sm">
                Follow
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-around py-4 border-t border-gray-100 mt-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{user.posts}</div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{user.followers}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{user.following}</div>
              <div className="text-sm text-gray-600">Following</div>
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
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:text-orange-500'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'saved'
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:text-orange-500'
            }`}
          >
            Saved
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 pb-20">
        {activeTab === 'posts' && (
          <div>
            {userRecipes.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {userRecipes.map((recipe) => (
                  <div key={recipe.id} className="relative group cursor-pointer">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                        <div className="flex items-center justify-center space-x-4 mb-2">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">{recipe.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Bookmark className="w-4 h-4" />
                            <span className="text-sm">{recipe.saves}</span>
                          </div>
                        </div>
                        <p className="text-sm font-medium">{recipe.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-4">Share your first recipe with the community!</p>
                <button 
                  onClick={() => navigate('/create')}
                  className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors"
                >
                  Create Your First Post
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Bookmark className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved recipes</h3>
            <p className="text-gray-600">Save recipes you love to cook later!</p>
          </div>
        )}
      </div>

      {/* Floating Action Button for Create */}
      <button
        onClick={() => navigate('/create')}
        className="fixed bottom-20 right-6 w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Profile;
