import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ 
  onRefresh, 
  children, 
  threshold = 80 
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || isRefreshing) return;
      
      currentY.current = e.touches[0].clientY;
      const distance = Math.max(0, currentY.current - startY.current);
      
      if (distance > 0) {
        setPullDistance(distance);
        e.preventDefault();
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling || isRefreshing) return;
      
      if (pullDistance >= threshold) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }
      
      setPullDistance(0);
      setIsPulling(false);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, isRefreshing, pullDistance, threshold, onRefresh]);

  const refreshIndicatorStyle = {
    transform: `translateY(${Math.min(pullDistance, threshold)}px)`,
    opacity: Math.min(pullDistance / threshold, 1),
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Pull to refresh indicator */}
      <div 
        className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 bg-gradient-to-b from-orange-50 to-transparent z-10 transition-all duration-200"
        style={refreshIndicatorStyle}
      >
        <div className="flex items-center space-x-2 text-orange-600">
          {isRefreshing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Refreshing...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              <span className="text-sm font-medium">
                {pullDistance >= threshold ? 'Release to refresh' : 'Pull to refresh'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div 
        className="transition-transform duration-200"
        style={{
          transform: `translateY(${isPulling ? Math.min(pullDistance * 0.3, threshold * 0.3) : 0}px)`
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
