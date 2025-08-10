
'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/onboarding-context';
import { LandingPage } from '@/components/landing/landing-page';

export default function HomePage() {
  const { data: session, status } = useSession();
  const { hasCompletedOnboarding, isLoading: onboardingLoading } = useOnboarding();
  const router = useRouter();
  
  useEffect(() => {
    // Wait for both session and onboarding states to load
    if (status === 'loading' || onboardingLoading) {
      return;
    }
    
    // If user is authenticated, go to dashboard
    if (session) {
      router.push('/dashboard');
      return;
    }
    
    // If user hasn't completed onboarding, show onboarding
    if (!hasCompletedOnboarding) {
      router.push('/onboarding');
      return;
    }
    
    // Otherwise show landing page
  }, [session, status, hasCompletedOnboarding, onboardingLoading, router]);
  
  // Show loading while checking states
  if (status === 'loading' || onboardingLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Show landing page for users who completed onboarding but aren't logged in
  return <LandingPage />;
}
