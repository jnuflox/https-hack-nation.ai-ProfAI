// Test directo de la API de signup
const fetch = require('node-fetch');

async function testSignupAPI() {
  try {
    console.log('🧪 Probando API de signup directamente...\n');
    
    const testData = {
      firstName: 'Test',
      lastName: 'User',
      email: `test-api-${Date.now()}@example.com`,
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
    
    console.log('📤 Enviando petición POST a /api/signup...');
    console.log('Datos:', {
      email: testData.email,
      firstName: testData.firstName,
      lastName: testData.lastName,
      hasPassword: !!testData.password
    });
    
    const response = await fetch('http://localhost:3000/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('\n📥 Respuesta recibida:');
    console.log('Status:', response.status, response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers));
    
    const responseText = await response.text();
    console.log('Body (raw):', responseText);
    
    try {
      const responseJson = JSON.parse(responseText);
      console.log('Body (JSON):', responseJson);
      
      if (response.ok) {
        console.log('\n✅ SIGNUP EXITOSO');
        console.log('Usuario creado:', responseJson.user);
      } else {
        console.log('\n❌ SIGNUP FALLÓ');
        console.log('Error:', responseJson.error);
      }
    } catch (parseError) {
      console.log('\n⚠️ Error parseando JSON response');
      console.log('Response no es JSON válido');
    }
    
  } catch (error) {
    console.error('\n💥 Error en la petición:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 El servidor no está corriendo en http://localhost:3000');
      console.log('Asegúrate de que el servidor Next.js esté iniciado con: npm run dev');
    }
  }
}

// Esperar un poco antes de ejecutar para dar tiempo al servidor
console.log('Esperando 2 segundos para asegurar que el servidor esté listo...');
setTimeout(testSignupAPI, 2000);
