import { useState, useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage?: number;
  renderTime: number;
  loadTime: number;
  isLowPerformance: boolean;
}

interface PerformanceThresholds {
  lowFps: number;
  highMemory: number;
  slowRender: number;
}

export const usePerformanceMonitor = (
  thresholds: PerformanceThresholds = {
    lowFps: 30,
    highMemory: 50 * 1024 * 1024, // 50MB
    slowRender: 16.67 // 60fps threshold
  }
) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    renderTime: 0,
    loadTime: 0,
    isLowPerformance: false
  });

  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const animationFrameId = useRef<number>();
  const renderStartTime = useRef<number>();

  // Measure FPS
  const measureFPS = useCallback(() => {
    const currentTime = performance.now();
    frameCount.current++;

    if (currentTime - lastTime.current >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
      
      setMetrics(prev => ({
        ...prev,
        fps,
        isLowPerformance: fps < thresholds.lowFps
      }));

      frameCount.current = 0;
      lastTime.current = currentTime;
    }

    animationFrameId.current = requestAnimationFrame(measureFPS);
  }, [thresholds.lowFps]);

  // Measure memory usage (if available)
  const measureMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = memory.usedJSHeapSize;
      
      setMetrics(prev => ({
        ...prev,
        memoryUsage,
        isLowPerformance: prev.isLowPerformance || memoryUsage > thresholds.highMemory
      }));
    }
  }, [thresholds.highMemory]);

  // Measure render time
  const startRenderMeasure = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  const endRenderMeasure = useCallback(() => {
    if (renderStartTime.current) {
      const renderTime = performance.now() - renderStartTime.current;
      
      setMetrics(prev => ({
        ...prev,
        renderTime,
        isLowPerformance: prev.isLowPerformance || renderTime > thresholds.slowRender
      }));
    }
  }, [thresholds.slowRender]);

  // Measure page load time
  const measureLoadTime = useCallback(() => {
    if (performance.timing) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      
      setMetrics(prev => ({
        ...prev,
        loadTime
      }));
    }
  }, []);

  // Performance optimization suggestions
  const getOptimizationSuggestions = useCallback(() => {
    const suggestions: string[] = [];

    if (metrics.fps < thresholds.lowFps) {
      suggestions.push('Consider reducing animation complexity or using CSS transforms');
    }

    if (metrics.memoryUsage && metrics.memoryUsage > thresholds.highMemory) {
      suggestions.push('Memory usage is high - consider implementing virtual scrolling or lazy loading');
    }

    if (metrics.renderTime > thresholds.slowRender) {
      suggestions.push('Render time is slow - consider using React.memo or useMemo for expensive components');
    }

    return suggestions;
  }, [metrics, thresholds]);

  // Auto-optimize based on performance
  const autoOptimize = useCallback(() => {
    if (metrics.isLowPerformance) {
      // Reduce animation complexity
      document.documentElement.style.setProperty('--animation-duration', '0.2s');
      
      // Enable reduced motion if supported
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--animation-duration', '0s');
      }
    }
  }, [metrics.isLowPerformance]);

  // Start monitoring
  useEffect(() => {
    measureFPS();
    measureLoadTime();

    // Monitor memory usage every 5 seconds
    const memoryInterval = setInterval(measureMemory, 5000);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      clearInterval(memoryInterval);
    };
  }, [measureFPS, measureMemory, measureLoadTime]);

  // Auto-optimize when performance drops
  useEffect(() => {
    autoOptimize();
  }, [autoOptimize]);

  return {
    metrics,
    startRenderMeasure,
    endRenderMeasure,
    getOptimizationSuggestions,
    autoOptimize
  };
};
