import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { mockData, isDemoUser } from '@/lib/mock-data';

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const courseId = params.courseId;
    console.log('📖 Fetching course detail for:', courseId);

    // Try database with timeout fallback
    try {
      console.log('🗄️ Attempting database query...');

      // Obtener curso con sus lecciones
      const course = await Promise.race([
        prisma.course.findUnique({
          where: { 
            id: courseId,
            isActive: true
          },
          include: {
            lessons: {
              orderBy: { createdAt: 'asc' },
              include: {
                learningSessions: {
                  where: { userId: session.user.id },
                  select: {
                    status: true,
                    completionRate: true
                  }
                }
              }
            }
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 10000)
        )
      ]);

      if (!course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }

      // Calculate progress per lesson
      const lessonsWithProgress = course.lessons.map((lesson: any) => {
        const session = lesson.learningSessions[0];
        const isCompleted = session?.status === 'completed';
        const progress = session?.completionRate ? Math.round(session.completionRate * 100) : 0;

        return {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          estimatedDuration: lesson.estimatedDuration,
          difficultyLevel: lesson.difficultyLevel,
          hasVideoContent: lesson.hasVideoContent,
          hasCodeExamples: lesson.hasCodeExamples,
          hasQuiz: lesson.hasQuiz,
          isCompleted,
          progress
        };
      });

      // Calcular progreso total del curso
      const completedLessons = lessonsWithProgress.filter((l: any) => l.isCompleted).length;
      const totalLessons = lessonsWithProgress.length;
      const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      const courseWithProgress = {
        id: course.id,
        title: course.title,
        description: course.description,
        category: course.category,
        difficulty: course.difficulty,
        imageUrl: course.imageUrl,
        lessons: lessonsWithProgress,
        progress: overallProgress,
        totalLessons,
        completedLessons
      };

      console.log('✅ Database query successful');
      return NextResponse.json({
        course: courseWithProgress
      });

    } catch (dbError: any) {
      console.error('🗄️ Database error:', dbError.message);
      console.log('⚠️ Fallback to mock course detail');
      
      // Fallback to mock data
      const mockCourse = mockData.courses.find(c => c.id === courseId);
      if (!mockCourse) {
        return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
      }

      const mockLessons = mockData.lessons[courseId] || [];

      const courseWithProgress = {
        ...mockCourse,
        lessons: mockLessons,
        warning: 'Usando datos de demostración - base de datos no disponible'
      };

      return NextResponse.json({
        course: courseWithProgress
      });
    }

  } catch (error) {
    console.error('Error fetching course detail:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
