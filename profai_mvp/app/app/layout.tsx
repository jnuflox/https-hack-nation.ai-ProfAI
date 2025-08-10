
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ProfAI - Profesor de IA con Inteligencia Emocional',
  description: 'Aprende IA de forma adaptativa con un profesor inteligente que detecta tu estado emocional y personaliza la enseñanza',
  keywords: 'IA, inteligencia artificial, aprendizaje, machine learning, educación adaptativa',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
