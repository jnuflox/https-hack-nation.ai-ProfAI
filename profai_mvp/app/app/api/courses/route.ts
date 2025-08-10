
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { mockData, isDemoUser } from '@/lib/mock-data';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    console.log('🎓 Fetching courses for user:', session.user.id);

    // Try database with timeout fallback
    try {
      console.log('🗄️ Attempting database query...');

      // Obtener todos los cursos activos
      const courses = await Promise.race([
        prisma.course.findMany({
          where: { isActive: true },
          include: {
            lessons: {
              select: { id: true },
            },
            _count: {
              select: { lessons: true }
            }
          },
          orderBy: { sortOrder: 'asc' }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 10000)
        )
      ]);

      // Para cada curso, obtener el progreso del usuario
      const coursesWithProgress = await Promise.all(
        courses.map(async (course: any) => {
          const completedLessons = await prisma.learningSession.count({
            where: {
              userId: session.user.id,
              lesson: {
                courseId: course.id
              },
              status: 'completed'
            }
          });

          const totalLessons = course._count.lessons;
          const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

          return {
            id: course.id,
            title: course.title,
            description: course.description,
            category: course.category,
            difficulty: course.difficulty,
            imageUrl: course.imageUrl,
            progress,
            totalLessons,
            completedLessons
          };
        })
      );

      console.log('✅ Database query successful');
      return NextResponse.json({
        courses: coursesWithProgress,
        total: courses.length
      });

    } catch (dbError: any) {
      console.error('🗄️ Database error:', dbError.message);
      console.log('⚠️ Fallback to mock courses');
      
      // Fallback to mock data
      return NextResponse.json({
        courses: mockData.courses,
        total: mockData.courses.length,
        warning: 'Usando datos de demostración - base de datos no disponible'
      });
    }

  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
