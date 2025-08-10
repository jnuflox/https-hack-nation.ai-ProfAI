// Prueba usando fetch nativo en lugar de http module
async function testDemo() {
  console.log('🧪 Probando con fetch...');
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/signin', {
      method: 'GET'
    });
    
    console.log('Status:', response.status);
    console.log('StatusText:', response.statusText);
    
    const text = await response.text();
    console.log('Response length:', text.length);
    console.log('Response preview:', text.substring(0, 200));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testDemo();
