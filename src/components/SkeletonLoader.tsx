import React from 'react';

interface SkeletonLoaderProps {
  type: 'card' | 'story' | 'profile' | 'text';
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type, className = '' }) => {
  const baseClasses = 'animate-pulse bg-slate-200 rounded';

  switch (type) {
    case 'card':
      return (
        <div className={`bg-white rounded-3xl shadow-lg overflow-hidden ${className}`}>
          {/* Image skeleton */}
          <div className="h-56 bg-slate-200 animate-pulse"></div>
          
          {/* Content skeleton */}
          <div className="p-6 space-y-4">
            {/* Creator info skeleton */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-3 w-16 bg-slate-200 rounded animate-pulse"></div>
              </div>
            </div>
            
            {/* Title skeleton */}
            <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse"></div>
            
            {/* Tags skeleton */}
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-slate-200 rounded-xl animate-pulse"></div>
              <div className="h-6 w-20 bg-slate-200 rounded-xl animate-pulse"></div>
              <div className="h-6 w-14 bg-slate-200 rounded-xl animate-pulse"></div>
            </div>
            
            {/* Text skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      );

    case 'story':
      return (
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-slate-200 animate-pulse mx-auto"></div>
          <div className="mt-3 space-y-2">
            <div className="h-4 w-20 bg-slate-200 rounded animate-pulse mx-auto"></div>
            <div className="h-3 w-16 bg-slate-200 rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      );

    case 'profile':
      return (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-200 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-3 w-16 bg-slate-200 rounded animate-pulse"></div>
          </div>
        </div>
      );

    case 'text':
      return (
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse"></div>
        </div>
      );

    default:
      return <div className={`h-4 w-full ${baseClasses} ${className}`}></div>;
  }
};

export default SkeletonLoader;
