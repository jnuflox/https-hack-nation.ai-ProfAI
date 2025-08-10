
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { mockData, isDemoUser, getDemoUser } from '@/lib/mock-data';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    console.log('👤 Fetching profile for user:', session.user.id);

    // Check if user is demo user - return mock data
    if (isDemoUser(session.user.id)) {
      const demoUser = getDemoUser(session.user.id);
      if (!demoUser) {
        return NextResponse.json({ error: 'Usuario demo no encontrado' }, { status: 404 });
      }

      return NextResponse.json({ profile: demoUser });
    }

    // Try database with timeout fallback
    try {
      console.log('🗄️ Attempting database query...');

      const user = await Promise.race([
        prisma.user.findUnique({
          where: { id: session.user.id },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            learningStyle: true,
            skillLevel: true,
            emotionBaseline: true,
            preferences: true,
            totalLessonsCompleted: true,
            currentStreak: true
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 10000)
        )
      ]);

      if (!user) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
      }

      // Proporcionar valores por defecto si no existen
      const profile = {
        ...user,
        learningStyle: user.learningStyle || {
          visual: 0.7,
          auditory: 0.5,
          kinesthetic: 0.6
        },
        skillLevel: user.skillLevel || {
          theory: 'beginner',
          tooling: 'beginner',
          prompting: 'beginner'
        },
        emotionBaseline: user.emotionBaseline || {
          confusion_threshold: 0.7,
          frustration_threshold: 0.6,
          engagement_baseline: 0.5
        },
        preferences: user.preferences || {
          preferred_format: 'hybrid',
          language: 'es',
          pace: 'normal',
          difficulty_preference: 'adaptive'
        }
      };

      console.log('✅ Database query successful');
      return NextResponse.json({ profile });

    } catch (dbError: any) {
      console.error('🗄️ Database error:', dbError.message);
      console.log('⚠️ Fallback to demo profile');
      
      // Fallback to demo profile with current user data
      const fallbackProfile = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || 'Usuario ProfAI',
        firstName: session.user.firstName || 'Usuario',
        lastName: session.user.lastName || 'ProfAI',
        learningStyle: {
          visual: 0.7,
          auditory: 0.5,
          kinesthetic: 0.6
        },
        skillLevel: {
          theory: 'beginner',
          tooling: 'beginner',
          prompting: 'beginner'
        },
        emotionBaseline: {
          confusion_threshold: 0.7,
          frustration_threshold: 0.6,
          engagement_baseline: 0.5
        },
        preferences: {
          preferred_format: 'hybrid',
          language: 'es',
          pace: 'normal',
          difficulty_preference: 'adaptive'
        },
        totalLessonsCompleted: 0,
        currentStreak: 0,
        warning: 'Usando datos de demostración - base de datos no disponible'
      };

      return NextResponse.json({ profile: fallbackProfile });
    }

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const profileData = await request.json();

    // Validar datos
    if (!profileData.firstName || !profileData.lastName) {
      return NextResponse.json(
        { error: 'Nombre y apellido son requeridos' },
        { status: 400 }
      );
    }

    // Actualizar perfil
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        name: `${profileData.firstName} ${profileData.lastName}`.trim(),
        learningStyle: profileData.learningStyle,
        skillLevel: profileData.skillLevel,
        emotionBaseline: profileData.emotionBaseline,
        preferences: profileData.preferences,
      }
    });

    return NextResponse.json({ 
      message: 'Perfil actualizado correctamente',
      profile: updatedUser
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
