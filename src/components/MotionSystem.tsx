import React, { useState, useRef, useEffect } from 'react';
import { useSpring, animated, config } from 'react-spring';
import { gsap } from 'gsap';

// Motion System Component - Implements the $10k Polish Plan animations
export const MotionSystem: React.FC = () => {
  return null; // This is a utility component, not rendered directly
};

// Like Button with Heart Animation
interface LikeButtonProps {
  isLiked: boolean;
  onToggle: () => void;
  count: number;
  size?: 'sm' | 'md' | 'lg';
}

export const LikeButton: React.FC<LikeButtonProps> = ({ 
  isLiked, 
  onToggle, 
  count, 
  size = 'md' 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const heartRef = useRef<HTMLButtonElement>(null);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const heartScale = useSpring({
    transform: isAnimating ? 'scale(1.2)' : 'scale(1)',
    config: config.wobbly
  });

  const handleLike = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    onToggle();
    
    // Heart animation sequence
    gsap.timeline()
      .to(heartRef.current, {
        scale: 0.9,
        duration: 0.08,
        ease: "power2.out"
      })
      .to(heartRef.current, {
        scale: 1.1,
        duration: 0.08,
        ease: "power2.out"
      })
      .to(heartRef.current, {
        scale: 1.0,
        duration: 0.08,
        ease: "power2.out"
      })
      .call(() => setIsAnimating(false));

    // Confetti hearts effect
    createConfettiHearts();
  };

  const createConfettiHearts = () => {
    const colors = ['#FF7A00', '#FF3D54', '#FFD642', '#22C55E'];
    
    for (let i = 0; i < 8; i++) {
      const heart = document.createElement('div');
      heart.innerHTML = '❤️';
      heart.style.position = 'fixed';
      heart.style.left = `${Math.random() * 100}px`;
      heart.style.top = `${Math.random() * 100}px`;
      heart.style.fontSize = '16px';
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = '9999';
      heart.style.color = colors[Math.floor(Math.random() * colors.length)];
      
      document.body.appendChild(heart);
      
      gsap.to(heart, {
        y: -100 - Math.random() * 100,
        x: (Math.random() - 0.5) * 200,
        rotation: Math.random() * 360,
        opacity: 0,
        duration: 0.8 + Math.random() * 0.4,
        ease: "power2.out",
        onComplete: () => {
          if (heart && heart.parentNode) {
            heart.parentNode.removeChild(heart);
          }
        }
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <animated.button
        ref={heartRef}
        onClick={handleLike}
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ${
          isLiked 
            ? 'bg-gradient-to-br from-cb-coral to-cb-saffron shadow-cb-glow' 
            : 'bg-cb-slate/20 hover:bg-cb-slate/30'
        }`}
        style={heartScale}
      >
        <span className={`text-2xl transition-all duration-200 ${
          isLiked ? 'text-white' : 'text-cb-gray-600'
        }`}>
          {isLiked ? '❤️' : '🤍'}
        </span>
      </animated.button>
      
      <span className="text-cb-caption font-medium text-cb-gray-600">
        {count.toLocaleString()}
      </span>
    </div>
  );
};

// Save Button with Bookmark Animation
interface SaveButtonProps {
  isSaved: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const SaveButton: React.FC<SaveButtonProps> = ({ 
  isSaved, 
  onToggle, 
  size = 'md' 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const bookmarkRef = useRef<HTMLButtonElement>(null);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const bookmarkSpring = useSpring({
    transform: isAnimating ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
    config: config.wobbly
  });

  const handleSave = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    onToggle();
    
    // Bookmark curl animation
    gsap.timeline()
      .to(bookmarkRef.current, {
        scale: 1.1,
        rotation: 5,
        duration: 0.11,
        ease: "power2.out"
      })
      .to(bookmarkRef.current, {
        scale: 1.0,
        rotation: 0,
        duration: 0.11,
        ease: "power2.out"
      })
      .call(() => setIsAnimating(false));

    // Toast notification
    showSaveToast();
  };

  const showSaveToast = () => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-cb-slate text-white px-4 py-2 rounded-cb-lg shadow-cb-mid z-50';
    toast.textContent = isSaved ? 'Recipe saved!' : 'Recipe removed';
    
    document.body.appendChild(toast);
    
    gsap.fromTo(toast, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
    );
    
    setTimeout(() => {
      gsap.to(toast, {
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          if (toast && toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }
      });
    }, 2000);
  };

  return (
    <animated.button
      ref={bookmarkRef}
      onClick={handleSave}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ${
        isSaved 
          ? 'bg-gradient-to-br from-cb-lemon to-cb-saffron shadow-cb-glow' 
          : 'bg-cb-slate/20 hover:bg-cb-slate/30'
      }`}
      style={bookmarkSpring}
    >
      <span className={`text-xl transition-all duration-200 ${
        isSaved ? 'text-white' : 'text-cb-gray-600'
      }`}>
        {isSaved ? '🔖' : '📖'}
      </span>
    </animated.button>
  );
};

// Progress Bar with Liquid Fill Animation
interface ProgressBarProps {
  progress: number; // 0-100
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  isAnimated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  height = 'md', 
  showLabel = true,
  isAnimated = true
}) => {
  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const progressSpring = useSpring({
    width: `${progress}%`,
    config: isAnimated ? config.wobbly : config.default
  });

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-cb-caption text-cb-gray-600">Progress</span>
          <span className="text-cb-caption font-medium text-cb-charcoal">
            {Math.round(progress)}%
          </span>
        </div>
      )}
      
      <div className={`w-full ${heightClasses[height]} bg-cb-gray-200 rounded-full overflow-hidden shadow-cb-low`}>
        <animated.div
          className="h-full bg-gradient-to-r from-cb-saffron via-cb-coral to-cb-lemon rounded-full relative"
          style={progressSpring}
        >
          {/* Liquid shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse-glow" />
        </animated.div>
      </div>
    </div>
  );
};

// Follow Button with Pulse Ring Animation
interface FollowButtonProps {
  isFollowing: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const FollowButton: React.FC<FollowButtonProps> = ({ 
  isFollowing, 
  onToggle, 
  size = 'md' 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const pulseSpring = useSpring({
    scale: isAnimating ? 1.05 : 1,
    config: config.wobbly
  });

  const handleFollow = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    onToggle();
    
    // Pulse ring animation
    gsap.timeline()
      .to(buttonRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      })
      .to(buttonRef.current, {
        scale: 1.0,
        duration: 0.3,
        ease: "power2.out"
      })
      .call(() => setIsAnimating(false));

    // Haptic feedback simulation
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  return (
    <animated.button
      ref={buttonRef}
      onClick={handleFollow}
      className={`${sizeClasses[size]} rounded-cb-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
        isFollowing
          ? 'bg-cb-gray-200 text-cb-charcoal hover:bg-cb-gray-300'
          : 'bg-gradient-cta text-white shadow-cb-mid hover:shadow-cb-high'
      }`}
      style={pulseSpring}
    >
      {isFollowing ? 'Following' : 'Follow'}
      
      {/* Pulse ring effect */}
      {isAnimating && (
        <div className="absolute inset-0 rounded-cb-lg border-2 border-cb-saffron/50 animate-pulse-glow" />
      )}
    </animated.button>
  );
};

