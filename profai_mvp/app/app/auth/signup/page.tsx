
import { Metadata } from 'next';
import { SignUpForm } from './signup-form';

export const metadata: Metadata = {
  title: 'Registro - ProfAI',
  description: 'Crea tu cuenta en ProfAI y comienza tu journey de aprendizaje personalizado',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Únete a <span className="text-purple-600">ProfAI</span>
            </h1>
            <p className="text-gray-600">
              Comienza tu journey de aprendizaje personalizado con IA
            </p>
          </div>
          
          <SignUpForm />
          
          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-6">
            ¿Ya tienes cuenta?{' '}
            <a href="/auth/signin" className="text-purple-600 hover:underline">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
