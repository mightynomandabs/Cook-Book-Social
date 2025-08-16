import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photo: null as File | null,
    interests: [] as string[],
    dietaryPreferences: [] as string[]
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const cuisineOptions = [
    'South Indian', 'North Indian', 'Mughlai', 'Italian', 'Chinese', 
    'Mexican', 'Thai', 'Mediterranean', 'Japanese', 'French'
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Non-Vegetarian', 'Gluten-Free', 
    'High Protein', 'Low Carb', 'Keto', 'Paleo'
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleDietaryToggle = (diet: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(diet)
        ? prev.dietaryPreferences.filter(d => d !== diet)
        : [...prev.dietaryPreferences, diet]
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
    }
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Complete onboarding and save to Supabase
      await completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Upload photo if exists
      let avatarUrl = null;
      if (formData.photo) {
        try {
          const fileExt = formData.photo.name.split('.').pop();
          const fileName = `${user.id}-${Date.now()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, formData.photo);
          
          if (uploadError) {
            console.warn('Photo upload failed, continuing without photo:', uploadError);
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(fileName);
            
            avatarUrl = publicUrl;
          }
        } catch (uploadError) {
          console.warn('Photo upload failed, continuing without photo:', uploadError);
        }
      }

      // Create user profile in users table
      const { error: profileError } = await supabase
        .from('users')
        .insert([{
          id: user.id,
          email: user.email || formData.email,
          name: formData.name,
          avatar_url: avatarUrl,
          interests: formData.interests,
          dietary_preferences: formData.dietaryPreferences,
          cooking_level: 1,
          cooking_level_title: 'Beginner',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (profileError) throw profileError;

      // Navigate to feed
      navigate('/feed');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // You can add error handling UI here
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.name && formData.email;
      case 2: return true; // Photo is optional
      case 3: return formData.interests.length > 0;
      case 4: return formData.dietaryPreferences.length > 0;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cookbook-orange/10 via-cookbook-yellow/5 to-cookbook-green/10">
      {/* Header */}
      <div className="text-center pt-16 pb-8">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-cookbook-orange to-cookbook-yellow rounded-full flex items-center justify-center">
          <span className="text-4xl">🍳</span>
        </div>
        <h1 className="text-3xl font-bold text-cookbook-black mb-2">Welcome to CookBook</h1>
        <p className="text-gray-600">India's favorite food social platform</p>
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4].map((stepNum) => (
            <div
              key={stepNum}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                stepNum <= step
                  ? 'bg-cookbook-orange text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {stepNum < step ? <Check className="w-4 h-4" /> : stepNum}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-cookbook-orange to-cookbook-yellow h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="px-6 flex-1">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-cookbook-black text-center">Let's get started!</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cookbook-orange focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cookbook-orange focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-cookbook-black text-center">Add your photo</h2>
            <p className="text-gray-600 text-center">Let other foodies know who you are!</p>
            
            <div className="flex justify-center">
              <div className="relative">
                {formData.photo ? (
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cookbook-orange">
                    <img
                      src={URL.createObjectURL(formData.photo)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-dashed border-cookbook-orange flex items-center justify-center bg-gray-50">
                    <Camera className="w-8 h-8 text-cookbook-orange" />
                  </div>
                )}
                
                <label className="absolute bottom-0 right-0 bg-cookbook-orange text-white p-2 rounded-full cursor-pointer hover:bg-cookbook-orange/90 transition-colors">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-cookbook-black text-center">What cuisines do you love?</h2>
            <p className="text-gray-600 text-center">Select all that interest you</p>
            
            <div className="grid grid-cols-2 gap-3">
              {cuisineOptions.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => handleInterestToggle(cuisine)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    formData.interests.includes(cuisine)
                      ? 'border-cookbook-orange bg-cookbook-orange/10 text-cookbook-orange'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-cookbook-orange/50'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-cookbook-black text-center">Dietary preferences</h2>
            <p className="text-gray-600 text-center">Help us personalize your experience</p>
            
            <div className="grid grid-cols-2 gap-3">
              {dietaryOptions.map((diet) => (
                <button
                  key={diet}
                  onClick={() => handleDietaryToggle(diet)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    formData.dietaryPreferences.includes(diet)
                      ? 'border-cookbook-green bg-cookbook-green/10 text-cookbook-green'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-cookbook-green/50'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-6 pb-8 pt-6">
        <button
          onClick={handleNext}
          disabled={!canProceed() || loading}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
            canProceed() && !loading
              ? 'bg-gradient-to-r from-cookbook-orange to-cookbook-yellow text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>{step === 4 ? 'Get Started!' : 'Continue'}</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
        
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="w-full py-3 px-6 mt-3 text-gray-600 hover:text-cookbook-black transition-colors"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
