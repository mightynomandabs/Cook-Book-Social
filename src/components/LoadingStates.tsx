import React from 'react';

// Shimmer effect component
const Shimmer: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 ${className}`} />
);

// Recipe card skeleton
export const RecipeCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
    {/* Image placeholder */}
    <div className="aspect-[4/5] relative overflow-hidden">
      <Shimmer className="w-full h-full" />
    </div>
    
    {/* Content */}
    <div className="p-4 space-y-3">
      {/* Creator info */}
      <div className="flex items-center space-x-3">
        <Shimmer className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-3 w-16" />
        </div>
      </div>
      
      {/* Recipe title */}
      <Shimmer className="h-5 w-3/4" />
      
      {/* Engagement stats */}
      <div className="flex items-center space-x-4">
        <Shimmer className="h-4 w-12" />
        <Shimmer className="h-4 w-12" />
        <Shimmer className="h-4 w-12" />
      </div>
    </div>
  </div>
);

// Feed skeleton with multiple recipe cards
export const FeedSkeleton: React.FC = () => (
  <div className="space-y-6 p-4">
    {Array.from({ length: 5 }).map((_, index) => (
      <RecipeCardSkeleton key={index} />
    ))}
  </div>
);

// Profile skeleton
export const ProfileSkeleton: React.FC = () => (
  <div className="p-6 space-y-6">
    {/* Header */}
    <div className="text-center space-y-4">
      <Shimmer className="w-24 h-24 rounded-full mx-auto" />
      <Shimmer className="h-6 w-32 mx-auto" />
      <Shimmer className="h-4 w-48 mx-auto" />
    </div>
    
    {/* Stats */}
    <div className="flex justify-around">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="text-center">
          <Shimmer className="h-6 w-8 mx-auto mb-1" />
          <Shimmer className="h-3 w-16 mx-auto" />
        </div>
      ))}
    </div>
    
    {/* Bio */}
    <div className="space-y-2">
      <Shimmer className="h-4 w-full" />
      <Shimmer className="h-4 w-3/4" />
    </div>
  </div>
);

// Recipe detail skeleton
export const RecipeDetailSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Hero image */}
    <div className="aspect-[4/3] relative">
      <Shimmer className="w-full h-full" />
    </div>
    
    {/* Content */}
    <div className="p-6 space-y-6">
      {/* Title and creator */}
      <div className="space-y-3">
        <Shimmer className="h-8 w-3/4" />
        <div className="flex items-center space-x-3">
          <Shimmer className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <Shimmer className="h-4 w-24" />
            <Shimmer className="h-3 w-16" />
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="flex space-x-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="text-center">
            <Shimmer className="h-5 w-8 mx-auto mb-1" />
            <Shimmer className="h-3 w-12 mx-auto" />
          </div>
        ))}
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-5/6" />
        <Shimmer className="h-4 w-4/5" />
      </div>
      
      {/* Ingredients */}
      <div className="space-y-3">
        <Shimmer className="h-5 w-24" />
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-3">
            <Shimmer className="w-2 h-2 rounded-full" />
            <Shimmer className="h-4 flex-1" />
          </div>
        ))}
      </div>
      
      {/* Method */}
      <div className="space-y-3">
        <Shimmer className="h-5 w-20" />
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Shimmer className="h-4 w-16" />
            <Shimmer className="h-4 w-full" />
            <Shimmer className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Comment skeleton
export const CommentSkeleton: React.FC = () => (
  <div className="flex space-x-3 p-4">
    <Shimmer className="w-10 h-10 rounded-full flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="flex items-center space-x-2">
        <Shimmer className="h-4 w-20" />
        <Shimmer className="h-3 w-16" />
      </div>
      <Shimmer className="h-4 w-full" />
      <Shimmer className="h-4 w-3/4" />
    </div>
  </div>
);

// Comments list skeleton
export const CommentsSkeleton: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <CommentSkeleton key={index} />
    ))}
  </div>
);

// Search skeleton
export const SearchSkeleton: React.FC = () => (
  <div className="p-4 space-y-4">
    {/* Search bar */}
    <Shimmer className="h-12 w-full rounded-2xl" />
    
    {/* Results */}
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3">
          <Shimmer className="w-12 h-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Shimmer className="h-4 w-3/4" />
            <Shimmer className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Button skeleton
export const ButtonSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <Shimmer className={`h-12 rounded-2xl ${className}`} />
);

// Input skeleton
export const InputSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <Shimmer className={`h-12 rounded-2xl ${className}`} />
);

// Full page loading
export const PageLoading: React.FC = () => (
  <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <Shimmer className="h-4 w-32 mx-auto" />
    </div>
  </div>
);

// Inline loading spinner
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  
  return (
    <div className={`${sizes[size]} border-2 border-orange-500 border-t-transparent rounded-full animate-spin`} />
  );
};
