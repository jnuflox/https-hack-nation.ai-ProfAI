'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { 
  ArrowLeft, 
  Play, 
  BookOpen, 
  Clock,
  Video,
  CheckCircle,
  Circle,
  Loader2,
  Brain,
  Trophy,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';
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
  lessons: Lesson[];
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

export default function LessonsListPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [consolidating, setConsolidating] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data.course);
      } else {
        toast.error('Error loading course');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Error al cargar el curso');
    } finally {
      setLoading(false);
    }
  };

  const validateLessonVideo = async (courseId: string, lessonId: string): Promise<string | null> => {
    try {
      const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}/video`);
      if (response.ok) {
        const data = await response.json();
        return data.videoUrl || null;
      }
      return null;
    } catch (error) {
      console.log('No video found for lesson:', lessonId);
      return null;
    }
  };

  const handleLessonClick = async (lesson: Lesson) => {
    setConsolidating(true);
    toast.loading('Cargando contenido de la lección...');
    
    try {
      // Load specific lesson prompt
      const promptResponse = await fetch(`/api/courses/${courseId}/lessons/${lesson.id}/prompt`);
      
      if (!promptResponse.ok) {
        throw new Error('Error loading lesson prompt');
      }

      // Validate if video exists for this lesson
      const videoUrl = await validateLessonVideo(courseId, lesson.id);
      
      toast.dismiss();
      
      if (videoUrl) {
        toast.success('Lección cargada con video educativo');
      } else {
        toast.success('Lección cargada (sin video disponible)');
      }
      
      // Redirect to chat with specific lesson content and video
      const chatUrl = `/chat?lesson=${lesson.id}&course=${courseId}&autoload=true${videoUrl ? `&video=${encodeURIComponent(videoUrl)}` : ''}`;
      
      // Small delay for better UX
      setTimeout(() => {
        router.push(chatUrl);
      }, 800);
      
    } catch (error) {
      console.error('Error loading lesson:', error);
      toast.dismiss();
      toast.error('Error al cargar la lección. Intenta de nuevo.');
    } finally {
      setConsolidating(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Cargando lecciones del curso...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Curso no encontrado</h2>
          <Button onClick={() => router.push('/courses')} variant="outline">
            Volver a Cursos
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/courses" className="hover:text-blue-600">
            Cursos
          </Link>
          <span>/</span>
          <Link href={`/courses/${courseId}`} className="hover:text-blue-600">
            {course.title}
          </Link>
          <span>/</span>
          <span className="text-gray-900">Lecciones</span>
        </div>

        {/* Back Button */}
        <div className="flex items-start space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push(`/courses/${courseId}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Curso
          </Button>
        </div>

        {/* Course Header */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">📚 {course.title}</CardTitle>
                <p className="text-blue-100 mb-4">{course.description}</p>
                <div className="flex items-center gap-4 text-sm text-blue-100">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white`}>
                    {course.category}
                  </span>
                  <span>Nivel {course.difficulty}</span>
                  <span>{course.completedLessons}/{course.totalLessons} lecciones completadas</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold mb-1">{course.progress}%</div>
                <div className="text-blue-100 text-sm">Completado</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ProgressBar 
              progress={course.progress} 
              color="blue" 
              size="lg" 
              className="mb-4"
            />
          </CardContent>
        </Card>

        {/* Special Instructions */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Brain className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-900 mb-1">
                  🎯 Experiencia de Aprendizaje Consolidada
                </h4>
                <p className="text-sm text-orange-800">
                  Al hacer click en cualquier lección, se consolidará TODO el contenido del curso y se iniciará 
                  una sesión especial en el chat con ProfAI que incluye el contenido completo + video educativo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Lecciones del Curso</h3>
            <div className="text-sm text-gray-600">
              {course.lessons.length} lecciones disponibles
            </div>
          </div>

          <div className="grid gap-4">
            {course.lessons.map((lesson, index) => (
              <Card 
                key={lesson.id} 
                className={`transition-all duration-200 cursor-pointer hover:shadow-lg ${
                  lesson.isCompleted ? 'border-green-200 bg-green-50/30' : 'border-gray-200 hover:border-blue-300'
                } ${consolidating ? 'pointer-events-none opacity-50' : ''}`}
                onClick={() => handleLessonClick(lesson)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {lesson.isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <Circle className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-500">
                            Lección {index + 1}
                          </span>
                          <div className="flex space-x-1">
                            {lesson.hasVideoContent && (
                              <Video className="h-3 w-3 text-red-500" title="Incluye video" />
                            )}
                            {lesson.hasCodeExamples && (
                              <BookOpen className="h-3 w-3 text-blue-500" title="Incluye código" />
                            )}
                            {lesson.hasQuiz && (
                              <Trophy className="h-3 w-3 text-purple-500" title="Incluye quiz" />
                            )}
                          </div>
                        </div>
                        
                        <CardTitle className="text-lg mb-2">{lesson.title}</CardTitle>
                        <CardDescription>{lesson.description}</CardDescription>
                        
                        {lesson.progress > 0 && lesson.progress < 100 && (
                          <div className="mt-2">
                            <div className="text-xs text-blue-600 mb-1">
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
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDuration(lesson.estimatedDuration)}
                      </div>
                      
                      <div className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(lesson.difficultyLevel)}`}>
                        {getDifficultyText(lesson.difficultyLevel)}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Click para cargar esta lección en el chat con video educativo
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-600 font-medium">
                        Chat + Video Educativo
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {consolidating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="p-6 max-w-md">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <h3 className="text-lg font-semibold mb-2">Cargando Lección</h3>
                <p className="text-sm text-gray-600">
                  Preparando el contenido específico de la lección y verificando video educativo disponible...
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
