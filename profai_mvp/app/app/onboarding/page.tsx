'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/onboarding-context';
import Onboarding from '@/components/onboarding/Onboarding';
import { OnboardingData, Theme } from '@/types/onboarding';

// Mock themes data - in a real application this would come from an API
const THEMES: Theme[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and minimalist interface',
    color: 'blue',
    icon: '🎯'
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Dark mode for better concentration',
    color: 'gray',
    icon: '🌙'
  },
  {
    id: 'colorful',
    name: 'Colorful',
    description: 'Vibrant and energetic design',
    color: 'purple',
    icon: '🎨'
  },
  {
    id: 'minimal',
    name: 'Minimalist',
    description: 'Only the essentials, no distractions',
    color: 'green',
    icon: '✨'
  }
];

export default function OnboardingPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { setHasCompletedOnboarding } = useOnboarding();
  const router = useRouter();

  const handleOnboardingFinish = async (data: OnboardingData) => {
    setIsGenerating(true);
    
    try {
      // Here you could send the onboarding data to your API
      console.log('Onboarding data:', data);
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark onboarding as completed
      setHasCompletedOnboarding(true);
      
      // Redirect to signup
      router.push('/auth/signup?from=onboarding');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <Onboarding 
        onFinish={handleOnboardingFinish}
        themes={THEMES}
        isGenerating={isGenerating}
      />
    </div>
  );
}
