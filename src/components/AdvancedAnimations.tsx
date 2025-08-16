import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';

interface AdvancedAnimationsProps {
  children: React.ReactNode;
  className?: string;
}

// Stagger animation for lists
export const StaggerContainer: React.FC<AdvancedAnimationsProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

// Stagger item animation
export const StaggerItem: React.FC<AdvancedAnimationsProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { 
          opacity: 0, 
          y: 20, 
          scale: 0.95 
        },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

// Parallax scroll effect
export const ParallaxContainer: React.FC<AdvancedAnimationsProps> = ({ children, className = '' }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);
  
  return (
    <motion.div
      className={className}
      style={{ y, opacity }}
    >
      {children}
    </motion.div>
  );
};

// Floating animation
export const FloatingElement: React.FC<AdvancedAnimationsProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -10, 0],
        rotate: [0, 2, -2, 0]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Magnetic effect
export const MagneticElement: React.FC<AdvancedAnimationsProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={className}
      whileHover={{
        scale: 1.05,
        rotate: [0, 5, -5, 0],
        transition: {
          duration: 0.3,
          ease: "easeInOut"
        }
      }}
      whileTap={{
        scale: 0.95,
        rotate: 0
      }}
    >
      {children}
    </motion.div>
  );
};

// 3D tilt effect
export const TiltElement: React.FC<AdvancedAnimationsProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={className}
      whileHover={{
        rotateX: 10,
        rotateY: 10,
        scale: 1.02,
        transition: {
          duration: 0.2,
          ease: "easeOut"
        }
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
    >
      {children}
    </motion.div>
  );
};

// Text reveal animation
export const TextReveal: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.02,
            ease: "easeOut"
          }}
          viewport={{ once: true }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Page transition
export const PageTransition: React.FC<AdvancedAnimationsProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Loading spinner with advanced animation
export const AdvancedSpinner: React.FC<{ size?: number; className?: string }> = ({ 
  size = 40, 
  className = '' 
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <motion.div
        className="absolute inset-0 border-4 border-orange-200 rounded-full"
        animate={{
          borderTopColor: ["#f97316", "#ef4444", "#ec4899", "#f97316"],
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute inset-2 border-4 border-transparent border-t-orange-500 rounded-full"
        animate={{
          rotate: [0, 180, 360],
          scale: [1, 0.8, 1]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

// Confetti animation
export const Confetti: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const confettiColors = ['#f97316', '#ef4444', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981'];
  
  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: confettiColors[i % confettiColors.length],
                left: `${Math.random() * 100}%`,
                top: '-10px'
              }}
              initial={{
                y: -10,
                x: 0,
                opacity: 1,
                rotate: 0
              }}
              animate={{
                y: '100vh',
                x: Math.random() * 200 - 100,
                opacity: [1, 1, 0],
                rotate: [0, 360, 720]
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                ease: "easeOut",
                delay: Math.random() * 0.5
              }}
              onAnimationComplete={() => {
                // Remove confetti after animation
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default {
  StaggerContainer,
  StaggerItem,
  ParallaxContainer,
  FloatingElement,
  MagneticElement,
  TiltElement,
  TextReveal,
  PageTransition,
  AdvancedSpinner,
  Confetti
};
