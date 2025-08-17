import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// WebGL Feature Detection
const detectWebGLSupport = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
};

// Performance Monitor
const usePerformanceMonitor = () => {
  const [fps, setFps] = useState(60);
  const [isThrottled, setIsThrottled] = useState(false);
  
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const currentFps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setFps(currentFps);
        
        // Auto-throttle if FPS drops below 40 for 2 seconds
        if (currentFps < 40) {
          setIsThrottled(true);
          setTimeout(() => setIsThrottled(false), 2000);
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }, []);
  
  return { fps, isThrottled };
};

// Heat Shimmer Effect (WebGL + CSS Fallback)
interface HeatShimmerProps {
  intensity?: number;
  speed?: number;
  children: React.ReactNode;
}

export const HeatShimmer: React.FC<HeatShimmerProps> = ({ 
  intensity = 0.02, 
  speed = 2,
  children 
}) => {
  const [useWebGL, setUseWebGL] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const hasWebGL = detectWebGLSupport();
    setUseWebGL(hasWebGL);
    
    if (hasWebGL && canvasRef.current) {
      initHeatShimmer();
    }
  }, []);
  
  const initHeatShimmer = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gl = canvas.getContext('webgl');
    if (!gl) return;
    
    // Vertex shader for heat distortion
    const vertexShader = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;
    
    // Fragment shader with simplex noise heat distortion
    const fragmentShader = `
      precision mediump float;
      uniform float u_time;
      uniform float u_intensity;
      uniform vec2 u_resolution;
      varying vec2 v_texCoord;
      
      // Simplex noise function (simplified)
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      void main() {
        vec2 uv = v_texCoord;
        float time = u_time * 0.001;
        
        // Heat distortion using noise
        float distortion = noise(uv * 10.0 + time) * u_intensity;
        vec2 distortedUV = uv + vec2(distortion, distortion * 0.5);
        
        // Sample the texture with distortion
        gl_FragColor = vec4(distortedUV, 0.0, 1.0);
      }
    `;
    
    // Create shader program
    const program = createShaderProgram(gl, vertexShader, fragmentShader);
    if (!program) return;
    
    // Set up geometry and render loop
    const render = () => {
      const time = performance.now();
      gl.uniform1f(gl.getUniformLocation(program, 'u_time'), time);
      gl.uniform1f(gl.getUniformLocation(program, 'u_intensity'), intensity);
      gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), canvas.width, canvas.height);
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };
    
    render();
  }, [intensity]);
  
  const createShaderProgram = (gl: WebGLRenderingContext, vsSource: string, fsSource: string) => {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    
    if (!vertexShader || !fragmentShader) return null;
    
    const program = gl.createProgram();
    if (!program) return null;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Unable to initialize shader program');
      return null;
    }
    
    return program;
  };
  
  const loadShader = (gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  };
  
  if (useWebGL) {
    return (
      <div ref={containerRef} className="relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
  
  // CSS Fallback for heat shimmer
  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        filter: `blur(${intensity * 2}px)`,
        animation: `heatShimmer ${speed}s ease-in-out infinite`
      }}
    >
      {children}
    </div>
  );
};

// Bokeh Steam Particles
interface BokehSteamProps {
  particleCount?: number;
  intensity?: number;
  className?: string;
}

export const BokehSteam: React.FC<BokehSteamProps> = ({ 
  particleCount = 50, 
  intensity = 1,
  className = '' 
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
    angle: number;
  }>>([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.3 + 0.1,
      speed: Math.random() * 0.5 + 0.2,
      angle: Math.random() * Math.PI * 2
    }));
    
    setParticles(newParticles);
  }, [particleCount]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y - particle.speed * intensity,
        x: particle.x + Math.sin(particle.angle) * 0.5 * intensity,
        opacity: particle.opacity * 0.99
      })).filter(particle => particle.y > -10 && particle.opacity > 0.01));
    }, 50);
    
    return () => clearInterval(interval);
  }, [intensity]);
  
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white/20 backdrop-blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            transform: `translate(-50%, -50%)`,
            filter: 'blur(1px)'
          }}
        />
      ))}
    </div>
  );
};

// Liquid Fill Progress
interface LiquidFillProps {
  progress: number; // 0-100
  height?: number;
  color?: string;
  animated?: boolean;
  className?: string;
}

