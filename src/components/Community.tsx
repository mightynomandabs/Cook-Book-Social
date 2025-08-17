import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageCircle, Video, TrendingUp, Heart, Share2, Plus, Search, Filter, Mic, MicOff, Camera, Phone } from 'lucide-react';
import { LiquidFill } from './WebGLMotionSystem';

interface Group {
  id: string;
  name: string;
  description: string;
  coverPhoto: string;
  memberCount: number;
  activeNow: number;
  tags: string[];
  isLive: boolean;
  liveRoom?: LiveRoom;
  pinnedChallenges: Challenge[];
  topRecipes: Recipe[];
  weeklyPrompt: string;
}

interface LiveRoom {
  id: string;
  title: string;
  host: User;
  participants: User[];
  isAudioOnly: boolean;
  currentTopic: string;
  duration: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  participants: number;
  prize: string;
  isActive: boolean;
}

interface Recipe {
  id: string;
  title: string;
  creator: User;
  thumbnail: string;
  likes: number;
  remixes: number;
  isRemix: boolean;
  originalRecipe?: Recipe;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  isOnline: boolean;
}

interface CommunityProps {
  groups: Group[];
  onJoinGroup?: (groupId: string) => void;
  onLeaveGroup?: (groupId: string) => void;
  onJoinLiveRoom?: (roomId: string) => void;
  onParticipateInChallenge?: (challengeId: string) => void;
  onViewRecipe?: (recipeId: string) => void;
}

