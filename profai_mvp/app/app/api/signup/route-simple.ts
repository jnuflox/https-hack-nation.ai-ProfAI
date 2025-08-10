import { NextRequest, NextResponse } from 'next/server';

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
    
    const { email, password, firstName, lastName } = body;

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

    console.log('✅ Validations passed');
    
    // Simular creación exitosa (sin base de datos por ahora)
    const mockUser = {
      id: `user_${Date.now()}`,
      email,
      name: `${firstName || ''} ${lastName || ''}`.trim() || 'Usuario ProfAI'
    };

    console.log('✅ Mock user created:', mockUser);

    return NextResponse.json({
      success: true,
      message: 'Usuario creado exitosamente (modo test)',
      user: mockUser
    });

  } catch (error: any) {
    console.error('💥 Error en signup:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
