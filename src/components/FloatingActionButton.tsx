import React, { useState } from 'react';
import { Plus, X, Camera, Edit3, Heart } from 'lucide-react';

interface FloatingActionButtonProps {
  onMainAction: () => void;
  onCameraAction?: () => void;
  onEditAction?: () => void;
  onLikeAction?: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onMainAction,
  onCameraAction,
  onEditAction,
  onLikeAction
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMainAction = () => {
    if (isExpanded) {
      toggleExpanded();
    } else {
      onMainAction();
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-30">
      {/* Secondary action buttons */}
      {isExpanded && (
        <div className="mb-4 space-y-3">
          {onCameraAction && (
            <button
              onClick={onCameraAction}
              className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center text-white transform hover:scale-110 transition-all duration-200"
            >
              <Camera className="w-6 h-6" />
            </button>
          )}
          
          {onEditAction && (
            <button
              onClick={onEditAction}
              className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg shadow-green-500/25 flex items-center justify-center text-white transform hover:scale-110 transition-all duration-200"
            >
              <Edit3 className="w-6 h-6" />
            </button>
          )}
          
          {onLikeAction && (
            <button
              onClick={onLikeAction}
              className="w-14 h-14 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl shadow-lg shadow-pink-500/25 flex items-center justify-center text-white transform hover:scale-110 transition-all duration-200"
            >
              <Heart className="w-6 h-6" />
            </button>
          )}
        </div>
      )}

      {/* Main action button */}
      <button
        onClick={handleMainAction}
        className={`w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl shadow-xl shadow-orange-500/25 flex items-center justify-center text-white transform hover:scale-110 transition-all duration-300 ${
          isExpanded ? 'rotate-45' : ''
        }`}
      >
        {isExpanded ? (
          <X className="w-8 h-8" />
        ) : (
          <Plus className="w-8 h-8" />
        )}
      </button>
    </div>
  );
};

export default FloatingActionButton;
