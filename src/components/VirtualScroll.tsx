import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

const VirtualScroll = <T,>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = ''
}: VirtualScrollProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
    );
    
    return { startIndex, endIndex };
  }, [scrollTop, containerHeight, itemHeight, overscan, items.length]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange.startIndex, visibleRange.endIndex]);

  // Calculate total height for scrollbar
  const totalHeight = items.length * itemHeight;

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Scroll to specific item
  const scrollToItem = useCallback((index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTop = index * itemHeight;
    }
  }, [itemHeight]);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  // Auto-scroll to top when items change
  useEffect(() => {
    scrollToTop();
  }, [items.length, scrollToTop]);

  return (
    <div className={`virtual-scroll ${className}`}>
      {/* Scroll to top button */}
      {scrollTop > 100 && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 left-6 z-40 w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg shadow-orange-500/25 flex items-center justify-center transition-all duration-200 hover:scale-110"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Virtual scroll container */}
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        {/* Spacer for total height */}
        <div style={{ height: totalHeight, position: 'relative' }}>
          {/* Visible items */}
          {visibleItems.map((item, index) => {
            const actualIndex = visibleRange.startIndex + index;
            return (
              <div
                key={actualIndex}
                style={{
                  position: 'absolute',
                  top: actualIndex * itemHeight,
                  height: itemHeight,
                  width: '100%'
                }}
              >
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll position indicator */}
      <div className="fixed top-4 right-4 z-40 bg-slate-800/80 text-white px-3 py-2 rounded-lg text-sm backdrop-blur-sm">
        {Math.floor(scrollTop / itemHeight) + 1} / {items.length}
      </div>
    </div>
  );
};

export default VirtualScroll;
