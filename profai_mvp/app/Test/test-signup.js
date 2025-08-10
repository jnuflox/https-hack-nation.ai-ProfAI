// Test para diagnosticar el problema de signup
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testSignup() {
  try {
    console.log('🔍 Diagnosticando problema de signup...\n');
    
    // Test 1: Conectividad de base de datos
    console.log('1. Probando conexión a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa a la base de datos\n');
    
    // Test 2: Verificar tabla User existe
    console.log('2. Verificando tabla User...');
    const userCount = await prisma.user.count();
    console.log(`✅ Tabla User existe. Usuarios actuales: ${userCount}\n`);
    
    // Test 3: Probar bcrypt
    console.log('3. Probando bcrypt...');
    const testPassword = 'test123';
    const hashedPassword = await bcrypt.hash(testPassword, 12);
    console.log('✅ bcrypt funcionando correctamente\n');
    
    // Test 4: Probar creación de usuario
    console.log('4. Probando creación de usuario de prueba...');
    const testEmail = `test-${Date.now()}@example.com`;
    
    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        name: 'Usuario de Prueba',
        firstName: 'Usuario',
        lastName: 'Prueba',
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
        }
      }
    });
    
    console.log('✅ Usuario de prueba creado exitosamente');
    console.log('ID:', testUser.id);
    console.log('Email:', testUser.email);
    
    // Limpiar - eliminar usuario de prueba
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    console.log('✅ Usuario de prueba eliminado\n');
    
    // Test 5: Simular la lógica exacta del endpoint
    console.log('5. Simulando lógica del endpoint signup...');
    const mockBody = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: `signup-test-${Date.now()}@example.com`,
      password: 'password123',
      learningStyle: {
        visual: 0.9,
        auditory: 0.5,
        kinesthetic: 0.6,
      },
      skillLevel: {
        theory: 'beginner',
        tooling: 'beginner',
        prompting: 'beginner'
      }
    };
    
    // Verificar si usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { email: mockBody.email }
    });
    
    if (existingUser) {
      console.log('❌ Usuario ya existe (no debería pasar en este test)');
      return;
    }
    
    // Hash password
    const newHashedPassword = await bcrypt.hash(mockBody.password, 12);
    
    // Crear usuario
    const newUser = await prisma.user.create({
      data: {
        email: mockBody.email,
        password: newHashedPassword,
        name: `${mockBody.firstName} ${mockBody.lastName}`,
        firstName: mockBody.firstName,
        lastName: mockBody.lastName,
        learningStyle: mockBody.learningStyle,
        skillLevel: mockBody.skillLevel,
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
      }
    });
    
    console.log('✅ Simulación de signup exitosa');
    console.log('Usuario creado:', {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name
    });
    
    // Limpiar
    await prisma.user.delete({
      where: { id: newUser.id }
    });
    console.log('✅ Usuario de simulación eliminado\n');
    
    console.log('🎉 TODOS LOS TESTS PASARON');
    console.log('El problema NO está en la lógica del signup.');
    console.log('Posibles causas del error 500:');
    console.log('1. Error de CORS');
    console.log('2. Problema de serialización JSON');
    console.log('3. Error en middleware de NextAuth');
    console.log('4. Variables de entorno no cargadas correctamente\n');
    
  } catch (error) {
    console.error('❌ Error encontrado:', error.message);
    console.error('Stack:', error.stack);
    
    if (error.code === 'P2002') {
      console.log('\n💡 Error P2002: Violación de constraint único');
      console.log('Causa: Usuario con este email ya existe');
    } else if (error.code === 'P2025') {
      console.log('\n💡 Error P2025: Registro no encontrado');
      console.log('Causa: Tabla o campo no existe en la BD');
    } else if (error.message.includes('connect')) {
      console.log('\n💡 Error de conexión a base de datos');
      console.log('Revisar DATABASE_URL en .env');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testSignup();
