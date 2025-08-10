'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ProgressRoadmap } from '@/components/progress/progress-roadmap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp,
  Brain,
  BookOpen,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  description: string;
  estimatedDuration: number;
  difficultyLevel: number;
  hasVideoContent: boolean;
  hasCodeExamples: boolean;
  hasQuiz: boolean;
  isCompleted: boolean;
  progress: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  imageUrl: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

interface UserStats {
  totalLessonsCompleted: number;
  currentStreak: number;
  avgSessionTime: number;
}

interface ProgressData {
  course: Course;
  lessons: Lesson[];
  stats: UserStats;
  warning?: string;
}

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/progress');
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('No hay cursos disponibles en este momento');
        } else {
          throw new Error('Error al cargar el progreso');
        }
        return;
      }

      const data = await response.json();
      setProgressData(data);
    } catch (err) {
      console.error('Error fetching progress data:', err);
      setError('Error al cargar el progreso. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = (lessonId: string) => {
    if (progressData?.course) {
      router.push(`/courses/${progressData.course.id}/lessons/${lessonId}`);
    }
  };

  const handleRetry = () => {
    fetchProgressData();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando tu progreso...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mi Progreso</h1>
                <p className="text-gray-600 mt-1">Seguimiento de tu journey de aprendizaje</p>
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar el progreso</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={handleRetry} variant="outline">
                Intentar de nuevo
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!progressData) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto space-y-8">
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No progress data</h3>
              <p className="text-gray-600 mb-4">
                Start a course to see your progress here.
              </p>
              <Button onClick={() => router.push('/courses')}>
                Explore Courses
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const { course, lessons, stats, warning } = progressData;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mi Progreso</h1>
              <p className="text-gray-600 mt-1">Seguimiento de tu journey de aprendizaje</p>
            </div>
          </div>

          <div className="mt-4 md:mt-0">
            <Button 
              onClick={() => router.push('/courses')}
              variant="outline"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Ver Todos los Cursos
            </Button>
          </div>
        </div>

        {/* Warning Message */}
        {warning && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800 text-sm">{warning}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Trophy className="mr-2 h-5 w-5 text-yellow-600" />
                Lecciones Completadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.totalLessonsCompleted}
              </div>
              <p className="text-gray-600 text-sm">
                Total en toda la plataforma
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Target className="mr-2 h-5 w-5 text-green-600" />
                Racha Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.currentStreak}
              </div>
              <p className="text-gray-600 text-sm">
                Días consecutivos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Clock className="mr-2 h-5 w-5 text-blue-600" />
                Tiempo Promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.avgSessionTime}m
              </div>
              <p className="text-gray-600 text-sm">
                Por sesión de estudio
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Roadmap */}
        <div>
          <ProgressRoadmap 
            course={course}
            lessons={lessons}
            onLessonClick={handleLessonClick}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-purple-600" />
                Habla con tu Profesor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                ¿Tienes dudas sobre el curso actual? Tu profesor de IA está aquí para ayudarte.
              </p>
              <Button 
                onClick={() => router.push('/chat')}
                className="w-full"
              >
                Abrir Chat
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                Ver Perfil Completo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Revisa tu perfil de aprendizaje y personaliza tu experiencia.
              </p>
              <Button 
                onClick={() => router.push('/profile')}
                variant="outline"
                className="w-full"
              >
                Ir al Perfil
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
