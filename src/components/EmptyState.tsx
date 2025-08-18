import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'compact' | 'large';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default'
}) => {
  const iconSizes = {
    default: 'w-16 h-16',
    compact: 'w-12 h-12',
    large: 'w-20 h-20'
  };

  const iconContainerSizes = {
    default: 'w-20 h-20',
    compact: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  const titleSizes = {
    default: 'text-xl',
    compact: 'text-lg',
    large: 'text-2xl'
  };

  const descriptionSizes = {
    default: 'text-base',
    compact: 'text-sm',
    large: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-6">
      <div className={`${iconContainerSizes[variant]} bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4`}>
        <Icon className={`${iconSizes[variant]} text-slate-400 dark:text-slate-500`} />
      </div>
      
      <h3 className={`${titleSizes[variant]} font-semibold text-slate-900 dark:text-white mb-2`}>
        {title}
      </h3>
      
      <p className={`${descriptionSizes[variant]} text-slate-600 dark:text-slate-400 mb-6 max-w-sm`}>
        {description}
      </p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-2xl transition-colors duration-200"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

// Predefined empty states for common scenarios
export const EmptyFeed: React.FC<{ onCreateRecipe?: () => void }> = ({ onCreateRecipe }) => (
  <EmptyState
    icon={require('lucide-react').Utensils}
    title="No recipes yet"
    description="Be the first to share a delicious recipe with the community!"
    actionLabel="Create Recipe"
    onAction={onCreateRecipe}
    variant="large"
  />
);

export const EmptySaved: React.FC = () => (
  <EmptyState
    icon={require('lucide-react').Bookmark}
    title="No saved recipes"
    description="Save your favorite recipes to cook them later"
    variant="default"
  />
);

export const EmptySearch: React.FC = () => (
  <EmptyState
    icon={require('lucide-react').Search}
    title="No results found"
    description="Try adjusting your search terms or browse trending recipes"
    variant="default"
  />
);

export const EmptyProfile: React.FC<{ onCreateRecipe?: () => void }> = ({ onCreateRecipe }) => (
  <EmptyState
    icon={require('lucide-react').User}
    title="No recipes shared yet"
    description="Start sharing your culinary creations with the world!"
    actionLabel="Share First Recipe"
    onAction={onCreateRecipe}
    variant="default"
  />
);

export const EmptyComments: React.FC = () => (
  <EmptyState
    icon={require('lucide-react').MessageCircle}
    title="No comments yet"
    description="Be the first to share your thoughts on this recipe"
    variant="compact"
  />
);

export const EmptyNotifications: React.FC = () => (
  <EmptyState
    icon={require('lucide-react').Bell}
    title="All caught up!"
    description="You're up to date with all your notifications"
    variant="default"
  />
);

export default EmptyState;
