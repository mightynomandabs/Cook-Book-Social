import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, Play, Volume2, VolumeX } from 'lucide-react';

interface RecipeVideoCardProps {
  recipe: {
    id: number;
    title: string;
    creator: {
      name: string;
      avatar: string;
    };
    videoUrl: string;
    thumbnail: string;
    description: string;
    likes: number;
    comments: number;
    shares: number;
    isSaved: boolean;
    isLiked: boolean;
    tags: string[];
    duration: string;
  };
  isActive: boolean;
}

const RecipeVideoCard: React.FC<RecipeVideoCardProps> = ({ recipe, isActive }) => {
  const [isLiked, setIsLiked] = useState(recipe.isLiked);
  const [isSaved, setIsSaved] = useState(recipe.isSaved);
  const [likesCount, setLikesCount] = useState(recipe.likes);
  const [isMuted, setIsMuted] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* Video Background (Placeholder) */}
      <div className="absolute inset-0 bg-gradient-to-br from-cookbook-black/40 via-cookbook-orange/20 to-cookbook-yellow/30 flex items-center justify-center">
        <div className="text-8xl">{recipe.thumbnail}</div>
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-cookbook-yellow/30 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-cookbook-yellow/50">
            <Play size={40} className="text-white ml-1" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
          {recipe.duration}
        </div>

        {/* Mute/Unmute Button */}
        <button
          onClick={handleMute}
          className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {/* Right Side Action Buttons (TikTok Style) */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6 z-20">
        {/* Creator Avatar */}
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-cookbook-yellow/20 flex items-center justify-center text-2xl border-2 border-cookbook-yellow">
            {recipe.creator.avatar}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-cookbook-green rounded-full border-2 border-cookbook-yellow"></div>
        </div>

        {/* Like Button */}
        <button
          onClick={handleLike}
          className="flex flex-col items-center space-y-1"
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isLiked ? 'bg-cookbook-yellow' : 'bg-white/20'
          } transition-colors`}>
                         <Heart 
               size={24} 
               className={isLiked ? 'text-cookbook-black' : 'text-white'} 
               fill={isLiked ? 'currentColor' : 'none'} 
             />
          </div>
          <span className="text-white text-xs font-medium">{likesCount}</span>
        </button>

        {/* Comment Button */}
        <button className="flex flex-col items-center space-y-1">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle size={24} className="text-white" />
          </div>
          <span className="text-white text-xs font-medium">{recipe.comments}</span>
        </button>

        {/* Share Button */}
        <button className="flex flex-col items-center space-y-1">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Share2 size={24} className="text-white" />
          </div>
          <span className="text-white text-xs font-medium">{recipe.shares}</span>
        </button>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="flex flex-col items-center space-y-1"
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isSaved ? 'bg-cookbook-yellow' : 'bg-white/20'
          } transition-colors`}>
            <Bookmark 
              size={24} 
              className={isSaved ? 'text-cookbook-black' : 'text-white'} 
              fill={isSaved ? 'currentColor' : 'none'} 
            />
          </div>
          <span className="text-white text-xs font-medium">Save</span>
        </button>
      </div>

      {/* Bottom Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        {/* Creator Info */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-cookbook-yellow/20 flex items-center justify-center text-lg border border-cookbook-yellow/30">
            {recipe.creator.avatar}
          </div>
          <div>
            <p className="text-white font-semibold text-sm">@{recipe.creator.name}</p>
            <p className="text-white/80 text-xs">Follow</p>
          </div>
        </div>

        {/* Recipe Title & Description */}
        <div className="mb-3">
          <h3 className="text-white font-bold text-lg mb-2 font-poppins">
            {recipe.title}
          </h3>
          <p className="text-white/90 text-sm leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {recipe.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full backdrop-blur-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeVideoCard;
