
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { withDatabaseTimeout, createTempUser, checkDatabaseHealth } from '@/lib/db-utils';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Signup endpoint called');
    
    const body = await request.json();
    console.log('📦 Request body received:', { 
      email: body.email, 
      hasPassword: !!body.password,
      firstName: body.firstName,
      lastName: body.lastName 
    });
    
    const { email, password, firstName, lastName, learningStyle, skillLevel } = body;

    // Validaciones básicas
    if (!email || !password) {
      console.log('❌ Validation failed: missing email or password');
      return NextResponse.json(
        { error: 'Email y password son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log('❌ Validation failed: password too short');
      return NextResponse.json(
        { error: 'La password debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    console.log('✅ Basic validations passed');

    console.log('🔍 Checking database health...');
    const isDatabaseHealthy = await checkDatabaseHealth();
    
    if (!isDatabaseHealthy) {
      console.log('⚠️ Database unhealthy, creating temporary user...');
      const tempUser = createTempUser({ email, firstName, lastName });
      
      return NextResponse.json({
        success: true,
        message: 'Usuario temporal creado exitosamente - completar setup de BD',
        user: {
          id: tempUser.id,
          email: tempUser.email,
          name: tempUser.name,
          firstName: tempUser.firstName,
          lastName: tempUser.lastName,
          isTemporary: true
        },
        warning: 'Base de datos no disponible - usando modo temporal'
      });
    }

    try {
      console.log('🔍 Checking if user already exists...');
      // Verificar si el usuario ya existe
      const existingUser = await withDatabaseTimeout(
        () => prisma.user.findUnique({ where: { email } }),
        { 
          timeoutMs: 8000,
          fallbackData: null 
        }
      );

      if (existingUser) {
        console.log('❌ User already exists:', email);
        return NextResponse.json(
          { error: 'Un usuario con este email ya existe' },
          { status: 400 }
        );
      }

      console.log('🔒 Hashing password...');
      const hashedPassword = await bcrypt.hash(password, 12);

      console.log('📊 Preparing user data...');
      const userData = {
        email,
        password: hashedPassword,
        name: `${firstName || ''} ${lastName || ''}`.trim() || 'Usuario ProfAI',
        firstName: firstName || null,
        lastName: lastName || null,
        learningStyle: learningStyle || {
          visual: 0.7,
          auditory: 0.5,
          kinesthetic: 0.6
        },
        skillLevel: skillLevel || {
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
        }
      };

      console.log('💾 Creating user in database...');
      const user = await withDatabaseTimeout(
        () => prisma.user.create({ data: userData }),
        {
          maxRetries: 3,
          timeoutMs: 12000,
          fallbackData: null
        }
      );

      if (!user) {
        // Si falló la creación, crear usuario temporal
        console.log('⚠️ Database user creation failed, creating temporary user...');
        const tempUser = createTempUser({ email, firstName, lastName });
        
        return NextResponse.json({
          success: true,
          message: 'Usuario temporal creado exitosamente - completar setup de BD',
          user: {
            id: tempUser.id,
            email: tempUser.email,
            name: tempUser.name,
            firstName: tempUser.firstName,
            lastName: tempUser.lastName,
            isTemporary: true
          },
          warning: 'Base de datos no disponible - usando modo temporal'
        });
      }

      console.log('✅ User created successfully in database:', { id: user.id, email: user.email });

      return NextResponse.json({
        success: true,
        message: 'Usuario creado exitosamente',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          isTemporary: false
        }
      });

    } catch (dbError: any) {
      console.error('🗄️ Database error:', dbError.message);
      
      // Si hay error de base de datos, crear usuario temporal
      console.log('⚠️ Fallback to temporary user creation');
      const tempUser = createTempUser({ email, firstName, lastName });

      return NextResponse.json({
        success: true,
        message: 'Usuario temporal creado exitosamente - completar setup de BD',
        user: {
          id: tempUser.id,
          email: tempUser.email,
          name: tempUser.name,
          firstName: tempUser.firstName,
          lastName: tempUser.lastName,
          isTemporary: true
        },
        warning: 'Base de datos no disponible - usando modo temporal'
      });
    }

  } catch (error: any) {
    console.error('💥 General error:', error);
    
    // Si hay error general, intentar crear usuario temporal como último recurso
    try {
      const body = await request.json();
      const { firstName, lastName, email } = body;
      
      if (email) {
        console.log('🚨 Creating emergency temporary user...');
        const tempUser = createTempUser({ email, firstName, lastName });
        
        return NextResponse.json({
          success: true,
          message: 'Usuario temporal de emergencia creado',
          user: {
            id: tempUser.id,
            email: tempUser.email,
            name: tempUser.name,
            firstName: tempUser.firstName,
            lastName: tempUser.lastName,
            isTemporary: true
          },
          warning: 'Sistema en modo de emergencia - funcionalidad básica disponible'
        });
      }
    } catch (emergencyError) {
      console.error('💥 Emergency fallback also failed:', emergencyError);
    }
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Intenta de nuevo más tarde'
      },
      { status: 500 }
    );
  }
}