export const LiquidFill: React.FC<LiquidFillProps> = ({
  progress,
  height = 8,
  color = 'var(--cb-gradient-primary)',
  animated = true,
  className = ''
}) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setCurrentProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setCurrentProgress(progress);
    }
  }, [progress, animated]);
  
  return (
    <div 
      className={`relative overflow-hidden rounded-full ${className}`}
      style={{ height: `${height}px` }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700" />
      
      {/* Liquid fill */}
      <motion.div
        className="absolute bottom-0 left-0 h-full rounded-full"
        style={{
          background: color,
          width: `${currentProgress}%`
        }}
        initial={{ width: 0 }}
        animate={{ width: `${currentProgress}%` }}
        transition={{
          duration: animated ? 0.8 : 0,
          ease: "easeOut"
        }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse-glow" />
        
        {/* Bubbles */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/30 rounded-full animate-bounce-soft" />
        <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-white/20 rounded-full animate-bounce-soft" style={{ animationDelay: '0.5s' }} />
      </motion.div>
    </div>
  );
};

// Particle Emitter for Like Burst
interface ParticleEmitterProps {
  isActive: boolean;
  particleCount?: number;
  colors?: string[];
  onComplete?: () => void;
}

export const ParticleEmitter: React.FC<ParticleEmitterProps> = ({
  isActive,
  particleCount = 20,
  colors = ['#FF7A00', '#FF3D71', '#FFD166', '#22C55E'],
  onComplete
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rotation: number;
    rotationSpeed: number;
  }>>([]);
  
  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: 50, // Center
        y: 50,
        vx: (Math.random() - 0.5) * 200,
        vy: (Math.random() - 0.5) * 200 - 100, // Upward bias
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 720
      }));
      
      setParticles(newParticles);
      
      // Clean up particles after animation
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, particleCount, colors, onComplete]);
  
  if (!isActive || particles.length === 0) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`
          }}
          initial={{ 
            scale: 0,
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0
          }}
          animate={{
            scale: [0, 1, 0.8],
            opacity: [1, 1, 0],
            x: particle.vx,
            y: particle.vy,
            rotate: particle.rotation + particle.rotationSpeed
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

// 3D Badge with Bloom Effect
interface Badge3DProps {
  isVisible: boolean;
  icon: string;
  title: string;
  subtitle?: string;
  onComplete?: () => void;
}

export const Badge3D: React.FC<Badge3DProps> = ({
  isVisible,
  icon,
  title,
  subtitle,
  onComplete
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Bloom backdrop */}
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-yellow-400/20 via-orange-500/10 to-transparent"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          
          {/* Badge */}
          <motion.div
            className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-yellow-200 dark:border-yellow-800"
            initial={{ 
              scale: 0,
              rotateY: -90,
              opacity: 0
            }}
            animate={{ 
              scale: 1,
              rotateY: 0,
              opacity: 1
            }}
            transition={{ 
              duration: 0.6,
              ease: "easeOut",
              delay: 0.1
            }}
            onAnimationComplete={onComplete}
          >
            {/* Icon */}
            <motion.div
              className="text-6xl mb-4 text-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            >
              {icon}
            </motion.div>
            
            {/* Title */}
            <motion.h3
              className="text-xl font-bold text-center text-gray-800 dark:text-white mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
            >
              {title}
            </motion.h3>
            
            {/* Subtitle */}
            {subtitle && (
              <motion.p
                className="text-sm text-center text-gray-600 dark:text-gray-300"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
              >
                {subtitle}
              </motion.p>
            )}
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.8 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main WebGL Motion System Component
export const WebGLMotionSystem: React.FC = () => {
  const { fps, isThrottled } = usePerformanceMonitor();
  const [showBadge, setShowBadge] = useState(false);
  const [likeBurst, setLikeBurst] = useState(false);
  
  return (
    <div className="relative">
      {/* Performance Monitor */}
      <div className="fixed top-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-mono z-50">
        <div>FPS: {fps}</div>
        {isThrottled && <div className="text-yellow-400">Throttled</div>}
      </div>
      
      {/* Demo Controls */}
      <div className="fixed bottom-4 left-4 space-y-2 z-50">
        <button
          onClick={() => setLikeBurst(true)}
          className="bg-gradient-primary text-white px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform"
        >
          Like Burst
        </button>
        
        <button
          onClick={() => setShowBadge(true)}
          className="bg-gradient-primary text-white px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform"
        >
          Show Badge
        </button>
      </div>
      
      {/* Particle Effects */}
      <ParticleEmitter
        isActive={likeBurst}
        onComplete={() => setLikeBurst(false)}
      />
      
      {/* 3D Badge */}
      <Badge3D
        isVisible={showBadge}
        icon="🏆"
        title="Achievement Unlocked!"
        subtitle="You're on fire!"
        onComplete={() => setShowBadge(false)}
      />
      
      {/* Heat Shimmer Demo */}
      <div className="p-8">
        <HeatShimmer intensity={0.03} speed={3}>
          <div className="bg-gradient-primary text-white p-8 rounded-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">CookBook App</h2>
            <p className="text-lg">Where foodies find their feed</p>
          </div>
        </HeatShimmer>
      </div>
      
      {/* Bokeh Steam Demo */}
      <div className="relative h-64 bg-gradient-to-b from-blue-900 to-purple-900 rounded-2xl mx-8 mb-8">
        <BokehSteam particleCount={80} intensity={1.5} />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-white text-center">
            <h3 className="text-2xl font-bold mb-2">Steamy Kitchen</h3>
            <p className="text-blue-200">Watch the magic happen</p>
          </div>
        </div>
      </div>
      
      {/* Liquid Fill Demo */}
      <div className="p-8 space-y-4">
        <h3 className="text-xl font-bold text-center">Progress Examples</h3>
        <LiquidFill progress={75} height={12} className="w-full" />
        <LiquidFill progress={45} height={8} className="w-full" />
        <LiquidFill progress={90} height={16} className="w-full" />
      </div>
    </div>
  );
};

export default WebGLMotionSystem;
