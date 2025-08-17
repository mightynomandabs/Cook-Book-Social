import React, { useState, useRef, useEffect } from 'react';
import { useSpring, animated, config } from 'react-spring';
import { gsap } from 'gsap';
import { ProgressBar, FloatingActionButton } from './MotionSystem';

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  content: React.ReactNode;
  required: boolean;
}

interface EnhancedOnboardingProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

interface OnboardingData {
  interests: string[];
  dietaryRestrictions: string[];
  cookingLevel: string;
  favoriteCreators: string[];
  notifications: boolean;
}

export const EnhancedOnboarding: React.FC<EnhancedOnboardingProps> = ({
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    interests: [],
    dietaryRestrictions: [],
    cookingLevel: 'Beginner',
    favoriteCreators: [],
    notifications: false
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Animation springs
  const containerSpring = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    from: { opacity: 0, transform: 'translateY(20px)' },
    config: config.wobbly
  });

  const progressSpring = useSpring({
    width: `${progress}%`,
    config: config.wobbly
  });

  // Update progress when step changes
  useEffect(() => {
    const newProgress = ((currentStep + 1) / onboardingSteps.length) * 100;
    setProgress(newProgress);
    
    // Animate current card
    if (cardRefs.current[currentStep]) {
      gsap.fromTo(cardRefs.current[currentStep], 
        { scale: 0.95, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [currentStep]);

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to CookBook! 🍳',
      subtitle: 'Where foodies find their feed',
      icon: '🌟',
      required: true,
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-cta rounded-full flex items-center justify-center animate-bounce-soft">
            <span className="text-4xl">🍳</span>
          </div>
          <div>
            <h2 className="text-h1 text-cb-charcoal font-bold mb-3">
              Ready to cook up something amazing?
            </h2>
            <p className="text-body text-cb-gray-600 leading-relaxed">
              We'll spice your feed with the best recipes, creators, and cooking adventures. 
              Let's get you set up in just a few steps!
            </p>
          </div>
          <div className="flex items-center justify-center space-x-2 text-cb-caption text-cb-gray-500">
            <span>🚀</span>
            <span>Fast setup</span>
            <span>•</span>
            <span>🎯</span>
            <span>Personalized</span>
            <span>•</span>
            <span>🎉</span>
            <span>Fun rewards</span>
          </div>
        </div>
      )
    },
    {
      id: 'interests',
      title: 'What gets you excited? 🔥',
      subtitle: 'Choose your favorite cuisines and cooking styles',
      icon: '🌍',
      required: true,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              'Italian', 'Mexican', 'Asian', 'Mediterranean',
              'Indian', 'French', 'American', 'Middle Eastern',
              'Thai', 'Japanese', 'Greek', 'Caribbean'
            ].map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => toggleInterest(cuisine)}
                className={`p-4 rounded-cb-lg border-2 transition-all duration-200 hover:scale-105 ${
                  formData.interests.includes(cuisine)
                    ? 'border-cb-saffron bg-gradient-cta text-white shadow-cb-glow'
                    : 'border-cb-gray-200 bg-white hover:border-cb-saffron/50'
                }`}
              >
                <span className="font-medium">{cuisine}</span>
              </button>
            ))}
          </div>
          <div className="text-center">
            <p className="text-caption text-cb-gray-500">
              Selected: {formData.interests.length} cuisines
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'dietary',
      title: 'Any dietary preferences? 🥗',
      subtitle: 'Help us curate the perfect recipes for you',
      icon: '🌱',
      required: false,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free',
              'Keto', 'Paleo', 'Low-Carb', 'High-Protein',
              'Nut-Free', 'Seafood-Free', 'None', 'Other'
            ].map((diet) => (
              <button
                key={diet}
                onClick={() => toggleDietary(diet)}
                className={`p-4 rounded-cb-lg border-2 transition-all duration-200 hover:scale-105 ${
                  formData.dietaryRestrictions.includes(diet)
                    ? 'border-cb-success bg-cb-success/10 text-cb-success'
                    : 'border-cb-gray-200 bg-white hover:border-cb-success/50'
                }`}
              >
                <span className="font-medium">{diet}</span>
              </button>
            ))}
          </div>
          <div className="text-center">
            <p className="text-caption text-cb-gray-500">
              {formData.dietaryRestrictions.length === 0 
                ? 'No restrictions selected' 
                : `${formData.dietaryRestrictions.length} preferences selected`
              }
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'level',
      title: 'What\'s your cooking experience? 👨‍🍳',
      subtitle: 'We\'ll adjust recipe complexity accordingly',
      icon: '📚',
      required: true,
      content: (
        <div className="space-y-6">
          {[
            {
              level: 'Beginner',
              description: 'Just starting out in the kitchen',
              icon: '🌱',
              features: ['Simple recipes', 'Step-by-step guides', 'Basic techniques']
            },
            {
              level: 'Intermediate',
              description: 'Comfortable with most cooking methods',
              icon: '🔥',
              features: ['Moderate complexity', 'Advanced techniques', 'Creative variations']
            },
            {
              level: 'Advanced',
              description: 'Experienced home chef',
              icon: '👑',
              features: ['Complex recipes', 'Professional techniques', 'Innovation focus']
            }
          ].map((option) => (
            <button
              key={option.level}
              onClick={() => setFormData(prev => ({ ...prev, cookingLevel: option.level }))}
              className={`w-full p-6 rounded-cb-lg border-2 transition-all duration-200 hover:scale-105 text-left ${
                formData.cookingLevel === option.level
                  ? 'border-cb-saffron bg-gradient-cta text-white shadow-cb-glow'
                  : 'border-cb-gray-200 bg-white hover:border-cb-saffron/50'
              }`}
            >
              <div className="flex items-start space-x-4">
                <span className="text-3xl">{option.icon}</span>
                <div className="flex-1">
                  <h3 className="text-h3 font-bold mb-2">{option.level}</h3>
                  <p className="text-body mb-3 opacity-90">{option.description}</p>
                  <ul className="space-y-1">
                    {option.features.map((feature, index) => (
                      <li key={index} className="text-caption opacity-80">• {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'creators',
      title: 'Discover amazing creators! ⭐',
      subtitle: 'Follow chefs who inspire your cooking journey',
      icon: '👨‍🍳',
      required: false,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {[
              { name: 'Chef Maria', specialty: 'Italian Cuisine', followers: '2.1M', avatar: '👩‍🍳' },
              { name: 'Foodie Alex', specialty: 'Quick Meals', followers: '890K', avatar: '👨‍🍳' },
              { name: 'Baker Sarah', specialty: 'Pastry & Baking', followers: '1.5M', avatar: '👩‍🍳' },
              { name: 'Spice Master', specialty: 'Global Flavors', followers: '3.2M', avatar: '🧑‍🍳' }
            ].map((creator) => (
              <button
                key={creator.name}
                onClick={() => toggleCreator(creator.name)}
                className={`p-4 rounded-cb-lg border-2 transition-all duration-200 hover:scale-105 ${
                  formData.favoriteCreators.includes(creator.name)
                    ? 'border-cb-lemon bg-cb-lemon/10 text-cb-charcoal'
                    : 'border-cb-gray-200 bg-white hover:border-cb-lemon/50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-cb-gray-200 flex items-center justify-center text-2xl">
                    {creator.avatar}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium">{creator.name}</h3>
                    <p className="text-caption text-cb-gray-600">{creator.specialty}</p>
                  </div>
                  <div className="text-caption text-cb-gray-500">
                    {creator.followers} followers
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="text-center">
            <p className="text-caption text-cb-gray-500">
              {formData.favoriteCreators.length === 0 
                ? 'No creators selected' 
                : `${formData.favoriteCreators.length} creators selected`
              }
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'notifications',
      title: 'Stay in the loop! 🔔',
      subtitle: 'Get notified about new recipes and challenges',
      icon: '📱',
      required: false,
      content: (
        <div className="space-y-6 text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-cta rounded-full flex items-center justify-center">
            <span className="text-3xl">🔔</span>
          </div>
          
          <div>
            <h3 className="text-h2 font-bold mb-3">Never miss a recipe!</h3>
            <p className="text-body text-cb-gray-600 mb-6">
              Get personalized notifications for new recipes, cooking challenges, 
              and exclusive content from your favorite creators.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-cb-gray-50 rounded-cb-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🍳</span>
                <div className="text-left">
                  <p className="font-medium">New recipes</p>
                  <p className="text-caption text-cb-gray-500">From creators you follow</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-cb-saffron rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform duration-200" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-cb-gray-50 rounded-cb-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎯</span>
                <div className="text-left">
                  <p className="font-medium">Daily challenges</p>
                  <p className="text-caption text-cb-gray-500">Earn XP and badges</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-cb-saffron rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform duration-200" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-cb-gray-50 rounded-cb-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🔥</span>
                <div className="text-left">
                  <p className="font-medium">Streak reminders</p>
                  <p className="text-caption text-cb-gray-500">Keep your cooking streak alive</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-cb-saffron rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform duration-200" />
              </div>
            </div>
          </div>

          <button
            onClick={() => setFormData(prev => ({ ...prev, notifications: !prev.notifications }))}
            className={`px-8 py-4 rounded-cb-lg font-bold transition-all duration-200 hover:scale-105 ${
              formData.notifications
                ? 'bg-gradient-cta text-white shadow-cb-glow'
                : 'bg-cb-gray-200 text-cb-charcoal hover:bg-cb-gray-300'
            }`}
          >
            {formData.notifications ? 'Notifications Enabled' : 'Enable Notifications'}
          </button>
        </div>
      )
    }
  ];

  const toggleInterest = (cuisine: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(cuisine)
        ? prev.interests.filter(c => c !== cuisine)
        : [...prev.interests, cuisine]
    }));
  };

  const toggleDietary = (diet: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(diet)
        ? prev.dietaryRestrictions.filter(d => d !== diet)
        : [...prev.dietaryRestrictions, diet]
    }));
  };

  const toggleCreator = (creator: string) => {
    setFormData(prev => ({
      ...prev,
      favoriteCreators: prev.favoriteCreators.includes(creator)
        ? prev.favoriteCreators.filter(c => c !== creator)
        : [...prev.favoriteCreators, creator]
    }));
  };

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    // Validate required fields
    const requiredSteps = onboardingSteps.filter(step => step.required);
    const isValid = requiredSteps.every(step => {
      switch (step.id) {
        case 'interests':
          return formData.interests.length > 0;
        case 'level':
          return formData.cookingLevel !== '';
        default:
          return true;
      }
    });

    if (!isValid) {
      // Show error animation
      gsap.to(containerRef.current, {
        x: -10,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 4,
        onComplete: () => {
          gsap.set(containerRef.current, { x: 0 });
        }
      });
      return;
    }

    // Success animation
    gsap.to(containerRef.current, {
      scale: 1.05,
      duration: 0.2,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        onComplete(formData);
      }
    });
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <animated.div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-cb-off-white via-white to-cb-gray-200/30"
      style={containerSpring}
    >
      {/* Header */}
      <div className="relative pt-8 pb-6 px-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onSkip}
            className="text-cb-gray-600 hover:text-cb-charcoal transition-colors"
          >
            Skip
          </button>
          
          <div className="text-center">
            <h1 className="text-h2 font-bold text-cb-charcoal">
              {currentStepData.title}
            </h1>
            <p className="text-caption text-cb-gray-600">
              {currentStepData.subtitle}
            </p>
          </div>
          
          <div className="w-16" /> {/* Spacer for centering */}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
                      <ProgressBar 
              progress={progress} 
              height="sm" 
              showLabel={false}
              isAnimated={true}
            />
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center space-x-2">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'bg-gradient-cta scale-125'
                  : index < currentStep
                  ? 'bg-cb-saffron'
                  : 'bg-cb-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6">
        <animated.div
          ref={el => cardRefs.current[currentStep] = el}
          className="bg-white rounded-cb-xl shadow-cb-mid p-6 min-h-[400px]"
        >
          {currentStepData.content}
        </animated.div>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-8">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-cb-lg font-medium transition-all duration-200 ${
              currentStep === 0
                ? 'bg-cb-gray-200 text-cb-gray-400 cursor-not-allowed'
                : 'bg-white text-cb-charcoal hover:bg-cb-gray-50 border border-cb-gray-200'
            }`}
          >
            Previous
          </button>

          <FloatingActionButton
            icon="➡️"
            onClick={handleNext}
            size="lg"
            color="primary"
          />

          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-cta rounded-full opacity-10 animate-float" />
        <div className="absolute bottom-40 right-16 w-24 h-24 bg-cb-lemon rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-cb-coral rounded-full opacity-15 animate-float" style={{ animationDelay: '2s' }} />
      </div>
    </animated.div>
  );
};

export default EnhancedOnboarding;
