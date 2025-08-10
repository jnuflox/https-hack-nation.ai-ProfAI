// Test simple para verificar el login de demostración
const fetch = require('node-fetch');

async function testDemoLogin() {
  try {
    console.log('🧪 Probando acceso a página de signin...');
    
    const response = await fetch('http://localhost:3000/api/auth/signin', {
      method: 'GET',
      headers: {
        'User-Agent': 'Node.js Test Client'
      }
    });
    
    console.log('Status de signin:', response.status);
    console.log('Headers:', response.headers.raw());
    
    if (response.ok) {
      console.log('✅ Página de signin accesible');
      
      // Ahora probamos el login real
      console.log('\n🔐 Probando login con credenciales demo...');
      
      const loginResponse = await fetch('http://localhost:3000/api/auth/callback/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Node.js Test Client'
        },
        body: 'email=john%40doe.com&password=johndoe123&redirect=false'
      });
      
      console.log('Status de login:', loginResponse.status);
      console.log('Headers de respuesta:', loginResponse.headers.raw());
      
      const responseText = await loginResponse.text();
      console.log('Respuesta del servidor:', responseText.substring(0, 500));
      
    } else {
      console.log('❌ Error accediendo a página de signin');
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

console.log('Iniciando prueba en 2 segundos...');
setTimeout(testDemoLogin, 2000);