// Tab Navigation with Gliding Underline
interface TabNavigationProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange 
}) => {
  const underlineSpring = useSpring({
    transform: `translateX(${activeTab * 100}%)`,
    config: config.wobbly
  });

  return (
    <div className="relative">
      <div className="flex space-x-8 border-b border-cb-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => onTabChange(index)}
            className={`pb-3 px-1 transition-all duration-180 ${
              activeTab === index
                ? 'text-cb-charcoal font-semibold'
                : 'text-cb-gray-600 hover:text-cb-charcoal'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Gliding underline */}
      <animated.div
        className="absolute bottom-0 left-0 w-1/3 h-0.5 bg-gradient-to-r from-cb-saffron to-cb-coral rounded-full"
        style={underlineSpring}
      />
    </div>
  );
};

// Loading Skeleton with Shimmer
interface SkeletonProps {
  type: 'text' | 'avatar' | 'card' | 'button';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ type, className = '' }) => {
  const baseClasses = 'animate-pulse bg-cb-gray-200 rounded';
  
  const typeClasses = {
    text: 'h-4 w-full',
    avatar: 'w-12 h-12 rounded-full',
    card: 'w-full h-32 rounded-cb-lg',
    button: 'h-10 w-24 rounded-cb-lg'
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
      {/* Shimmer effect */}
      <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse-glow" />
    </div>
  );
};

// Floating Action Button with Ripple Effect
interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success';
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  icon, 
  onClick, 
  size = 'md',
  color = 'primary'
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const colorClasses = {
    primary: 'bg-gradient-cta shadow-cb-high',
    secondary: 'bg-cb-slate text-white shadow-cb-mid',
    success: 'bg-cb-success text-white shadow-cb-mid'
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
    
    onClick();
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full flex items-center justify-center transition-all duration-120 hover:scale-105 active:scale-95 shadow-cb-high hover:shadow-cb-glow`}
      >
        <span className="text-2xl">{icon}</span>
        
        {/* Ripple effects */}
        {ripples.map(ripple => (
          <div
            key={ripple.id}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-ripple pointer-events-none"
            style={{
              left: ripple.x - 4,
              top: ripple.y - 4
            }}
          />
        ))}
      </button>
    </div>
  );
};

export default MotionSystem;
