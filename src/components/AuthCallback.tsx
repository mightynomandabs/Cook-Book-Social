import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 Processing OAuth callback...');
        
        // Get the session from the URL
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Auth callback error:', error);
          setError('Authentication failed. Please try again.');
          setIsProcessing(false);
          return;
        }

        if (session?.user) {
          console.log('✅ User authenticated:', session.user.email);
          
          // Check if user profile exists in our database
          const { data: existingUser, error: profileError } = await supabase
            .from('users')
            .select('id, name, email')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.error('❌ Error checking user profile:', profileError);
          }

          if (existingUser) {
            console.log('✅ Existing user profile found, redirecting to feed');
            navigate('/feed', { replace: true });
          } else {
            console.log('🆕 New user, creating profile and redirecting to onboarding');
            
            // Create user profile
            const { error: createError } = await supabase
              .from('users')
              .insert({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                avatar_url: session.user.user_metadata?.avatar_url,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });

            if (createError) {
              console.error('❌ Error creating user profile:', createError);
              // Still redirect to onboarding even if profile creation fails
            }
            
            navigate('/onboarding', { replace: true });
          }
        } else {
          console.log('❌ No session found in callback');
          setError('Authentication failed. No session found.');
          setIsProcessing(false);
        }
      } catch (error) {
        console.error('❌ Unexpected error in auth callback:', error);
        setError('An unexpected error occurred. Please try again.');
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Authentication Failed</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Signing you in...</h2>
        <p className="text-slate-600 dark:text-slate-400">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