export const Community: React.FC<CommunityProps> = ({
  groups,
  onJoinGroup,
  onLeaveGroup,
  onJoinLiveRoom,
  onParticipateInChallenge,
  onViewRecipe
}) => {
  const [activeTab, setActiveTab] = useState<'groups' | 'live' | 'challenges' | 'remixes'>('groups');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isInLiveRoom, setIsInLiveRoom] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  // Filter groups based on search and tags
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => group.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  // Get all unique tags
  const allTags = Array.from(new Set(groups.flatMap(group => group.tags)));

  // Group Card Component
  const GroupCard: React.FC<{ group: Group }> = ({ group }) => (
    <motion.div
      className="bg-white rounded-3xl overflow-hidden shadow-lg cursor-pointer"
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setSelectedGroup(group)}
    >
      {/* Cover Photo */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={group.coverPhoto}
          alt={group.name}
          className="w-full h-full object-cover"
        />
        
        {/* Live Badge */}
        {group.isLive && (
          <motion.div
            className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span>LIVE</span>
          </motion.div>
        )}

        {/* Active Count */}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
          🔥 {group.activeNow} active now
        </div>

        {/* Tags */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {group.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Group Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{group.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{group.memberCount.toLocaleString()} members</span>
          <span>{group.activeNow} online</span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <motion.button
            className="flex-1 bg-gradient-primary text-white py-2 rounded-xl font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onJoinGroup?.(group.id);
            }}
          >
            Join Group
          </motion.button>
          
          {group.isLive && (
            <motion.button
              className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onJoinLiveRoom?.(group.liveRoom!.id);
              }}
            >
              Join Live
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );

  // Live Room Component
  const LiveRoom: React.FC<{ room: LiveRoom; onLeave: () => void }> = ({ room, onLeave }) => (
    <motion.div
      className="fixed inset-0 bg-black z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onLeave}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <Phone size={20} className="text-white" />
            </button>
            <div>
              <h2 className="text-white font-semibold">{room.title}</h2>
              <p className="text-white/80 text-sm">Hosted by {room.host.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-white/80 text-sm">{room.participants.length} participants</span>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Users size={48} />
          </div>
          <h3 className="text-2xl font-bold mb-2">Live Audio Q&A</h3>
          <p className="text-white/80 mb-6">Topic: {room.currentTopic}</p>
          
          {/* Participant Avatars */}
          <div className="flex justify-center space-x-2 mb-8">
            {room.participants.slice(0, 5).map(participant => (
              <div key={participant.id} className="relative">
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
                {participant.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="flex items-center justify-center space-x-4">
          <motion.button
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isMuted ? 'bg-red-500' : 'bg-white/20 backdrop-blur-sm'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff size={24} className="text-white" /> : <Mic size={24} className="text-white" />}
          </motion.button>

          <motion.button
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isVideoOn ? 'bg-green-500' : 'bg-white/20 backdrop-blur-sm'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsVideoOn(!isVideoOn)}
          >
            <Camera size={24} className="text-white" />
          </motion.button>

          <motion.button
            className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onLeave}
          >
            <Phone size={24} className="text-white rotate-90" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  // Remix Tree Component
  const RemixTree: React.FC<{ recipe: Recipe }> = ({ recipe }) => (
    <motion.div
      className="bg-white rounded-2xl p-4 shadow-lg"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center space-x-3 mb-3">
        <img
          src={recipe.thumbnail}
          alt={recipe.title}
          className="w-16 h-16 rounded-xl object-cover"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 line-clamp-1">{recipe.title}</h4>
          <p className="text-sm text-gray-600">by {recipe.creator.name}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-orange-500">{recipe.remixes}</div>
          <div className="text-xs text-gray-500">remixes</div>
        </div>
      </div>

      {/* Remix Chain */}
      {recipe.isRemix && recipe.originalRecipe && (
        <div className="border-l-2 border-orange-200 pl-4 ml-8">
          <div className="text-xs text-gray-500 mb-2">Remix of:</div>
          <div className="flex items-center space-x-2">
            <img
              src={recipe.originalRecipe.thumbnail}
              alt={recipe.originalRecipe.title}
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="text-sm text-gray-600 line-clamp-1">
              {recipe.originalRecipe.title}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Cooking Community</h1>
              <p className="text-gray-600">Connect, share, and grow with fellow foodies</p>
            </div>
            <motion.button
              onClick={() => setShowCreateGroup(true)}
              className="bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              <span>Create Group</span>
            </motion.button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search groups, recipes, or creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 5).map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTags(prev => 
                      prev.includes(tag) 
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    )}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-gradient-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-2 mb-6 shadow-lg">
          <div className="flex space-x-1">
            {[
              { id: 'groups', label: 'Groups', icon: Users },
              { id: 'live', label: 'Live Rooms', icon: Video },
              { id: 'challenges', label: 'Challenges', icon: TrendingUp },
              { id: 'remixes', label: 'Remix Trees', icon: Share2 }
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
          {activeTab === 'groups' && (
            <motion.div
              key="groups"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {filteredGroups.map(group => (
                <GroupCard key={group.id} group={group} />
              ))}
            </motion.div>
          )}

          {activeTab === 'live' && (
            <motion.div
              key="live"
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-3xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Live Rooms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groups.filter(g => g.isLive && g.liveRoom).map(group => (
                    <div key={group.id} className="border border-gray-200 rounded-2xl p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="font-semibold text-gray-800">LIVE</span>
                        <span className="text-sm text-gray-500">{group.liveRoom!.participants.length} participants</span>
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">{group.liveRoom!.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">Topic: {group.liveRoom!.currentTopic}</p>
                      <button
                        onClick={() => onJoinLiveRoom?.(group.liveRoom!.id)}
                        className="w-full bg-gradient-primary text-white py-2 rounded-xl font-medium"
                      >
                        Join Room
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'challenges' && (
            <motion.div
              key="challenges"
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-3xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Active Challenges</h3>
                <div className="space-y-4">
                  {groups.flatMap(g => g.pinnedChallenges).filter(c => c.isActive).map(challenge => (
                    <div key={challenge.id} className="border border-gray-200 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800">{challenge.title}</h4>
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                          {challenge.participants} participants
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{challenge.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Deadline: {challenge.deadline.toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => onParticipateInChallenge?.(challenge.id)}
                          className="bg-gradient-primary text-white px-4 py-2 rounded-xl font-medium"
                        >
                          Participate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'remixes' && (
            <motion.div
              key="remixes"
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-3xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Remix Trees</h3>
                <div className="space-y-4">
                  {groups.flatMap(g => g.topRecipes).filter(r => r.remixes > 0).map(recipe => (
                    <RemixTree key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Group Detail Modal */}
      <AnimatePresence>
        {selectedGroup && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedGroup(null)}
          >
            <motion.div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedGroup.name}</h2>
                  <button
                    onClick={() => setSelectedGroup(null)}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
                
                <p className="text-gray-600 mb-6">{selectedGroup.description}</p>
                
                {/* Weekly Prompt */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">This Week's Challenge</h3>
                  <p className="text-gray-700">{selectedGroup.weeklyPrompt}</p>
                </div>
                
                {/* Top Recipes */}
                <h3 className="font-semibold text-gray-800 mb-4">Top Recipes</h3>
                <div className="space-y-3">
                  {selectedGroup.topRecipes.slice(0, 3).map(recipe => (
                    <div key={recipe.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <img
                        src={recipe.thumbnail}
                        alt={recipe.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{recipe.title}</div>
                        <div className="text-sm text-gray-600">by {recipe.creator.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Heart size={16} />
                          <span>{recipe.likes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Room Modal */}
      <AnimatePresence>
        {isInLiveRoom && selectedGroup?.liveRoom && (
          <LiveRoom
            room={selectedGroup.liveRoom}
            onLeave={() => setIsInLiveRoom(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;
