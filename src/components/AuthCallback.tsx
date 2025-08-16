import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/');
          return;
        }

        if (session?.user) {
          try {
            // Check if user profile exists in our users table
            const { data: existingUser, error } = await supabase
              .from('users')
              .select('id')
              .eq('id', session.user.id)
              .single();

            if (error && error.code !== 'PGRST116') {
              // PGRST116 means no rows returned, which is expected for new users
              console.error('Error checking user profile:', error);
            }

            if (existingUser) {
              // User profile exists, redirect to feed
              window.location.href = 'https://cook-book-social.vercel.app/feed';
            } else {
              // User profile doesn't exist, redirect to onboarding
              window.location.href = 'https://cook-book-social.vercel.app/onboarding';
            }
          } catch (profileError) {
            console.error('Error checking user profile:', profileError);
            // If there's an error, redirect to onboarding as fallback
            window.location.href = 'https://cook-book-social.vercel.app/onboarding';
          }
        } else {
          window.location.href = 'https://cook-book-social.vercel.app/';
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cookbook-orange/10 via-cookbook-yellow/5 to-cookbook-green/10 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cookbook-orange to-cookbook-yellow rounded-full flex items-center justify-center animate-spin">
          <span className="text-2xl">🍳</span>
        </div>
        <h2 className="text-xl font-semibold text-cookbook-black mb-2">Signing you in...</h2>
        <p className="text-gray-600">Please wait while we set up your account</p>
      </div>
    </div>
  );
};

export default AuthCallback;
