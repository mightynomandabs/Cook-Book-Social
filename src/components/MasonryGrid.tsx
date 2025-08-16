import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

interface MasonryGridProps {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  columns?: number;
  gap?: number;
  className?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({
  items,
  renderItem,
  columns = 2,
  gap = 16,
  className = '',
  onLoadMore,
  hasMore = false,
  loading = false
}) => {
  const [columnHeights, setColumnHeights] = useState<number[]>(new Array(columns).fill(0));
  const [itemPositions, setItemPositions] = useState<{ x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Intersection observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  // Calculate item positions for masonry layout
  const calculateLayout = useCallback(() => {
    if (!items.length) return;

    const newColumnHeights = new Array(columns).fill(0);
    const newItemPositions: { x: number; y: number }[] = [];

    items.forEach((_, index) => {
      // Find the shortest column
      const shortestColumnIndex = newColumnHeights.indexOf(Math.min(...newColumnHeights));
      
      // Calculate position
      const x = shortestColumnIndex * (100 / columns) + (gap / 2);
      const y = newColumnHeights[shortestColumnIndex];
      
      newItemPositions[index] = { x, y };
      
      // Update column height (assuming item height is roughly 300px for now)
      // In a real implementation, you'd measure actual item heights
      newColumnHeights[shortestColumnIndex] += 300 + gap;
    });

    setColumnHeights(newColumnHeights);
    setItemPositions(newItemPositions);
  }, [items, columns, gap]);

  // Recalculate layout when items or columns change
  useEffect(() => {
    calculateLayout();
  }, [calculateLayout]);

  // Handle infinite scroll
  useEffect(() => {
    if (inView && hasMore && !loading && onLoadMore) {
      onLoadMore();
    }
  }, [inView, hasMore, loading, onLoadMore]);

  // Memoize the grid items to prevent unnecessary re-renders
  const gridItems = useMemo(() => {
    return items.map((item, index) => {
      const position = itemPositions[index];
      if (!position) return null;

      return (
        <div
          key={`${item.id || index}-${index}`}
          ref={(el) => (itemRefs.current[index] = el)}
          className="absolute transition-all duration-500 ease-out transform hover:scale-105 hover:z-10"
          style={{
            left: `${position.x}%`,
            top: `${position.y}px`,
            width: `calc(${100 / columns}% - ${gap}px)`,
            transform: 'translateZ(0)' // Force hardware acceleration
          }}
        >
          {renderItem(item, index)}
        </div>
      );
    });
  }, [items, itemPositions, columns, gap, renderItem]);

  // Container height calculation
  const containerHeight = Math.max(...columnHeights);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div
        className="relative w-full"
        style={{ height: `${containerHeight}px` }}
      >
        {gridItems}
      </div>
      
      {/* Load more trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-600 dark:text-slate-400">Loading more...</span>
            </div>
          ) : (
            <div className="h-4" /> // Invisible trigger
          )}
        </div>
      )}
    </div>
  );
};

export default MasonryGrid;
