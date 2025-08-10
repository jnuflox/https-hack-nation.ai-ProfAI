// Test directo de la función authorize del auth.ts
const bcrypt = require('bcryptjs');

// Simulamos la función authorize del auth.ts
async function testAuthorize() {
  console.log('🧪 Probando función authorize directamente...\n');
  
  const credentials = {
    email: 'john@doe.com',
    password: 'johndoe123'
  };

  console.log('🔐 Attempting login for:', credentials.email);

  // Demo accounts - copiado del auth.ts
  const demoAccounts = [
    {
      email: 'john@doe.com',
      password: 'johndoe123',
      id: 'demo_john_doe',
      name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe'
    },
    {
      email: 'demo@profai.com',
      password: 'profai2025',
      id: 'demo_profai',
      name: 'Demo User',
      firstName: 'Demo',
      lastName: 'User'
    }
  ];

  // Check demo accounts first
  const demoUser = demoAccounts.find(
    account => account.email.toLowerCase() === credentials.email.toLowerCase()
  );

  if (demoUser) {
    console.log('🎭 Demo account detected:', demoUser.email);
    if (demoUser.password === credentials.password) {
      console.log('✅ Demo login successful');
      console.log('👤 User details:', {
        id: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
        firstName: demoUser.firstName,
        lastName: demoUser.lastName,
      });
      return true;
    } else {
      console.log('❌ Demo password incorrect');
      console.log('Expected:', demoUser.password);
      console.log('Received:', credentials.password);
      return false;
    }
  }

  console.log('❌ No demo account found');
  return false;
}

testAuthorize().then(success => {
  console.log('\n🏁 Test result:', success ? 'PASSED' : 'FAILED');
}).catch(error => {
  console.error('💥 Test error:', error);
});
