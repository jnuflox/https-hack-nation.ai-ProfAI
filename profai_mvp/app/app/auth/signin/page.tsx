
import { Metadata } from 'next';
import { SignInForm } from './signin-form';

export const metadata: Metadata = {
  title: 'Sign In - ProfAI',
  description: 'Access your ProfAI account and continue your personalized learning',
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to <span className="text-blue-600">ProfAI</span>
            </h1>
            <p className="text-gray-600">
              Your personal AI teacher with emotional intelligence
            </p>
          </div>
          
          <SignInForm />
          
          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <a href="/auth/signup" className="text-blue-600 hover:underline">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
