// Quick test for database connection
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function quickTest() {
  try {
    console.log('🔍 Probando conexión rápida...');
    
    // Test simple connection with timeout
    const startTime = Date.now();
    
    await Promise.race([
      prisma.$connect(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      )
    ]);
    
    const connectionTime = Date.now() - startTime;
    console.log(`✅ Conectado en ${connectionTime}ms`);
    
    // Quick count test
    const userCount = await prisma.user.count();
    console.log(`✅ Usuarios en DB: ${userCount}`);
    
    console.log('🎉 Base de datos funcionando correctamente');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('timeout')) {
      console.log('💡 La conexión está tardando mucho - posible problema de red');
    }
  } finally {
    await prisma.$disconnect();
  }
}

quickTest();
