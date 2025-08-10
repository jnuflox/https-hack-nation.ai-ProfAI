// Test de login para cuentas demo
const fetch = require('node-fetch');

async function testDemoLogin() {
  try {
    console.log('🧪 Probando login de cuenta demo...\n');
    
    // Test credentials
    const credentials = {
      email: 'john@doe.com',
      password: 'johndoe123'
    };
    
    console.log('📤 Enviando petición de login...');
    console.log('Email:', credentials.email);
    console.log('Password:', '*'.repeat(credentials.password.length));
    
    // Try to sign in using NextAuth API
    const response = await fetch('http://localhost:3000/api/auth/signin', {
      method: 'GET'
    });
    
    console.log('\n📥 Respuesta de /api/auth/signin:');
    console.log('Status:', response.status);
    
    if (response.ok) {
      console.log('✅ Página de signin disponible');
    } else {
      console.log('❌ Error accediendo a página de signin');
    }
    
    // Try callback URL (this is what actually processes the login)
    const callbackResponse = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `email=${encodeURIComponent(credentials.email)}&password=${encodeURIComponent(credentials.password)}&redirect=false`
    });
    
    console.log('\n📥 Respuesta de callback:');
    console.log('Status:', callbackResponse.status);
    
    const callbackText = await callbackResponse.text();
    console.log('Response:', callbackText.substring(0, 200) + '...');
    
    if (callbackResponse.ok) {
      console.log('✅ Login exitoso para cuenta demo');
    } else {
      console.log('❌ Error en login de cuenta demo');
    }
    
  } catch (error) {
    console.error('\n💥 Error en la prueba:', error.message);
  }
}

// Wait for server to be ready
setTimeout(testDemoLogin, 2000);
