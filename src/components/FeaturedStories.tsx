import React from 'react';
import { Story } from '../types';

interface FeaturedStoriesProps {
  stories: Story[];
}

const FeaturedStories: React.FC<FeaturedStoriesProps> = ({ stories }) => {
  const getRingColor = (index: number) => {
    const colors = ['cookbook-orange', 'cookbook-yellow', 'cookbook-green'];
    return colors[index % colors.length];
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-cookbook-black mb-4">Trending Stories</h3>
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        {stories.map((story, index) => (
          <div key={story.id} className="flex-shrink-0 text-center">
            <div className="relative">
              {/* Story Ring */}
              <div className={`w-20 h-20 rounded-full p-1 bg-gradient-to-br from-${getRingColor(index)} to-${getRingColor(index)}/70`}>
                <div className="w-full h-full rounded-full overflow-hidden bg-white p-0.5">
                  <img
                    src={story.image}
                    alt={story.user.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              
              {/* Online Indicator */}
              {story.user.isRestaurant && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-cookbook-green rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs">🏪</span>
                </div>
              )}
            </div>
            
            <p className="text-xs text-gray-600 mt-2 font-medium truncate w-20">
              {story.user.name}
            </p>
            
            <p className="text-xs text-gray-500 mt-1 truncate w-20">
              {story.caption}
            </p>
          </div>
        ))}
        
        {/* Add Story Button */}
        <div className="flex-shrink-0 text-center">
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
            <span className="text-2xl text-gray-400">+</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Add Story</p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedStories;
