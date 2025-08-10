'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { 
  ArrowLeft, 
  Play, 
  BookOpen, 
  Clock,
  Code,
  HelpCircle,
  MessageSquare,
  Brain,
  Video,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

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
}

interface LessonPrompt {
  courseId: string;
  lessonId: string;
  prompt: string;
  metadata: {
    hasVideo?: boolean;
    hasCode?: boolean;
    hasQuiz?: boolean;
    estimatedDuration?: number;
    difficulty?: string;
    isFallback?: boolean;
  };
}

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessonPrompt, setLessonPrompt] = useState<LessonPrompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPrompt, setLoadingPrompt] = useState(false);

  useEffect(() => {
    fetchLessonData();
  }, [courseId, lessonId]);

  const fetchLessonData = async () => {
    try {
      // Fetch course data to get lesson info
      const courseResponse = await fetch(`/api/courses/${courseId}`);
      if (courseResponse.ok) {
        const courseData = await courseResponse.json();
        setCourse(courseData.course);
        
        // Find the specific lesson
        const lessonData = courseData.course.lessons?.find((l: Lesson) => l.id === lessonId);
        if (lessonData) {
          setLesson(lessonData);
        } else {
          toast.error('Lección no encontrada');
        }
      }
    } catch (error) {
      console.error('Error fetching lesson data:', error);
      toast.error('Error al cargar la lección');
    } finally {
      setLoading(false);
    }
  };

  const loadLessonPrompt = async () => {
    setLoadingPrompt(true);
    try {
      const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}/prompt`);
      if (response.ok) {
        const data = await response.json();
        setLessonPrompt(data.data);
        toast.success('Prompt de lección cargado');
      } else {
        toast.error('Error al cargar el prompt de la lección');
      }
    } catch (error) {
      console.error('Error loading lesson prompt:', error);
      toast.error('Error al cargar el prompt');
    } finally {
      setLoadingPrompt(false);
    }
  };

  const startLessonWithPrompt = async () => {
    // Load the lesson prompt first
    await loadLessonPrompt();
    
    // Navigate to chat with lesson context
    router.push(`/chat?lesson=${lessonId}&course=${courseId}&autoload=true`);
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Básico';
      case 2: return 'Intermedio';
      case 3: return 'Avanzado';
      case 4: return 'Experto';
      case 5: return 'Master';
      default: return 'Intermedio';
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'text-green-600 bg-green-100';
      case 2: return 'text-blue-600 bg-blue-100';
      case 3: return 'text-yellow-600 bg-yellow-100';
      case 4: return 'text-orange-600 bg-orange-100';
      case 5: return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!lesson || !course) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lección no encontrada</h1>
          <p className="text-gray-600 mb-8">
            No pudimos encontrar la lección que buscas.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push(`/courses/${courseId}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a {course.title}
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {lesson.title}
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            {lesson.description}
          </p>

          {/* Lesson Metadata */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDuration(lesson.estimatedDuration)}
            </div>
            
            <span 
              className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(lesson.difficultyLevel)}`}
            >
              {getDifficultyText(lesson.difficultyLevel)}
            </span>

            <div className="flex items-center gap-2">
              {lesson.hasVideoContent && (
                <div className="flex items-center gap-1 text-red-600">
                  <Video className="h-3 w-3" />
                  <span className="text-xs">Video</span>
                </div>
              )}
              {lesson.hasCodeExamples && (
                <div className="flex items-center gap-1 text-green-600">
                  <Code className="h-3 w-3" />
                  <span className="text-xs">Código</span>
                </div>
              )}
              {lesson.hasQuiz && (
                <div className="flex items-center gap-1 text-purple-600">
                  <HelpCircle className="h-3 w-3" />
                  <span className="text-xs">Quiz</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {lesson.progress > 0 && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progreso de la lección</span>
                <span>{lesson.progress}%</span>
              </div>
              <ProgressBar 
                progress={lesson.progress} 
                color={lesson.isCompleted ? 'green' : 'blue'} 
                size="md"
              />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lesson Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Contenido de la Lección
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {lesson.description}
                  </p>
                  
                  {lesson.hasVideoContent && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-800 mb-2">
                        <Video className="h-4 w-4" />
                        <span className="font-medium">Video Explicativo</span>
                      </div>
                      <p className="text-red-700 text-sm">
                        Esta lección incluye contenido en video para una mejor comprensión visual de los conceptos.
                      </p>
                    </div>
                  )}
                  
                  {lesson.hasCodeExamples && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800 mb-2">
                        <Code className="h-4 w-4" />
                        <span className="font-medium">Ejemplos de Código</span>
                      </div>
                      <p className="text-green-700 text-sm">
                        Incluye ejemplos prácticos de código que puedes ejecutar y modificar.
                      </p>
                    </div>
                  )}
                  
                  {lesson.hasQuiz && (
                    <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center gap-2 text-purple-800 mb-2">
                        <HelpCircle className="h-4 w-4" />
                        <span className="font-medium">Quiz Interactivo</span>
                      </div>
                      <p className="text-purple-700 text-sm">
                        Al final de la lección podrás evaluar tu comprensión con preguntas interactivas.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Aprender con IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Inicia una conversación personalizada con ProfAI usando el contenido específico de esta lección.
                  </p>

                  <Button 
                    onClick={startLessonWithPrompt}
                    className="w-full"
                    disabled={loadingPrompt}
                  >
                    {loadingPrompt ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Preparando...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Comenzar con IA
                      </>
                    )}
                  </Button>

                  <div className="text-xs text-gray-500 space-y-2">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Prompt específico de la lección</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Contenido contextualizado</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Soporte multimedia</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lesson Status */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Estado de la Lección</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lesson.isCompleted ? (
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Completada</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-blue-700">
                      <Play className="h-5 w-5" />
                      <span className="font-medium">
                        {lesson.progress > 0 ? 'En Progreso' : 'Pendiente'}
                      </span>
                    </div>
                  )}

                  {lesson.progress > 0 && lesson.progress < 100 && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Progreso: {lesson.progress}%
                      </div>
                      <ProgressBar 
                        progress={lesson.progress} 
                        color="blue" 
                        size="sm"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Debug Info */}
        {lessonPrompt && (
          <Card className="mt-8 border-dashed border-gray-300">
            <CardHeader>
              <CardTitle className="text-sm text-gray-500">
                Debug: Prompt Cargado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-600 space-y-2">
                <div>Curso: {lessonPrompt.courseId}</div>
                <div>Lección: {lessonPrompt.lessonId}</div>
                <div>Metadata: {JSON.stringify(lessonPrompt.metadata, null, 2)}</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
