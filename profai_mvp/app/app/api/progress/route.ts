import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { mockData, isDemoUser } from '@/lib/mock-data';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    console.log('📊 Fetching course progress for user:', session.user.id);

    // For now, we'll use mock data for all users since the database schema needs adjustment
    console.log('🎭 Using mock course progress data');
    
    // Get the course with most progress as the "current" course
    const activeCourse = mockData.courses.find(course => course.progress > 0 && course.progress < 100) 
                       || mockData.courses.find(course => course.progress === 0)
                       || mockData.courses[0];

    if (!activeCourse) {
      return NextResponse.json({ error: 'No hay cursos disponibles' }, { status: 404 });
    }

    const courseLessons = mockData.lessons[activeCourse.id] || [];

    const courseProgress = {
      course: {
        id: activeCourse.id,
        title: activeCourse.title,
        description: activeCourse.description,
        category: activeCourse.category,
        difficulty: activeCourse.difficulty,
        imageUrl: activeCourse.imageUrl,
        progress: activeCourse.progress,
        totalLessons: courseLessons.length,
        completedLessons: courseLessons.filter((l: any) => l.isCompleted).length
      },
      lessons: courseLessons,
      stats: {
        totalLessonsCompleted: mockData.userProgress['demo_john_doe']?.totalLessonsCompleted || 12,
        currentStreak: mockData.userProgress['demo_john_doe']?.currentStreak || 5,
        avgSessionTime: mockData.userProgress['demo_john_doe']?.avgSessionTime || 18
      },
      warning: isDemoUser(session.user.id) 
        ? 'Usando datos de demostración - base de datos no disponible'
        : 'Funcionalidad de progreso temporal con datos de demostración'
    };

    console.log('✅ Mock data query successful');
    return NextResponse.json(courseProgress);

  } catch (error) {
    console.error('Error fetching course progress:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
