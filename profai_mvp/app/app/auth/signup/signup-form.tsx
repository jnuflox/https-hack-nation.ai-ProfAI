
'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Lock, Loader2, Brain, Code } from 'lucide-react';
import { toast } from 'sonner';

export function SignUpForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    learningStyle: 'hybrid',
    skillLevel: 'beginner'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fromOnboarding, setFromOnboarding] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user comes from onboarding
    setFromOnboarding(searchParams.get('from') === 'onboarding');
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          learningStyle: {
            visual: formData.learningStyle === 'visual' ? 0.9 : 0.6,
            auditory: formData.learningStyle === 'auditory' ? 0.9 : 0.5,
            kinesthetic: formData.learningStyle === 'kinesthetic' ? 0.9 : 0.6,
          },
          skillLevel: {
            theory: formData.skillLevel,
            tooling: formData.skillLevel,
            prompting: formData.skillLevel
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error creating account');
      }

      // Show success message, including warning if in temporary mode
      if (data.warning) {
        toast.success(`Account created! ${data.warning}`, { duration: 5000 });
      } else {
        toast.success('Account created successfully!');
      }
      
      // Skip auto sign-in if it's a temporary user (no real auth yet)
      if (data.user.id.startsWith('temp_')) {
        toast.info('Redirecting to ProfAI chat...', { duration: 3000 });
        router.push('/chat');
        router.refresh();
        return;
      }
      
      // Auto sign-in after signup for real users
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.error('Account created, but sign in error. Try signing in manually.');
        router.push('/auth/signin');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || 'Error creating account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl text-center">
          {fromOnboarding ? 'Perfect! Create your account' : 'Create Account'}
        </CardTitle>
        {fromOnboarding && (
          <p className="text-sm text-center text-gray-600 mt-2">
            ✨ Your personalized learning plan is ready
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="john@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preferred Learning Style</Label>
            <Select value={formData.learningStyle} onValueChange={(value) => handleInputChange('learningStyle', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visual">Visual - Learn by seeing diagrams and images</SelectItem>
                <SelectItem value="auditory">Auditory - Learn by listening to explanations</SelectItem>
                <SelectItem value="kinesthetic">Kinesthetic - Learn by doing and practicing</SelectItem>
                <SelectItem value="hybrid">Hybrid - Combine theory and practice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>AI Experience Level</Label>
            <Select value={formData.skillLevel} onValueChange={(value) => handleInputChange('skillLevel', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner - New to AI</SelectItem>
                <SelectItem value="intermediate">Intermediate - Some knowledge</SelectItem>
                <SelectItem value="advanced">Advanced - Considerable experience</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {fromOnboarding ? '🚀 Start my Learning Journey' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
