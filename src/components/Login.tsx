import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if this is an OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Check if URL has hash (OAuth callback)
      if (window.location.hash && window.location.hash.includes('access_token')) {
        console.log('🔍 OAuth callback detected in Login component');
        
        try {
          // Get the session
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('OAuth callback error:', error);
            return;
          }

          if (session?.user) {
            console.log('✅ User authenticated, checking profile...');
            
            // Check if user profile exists
            const { data: existingUser, error: profileError } = await supabase
              .from('users')
              .select('id')
              .eq('id', session.user.id)
              .single();

            if (profileError && profileError.code !== 'PGRST116') {
              console.error('Error checking user profile:', profileError);
            }

            if (existingUser) {
              console.log('✅ User profile exists, redirecting to /feed');
              navigate('/feed');
            } else {
              console.log('🆕 New user, redirecting to /onboarding');
              navigate('/onboarding');
            }
          }
        } catch (error) {
          console.error('Error handling OAuth callback:', error);
        }
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      // If successful, the user will be redirected by Supabase
    } catch (error: any) {
      console.error('Google sign-in failed:', error);
      if (error.message?.includes('redirect_uri_mismatch')) {
        setError('OAuth configuration error. Please contact support.');
      } else if (error.message?.includes('popup_closed')) {
        setError('Sign-in was cancelled. Please try again.');
      } else {
        setError(`Sign-in failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cookbook-orange/10 via-cookbook-yellow/5 to-cookbook-green/10">
      {/* Header */}
      <div className="text-center pt-20 pb-12">
        <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-cookbook-orange to-cookbook-yellow rounded-full flex items-center justify-center">
          <span className="text-5xl">🍳</span>
        </div>
        <h1 className="text-4xl font-bold text-cookbook-black mb-3">Welcome to CookBook</h1>
        <p className="text-xl text-gray-600">India's favorite food social platform</p>
      </div>

      {/* Login Options */}
      <div className="px-8 max-w-md mx-auto">
        <div className="space-y-6">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={`w-full py-4 px-6 bg-white border-2 border-gray-200 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-3 hover:border-cookbook-orange/50 hover:shadow-lg transform hover:-translate-y-0.5 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-cookbook-orange border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-cookbook-orange/10 via-cookbook-yellow/5 to-cookbook-green/10 text-gray-500">or</span>
            </div>
          </div>

          {/* Email Sign In (Optional) */}
          <button
            onClick={() => navigate('/onboarding')}
            className="w-full py-4 px-6 bg-gradient-to-r from-cookbook-orange to-cookbook-yellow text-white rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Continue with Email
          </button>
        </div>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-gray-500">
          New to CookBook? <span className="text-cookbook-orange font-medium">Join our community</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
