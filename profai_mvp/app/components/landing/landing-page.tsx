
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Code, MessageSquare, BarChart3, Users, Zap, ArrowRight, Sparkles, Target, BookOpen, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/onboarding-context';
import Link from 'next/link';

export function LandingPage() {
  const router = useRouter();
  const { setHasCompletedOnboarding } = useOnboarding();

  const handleRestartOnboarding = () => {
    setHasCompletedOnboarding(false);
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">
              Prof<span className="text-blue-600">AI</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-6 w-6 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
              AI Professor with Emotional Intelligence
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Learn <span className="text-blue-600">AI</span> in an{' '}
            <span className="text-purple-600">adaptive</span> way
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your personal AI teacher that detects your emotional state and personalizes 
            learning in real-time. Combines rigorous theory with immediate practice 
            to accelerate your learning.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              onClick={() => router.push('/auth/signup')}
            >
              Start Learning
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3"
              onClick={() => router.push('/auth/signin')}
            >
              View Demo
            </Button>
          </div>
          
          <div className="mt-12 text-sm text-gray-500">
            ✨ No credit card required • Demo account available
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why choose ProfAI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A new way to learn AI that adapts to you, detects your emotional state 
              and personalizes each lesson.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader>
                <Brain className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl">Emotional Intelligence</CardTitle>
                <CardDescription>
                  Detects confusion and frustration to automatically adapt explanations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Real-time emotional tone analysis</li>
                  <li>• Automatic content adaptation</li>
                  <li>• Personalized explanations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader>
                <Code className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle className="text-xl">Theory + Practice</CardTitle>
                <CardDescription>
                  Hybrid approach: solid concepts with immediate implementation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Interactive lessons with code</li>
                  <li>• AI-evaluated practical exercises</li>
                  <li>• Real step-by-step projects</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="text-xl">Smart Chat</CardTitle>
                <CardDescription>
                  Ask anything, receive explanations adapted to your level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Smart contextual responses</li>
                  <li>• Multiple explanation formats</li>
                  <li>• Available 24/7</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your Personalized Learning Path
            </h2>
            <p className="text-xl text-gray-600">
              From basic concepts to advanced implementations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Diagnosis</h3>
              <p className="text-sm text-gray-600">
                We assess your current level and define your learning profile
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Micro-Lessons</h3>
              <p className="text-sm text-gray-600">
                Daily 5-10 minute lessons adapted to your pace
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Practice</h3>
              <p className="text-sm text-gray-600">
                Practical exercises with personalized immediate feedback
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Progress</h3>
              <p className="text-sm text-gray-600">
                Smart tracking of your evolution and improvement areas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-6">
            Ready to transform your AI learning?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join the new generation of students learning with emotional intelligence
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
              onClick={() => router.push('/auth/signup')}
            >
              Start Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-3"
              onClick={() => router.push('/auth/signin')}
            >
              Try Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">
                Prof<span className="text-blue-400">AI</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>© 2025 ProfAI</span>
              <span>•</span>
              <span>Made with ❤️ for the AI community</span>
              <span>•</span>
              <button 
                onClick={handleRestartOnboarding}
                className="text-gray-400 hover:text-blue-400 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Restart Onboarding
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
