
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

    console.log('📊 Fetching progress for user:', session.user.id);

    // Try database with timeout fallback
    try {
      console.log('🗄️ Attempting database query...');

      // Obtener estadísticas del usuario
      const user = await Promise.race([
        prisma.user.findUnique({
          where: { id: session.user.id },
          select: {
            totalLessonsCompleted: true,
            currentStreak: true,
            lastActiveAt: true
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 10000)
        )
      ]);

      // Obtener cursos en progreso (con al menos una lección iniciada pero no todas completadas)
      const coursesInProgress = await Promise.race([
        prisma.course.count({
          where: {
            isActive: true,
            lessons: {
              some: {
                learningSessions: {
                  some: {
                    userId: session.user.id,
                    status: {
                      in: ['started', 'paused']
                    }
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

      // Calcular tiempo promedio de sesión (simplificado para evitar errores de tipo)
      let avgSessionTime = 15; // valor por defecto en minutos

      // Obtener actividad reciente
      const recentActivity = await Promise.race([
        prisma.learningSession.findMany({
          where: { userId: session.user.id },
          include: {
            lesson: {
              select: {
                title: true,
                course: {
                  select: { title: true }
                }
              }
            }
          },
          orderBy: { startedAt: 'desc' },
          take: 5
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 10000)
        )
      ]);

      const stats = {
        totalLessonsCompleted: user?.totalLessonsCompleted || 0,
        currentStreak: user?.currentStreak || 0,
        coursesInProgress,
        avgSessionTime
      };

      const formattedActivity = recentActivity.map((activity: any) => ({
        id: activity.id,
        type: activity.status === 'completed' ? 'lesson_completed' : 'lesson_started',
        title: activity.lesson?.title || 'Lección sin título',
        course: activity.lesson?.course?.title || 'Curso sin título',
        timestamp: activity.startedAt,
        status: activity.status
      }));

      console.log('✅ Database query successful');
      return NextResponse.json({
        stats,
        recentActivity: formattedActivity
      });

    } catch (dbError: any) {
      console.error('🗄️ Database error:', dbError.message);
      console.log('⚠️ Fallback to mock progress');
      
      // Fallback to mock data
      const mockProgress = mockData.userProgress['demo_john_doe'];
      
      return NextResponse.json({
        stats: {
          totalLessonsCompleted: mockProgress.totalLessonsCompleted,
          currentStreak: mockProgress.currentStreak,
          coursesInProgress: mockProgress.coursesInProgress,
          avgSessionTime: mockProgress.avgSessionTime
        },
        recentActivity: mockProgress.recentActivity,
        warning: 'Usando datos de demostración - base de datos no disponible'
      });
    }

  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
