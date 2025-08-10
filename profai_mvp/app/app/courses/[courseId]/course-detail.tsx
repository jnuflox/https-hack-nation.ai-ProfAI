'use client';

import { useEffect, useState } from 'react';
import { CourseImage } from '@/components/ui/image-with-fallback';
import { ProgressBar } from '@/components/ui/progress-bar';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Clock, 
  Play, 
  CheckCircle,
  Circle,
  ArrowLeft,
  Star,
  Brain,
  Code,
  Zap,
  Trophy,
  Target,
  MessageSquare
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
  lessons: Lesson[];
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

interface CourseDetailPageProps {
  courseId: string;
}

export function CourseDetailPage({ courseId }: CourseDetailPageProps) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetail();
  }, [courseId]);

  const fetchCourseDetail = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data.course);
      }
    } catch (error) {
      console.error('Error fetching course detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Beginner';
      case 2: return 'Basic';
      case 3: return 'Intermediate';
      case 4: return 'Advanced';
      case 5: return 'Expert';
      default: return 'Intermedio';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'theory': return <Brain className="h-6 w-6 text-blue-600" />;
      case 'tooling': return <Code className="h-6 w-6 text-green-600" />;
      case 'hybrid': return <Zap className="h-6 w-6 text-purple-600" />;
      default: return <BookOpen className="h-6 w-6 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'theory': return 'bg-blue-100 text-blue-800';
      case 'tooling': return 'bg-green-100 text-green-800';
      case 'hybrid': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getNextLesson = () => {
    if (!course) return null;
    return course.lessons.find(lesson => !lesson.isCompleted) || course.lessons[0];
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
          <Button onClick={() => router.push('/courses')} variant="outline">
            Back to Courses
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const nextLesson = getNextLesson();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/courses" className="hover:text-blue-600">
            Cursos
          </Link>
          <span>/</span>
          <span className="text-gray-900">{course.title}</span>
        </div>

        {/* Course Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-start space-x-4 mb-6">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push('/courses')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>

            <div className="flex items-start space-x-6">
              <CourseImage
                src={course.imageUrl} 
                title={course.title}
                className="w-32 h-24 object-cover rounded-lg shadow-md"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  {getCategoryIcon(course.category)}
                  <span className={`px-3 py-1 text-sm rounded-full ${getCategoryColor(course.category)}`}>
                    {getDifficultyText(course.difficulty)}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{course.title}</h1>
                <p className="text-lg text-gray-600 leading-relaxed">{course.description}</p>
              </div>
            </div>
          </div>

          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-600" />
                  Tu Progreso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completado</span>
                    <span>{course.progress}%</span>
                  </div>
                  <ProgressBar progress={course.progress} color="blue" size="md" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{course.completedLessons}</div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-600">{course.totalLessons}</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                </div>

                {nextLesson && (
                  <Button 
                    onClick={() => router.push(`/courses/${course.id}/lessons/${nextLesson.id}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {course.progress > 0 ? 'Continue' : 'Start Course'}
                  </Button>
                )}

                <Button 
                  onClick={() => router.push('/chat')}
                  variant="outline" 
                  className="w-full"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Preguntarle al Prof
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lecciones</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{course.totalLessons}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Duración Total</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatDuration(course.lessons.reduce((acc, lesson) => acc + lesson.estimatedDuration, 0))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dificultad</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getDifficultyText(course.difficulty)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progreso</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{course.progress}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Lessons List */}
        <Card>
          <CardHeader>
            <CardTitle>Contenido del Curso</CardTitle>
            <CardDescription>
              Todas las lecciones organizadas para tu aprendizaje progresivo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {course.lessons.map((lesson, index) => (
              <div 
                key={lesson.id}
                className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${
                  lesson.isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => router.push(`/courses/${course.id}/lessons/${lesson.id}`)}
              >
                <div className="flex-shrink-0">
                  {lesson.isCompleted ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm text-gray-500">Lección {index + 1}</span>
                    <div className="flex space-x-1">
                      {lesson.hasVideoContent && (
                        <span className="w-2 h-2 bg-red-500 rounded-full" title="Video" />
                      )}
                      {lesson.hasCodeExamples && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full" title="Código" />
                      )}
                      {lesson.hasQuiz && (
                        <span className="w-2 h-2 bg-purple-500 rounded-full" title="Quiz" />
                      )}
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{lesson.title}</h4>
                  <p className="text-sm text-gray-600">{lesson.description}</p>
                </div>
                
                <div className="flex-shrink-0 text-right">
                  <div className="text-sm text-gray-500 mb-1">
                    {formatDuration(lesson.estimatedDuration)}
                  </div>
                  {lesson.progress > 0 && !lesson.isCompleted && (
                    <div className="text-xs text-blue-600">
                      {lesson.progress}% completado
                    </div>
                  )}
                </div>
                
                <div className="flex-shrink-0">
                  <Play className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
