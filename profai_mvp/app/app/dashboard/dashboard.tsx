
'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { CourseImage } from '@/components/ui/image-with-fallback';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Brain, 
  MessageSquare, 
  Trophy, 
  Clock, 
  TrendingUp,
  Target,
  Play,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  imageUrl: string;
  progress?: number;
}

interface UserStats {
  totalLessonsCompleted: number;
  currentStreak: number;
  coursesInProgress: number;
  avgSessionTime: number;
}

export function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalLessonsCompleted: 0,
    currentStreak: 0,
    coursesInProgress: 0,
    avgSessionTime: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch courses
      const coursesResponse = await fetch('/api/courses');
      const coursesData = await coursesResponse.json();
      setCourses(coursesData.courses || []);

      // Fetch user progress
      const progressResponse = await fetch('/api/users/progress');
      const progressData = await progressResponse.json();
      setUserStats(progressData.stats || userStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Principiante';
      case 2: return 'Básico';
      case 3: return 'Intermedio';
      case 4: return 'Avanzado';
      case 5: return 'Experto';
      default: return 'Intermedio';
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
          <h1 className="text-3xl font-bold mb-2">
            ¡Bienvenido de nuevo, {session?.user?.firstName || session?.user?.name || 'Estudiante'}! 🎓
          </h1>
          <p className="text-blue-100 text-lg">
            Continúa tu journey de aprendizaje con IA. Tu profesor personal está listo para adaptarse a tu ritmo.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lecciones Completadas</CardTitle>
              <BookOpen className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{userStats.totalLessonsCompleted}</div>
              <p className="text-xs text-muted-foreground">
                +2 desde la semana pasada
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Racha Actual</CardTitle>
              <Trophy className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{userStats.currentStreak} días</div>
              <p className="text-xs text-muted-foreground">
                ¡Mantén el momentum!
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cursos en Progreso</CardTitle>
              <Target className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{userStats.coursesInProgress}</div>
              <p className="text-xs text-muted-foreground">
                Enfoque múltiple
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
              <Clock className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{userStats.avgSessionTime}m</div>
              <p className="text-xs text-muted-foreground">
                Por sesión
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Tus Cursos</h2>
              <Button 
                onClick={() => router.push('/courses')} 
                variant="outline"
              >
                Ver todos
              </Button>
            </div>
            
            <div className="grid gap-6">
              {courses.slice(0, 3).map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="flex">
                    <div className="w-48 h-32 relative overflow-hidden rounded-l-lg">
                      <CourseImage
                        src={course.imageUrl} 
                        title={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <CardHeader className="p-0 pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                            {course.title}
                          </CardTitle>
                          <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(course.category)}`}>
                            {getDifficultyText(course.difficulty)}
                          </span>
                        </div>
                        <CardDescription className="text-sm">
                          {course.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between">
                          <Button 
                            onClick={() => router.push(`/courses/${course.id}`)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Continue
                          </Button>
                          <div className="text-sm text-gray-500">
                            {course.progress ? `${course.progress}% completed` : 'Not started'}
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-yellow-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => router.push('/chat')} 
                  className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Preguntarle al Prof
                </Button>
                <Button 
                  onClick={() => router.push('/courses')} 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Explorar Cursos
                </Button>
                <Button 
                  onClick={() => router.push('/profile')} 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Brain className="mr-2 h-4 w-4" />
                  Mi Perfil de Aprendizaje
                </Button>
              </CardContent>
            </Card>

            {/* Learning Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                  Recomendaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Lección Sugerida</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Basado en tu progreso, te recomendamos continuar con "Redes Neuronales Básicas"
                  </p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Empezar Ahora
                  </Button>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Revisión Recomendada</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    Hace 3 días estudiaste "ML Básico". ¿Qué tal un repaso rápido?
                  </p>
                  <Button size="sm" variant="outline" className="border-purple-300 text-purple-700">
                    Revisar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-gray-600" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="text-sm">
                      <span className="font-medium">Lección completada:</span> ¿Qué es Machine Learning?
                      <div className="text-xs text-gray-500">Hace 2 horas</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="text-sm">
                      <span className="font-medium">Chat:</span> Pregunta sobre redes neuronales
                      <div className="text-xs text-gray-500">Ayer</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="text-sm">
                      <span className="font-medium">Ejercicio:</span> Implementación de neurona
                      <div className="text-xs text-gray-500">Hace 2 días</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
