import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import ThemeToggle from './ThemeToggle';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden transition-colors duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 via-blue-100/30 to-indigo-100/50 dark:from-slate-800/50 dark:via-slate-700/30 dark:to-slate-800/50"></div>
      
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>
      
      {/* Header */}
      <div className="relative z-10 text-center pt-24 pb-16">
        <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden">
          <img 
            src="/cookbook-logo.png" 
            alt="CookBook Logo" 
            className="w-20 h-20 object-contain"
          />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent mb-4">
          Welcome to CookBook
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 font-medium">India's premier culinary social platform</p>
      </div>

      {/* Login Options */}
      <div className="relative z-10 px-8 max-w-md mx-auto">
        <div className="space-y-6">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={`w-full py-5 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transform hover:-translate-y-1 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                <span className="text-slate-700 dark:text-slate-200">Signing in...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                                 <span className="text-slate-700 dark:text-slate-200">Continue with Google</span>
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium shadow-sm">
              {error}
            </div>
          )}

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-500 font-medium">or</span>
            </div>
          </div>

          {/* Email Sign In (Optional) */}
          <button
            onClick={() => navigate('/onboarding')}
            className="w-full py-5 px-6 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-slate-800/25 transform hover:-translate-y-1"
          >
            Continue with Email
          </button>
        </div>

        {/* Terms */}
        <p className="text-xs text-slate-500 text-center mt-8 leading-relaxed">
          By continuing, you agree to our{' '}
          <span className="text-slate-700 font-medium hover:text-slate-900 cursor-pointer">Terms of Service</span>
          {' '}and{' '}
          <span className="text-slate-700 font-medium hover:text-slate-900 cursor-pointer">Privacy Policy</span>
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-slate-500">
          New to CookBook?{' '}
          <span className="text-slate-700 font-semibold hover:text-slate-900 cursor-pointer transition-colors">
            Join our community
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
