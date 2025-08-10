const fs = require('fs');
const path = require('path');

console.log('🔧 VALIDACIÓN SIMPLE DE GEMINI API');
console.log('=' .repeat(40));

// Cargar .env.local
try {
  require('dotenv').config({ path: './.env.local' });
  console.log('✅ Variables cargadas');
} catch (e) {
  console.log('❌ Error cargando .env.local');
  process.exit(1);
}

const apiKey = process.env.GEMINI_API_KEY;
console.log(`API Key presente: ${apiKey ? 'SÍ' : 'NO'}`);
console.log(`Formato válido: ${apiKey?.startsWith('AIza') ? 'SÍ' : 'NO'}`);
console.log(`Longitud: ${apiKey?.length || 0} caracteres`);

if (apiKey && apiKey.startsWith('AIza')) {
  console.log('✅ CONFIGURACIÓN VÁLIDA');
} else {
  console.log('❌ CONFIGURACIÓN INVÁLIDA');
}
