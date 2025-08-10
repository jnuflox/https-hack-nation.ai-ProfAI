// Prueba específica del endpoint de NextAuth
const https = require('http');
const querystring = require('querystring');

async function testNextAuthLogin() {
  console.log('🧪 Probando login con NextAuth...\n');
  
  const credentials = {
    email: 'john@doe.com',
    password: 'johndoe123',
    redirect: 'false'
  };
  
  const postData = querystring.stringify(credentials);
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/callback/credentials',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log('📤 Request enviado');
      console.log('📥 Status Code:', res.statusCode);
      console.log('📋 Headers:', res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('💬 Response body:', data);
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', (err) => {
      console.error('❌ Error:', err.message);
      reject(err);
    });
    
    console.log('📤 Enviando datos:', postData);
    req.write(postData);
    req.end();
  });
}

// Ejecutar la prueba
testNextAuthLogin()
  .then(result => {
    console.log('\n✅ Prueba completada');
    console.log('Status:', result.statusCode);
    
    if (result.statusCode === 200) {
      console.log('🎉 ¡Login exitoso!');
    } else {
      console.log('⚠️ Login falló');
    }
  })
  .catch(err => {
    console.error('💥 Error en la prueba:', err);
  });
