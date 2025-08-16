import React from 'react';
import { Story } from '../types';

interface FeaturedStoriesProps {
  stories: Story[];
}

const FeaturedStories: React.FC<FeaturedStoriesProps> = ({ stories }) => {
  const getRingColor = (index: number) => {
    const colors = [
      'from-orange-500 to-red-500',
      'from-purple-500 to-pink-500', 
      'from-blue-500 to-indigo-500',
      'from-green-500 to-emerald-500',
      'from-yellow-500 to-orange-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Trending Stories</h3>
      <div className="flex space-x-5 overflow-x-auto pb-4 scrollbar-hide">
        {stories.map((story, index) => (
          <div key={story.id} className="flex-shrink-0 text-center group cursor-pointer">
            <div className="relative">
              {/* Story Ring */}
              <div className={`w-24 h-24 rounded-full p-1.5 bg-gradient-to-br ${getRingColor(index)} shadow-lg`}>
                <div className="w-full h-full rounded-full overflow-hidden bg-white p-1 shadow-inner">
                  <img
                    src={story.image}
                    alt={story.user.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              
              {/* Online Indicator */}
              {story.user.isRestaurant && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                  <span className="text-xs">🏪</span>
                </div>
              )}
            </div>
            
            <p className="text-sm text-slate-800 mt-3 font-semibold truncate w-24">
              {story.user.name}
            </p>
            
            <p className="text-xs text-slate-500 mt-1 truncate w-24">
              {story.caption}
            </p>
          </div>
        ))}
        
        {/* Add Story Button */}
        <div className="flex-shrink-0 text-center group cursor-pointer">
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 group-hover:border-slate-400 group-hover:bg-slate-100 transition-all duration-200">
            <span className="text-3xl text-slate-400 group-hover:text-slate-500">+</span>
          </div>
          <p className="text-sm text-slate-600 mt-3 font-medium">Add Story</p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedStories;
