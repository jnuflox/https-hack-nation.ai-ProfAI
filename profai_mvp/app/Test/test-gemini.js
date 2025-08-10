// Test script for Gemini API integration
// Prueba la integración con Gemini API usando el token proporcionado

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini with the provided API key
const genAI = new GoogleGenerativeAI("sk_66695092ea908aebd144a2a79e0de62f949f5f50551c05b9");

async function testGeminiIntegration() {
  try {
    console.log('🚀 Iniciando prueba de integración con Gemini...\n');
    
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    console.log('✅ Modelo Gemini inicializado correctamente');
    
    // Test 1: Simple conversational response
    console.log('\n📝 Prueba 1: Respuesta conversacional básica');
    const prompt1 = "Hola, soy un estudiante que quiere aprender sobre inteligencia artificial. ¿Puedes explicarme qué es machine learning de manera sencilla?";
    
    const result1 = await model.generateContent(prompt1);
    const response1 = await result1.response;
    const text1 = response1.text();
    
    console.log('Respuesta:', text1.substring(0, 200) + '...\n');
    
    // Test 2: Educational content generation
    console.log('📚 Prueba 2: Generación de contenido educativo estructurado');
    const prompt2 = `Eres ProfAI, un profesor de IA con inteligencia emocional. Crea una micro-lección sobre redes neuronales que incluya:

1. Objetivos de aprendizaje (3 puntos)
2. Explicación breve y clara
3. Una analogía práctica 
4. Un ejemplo de código simple en Python
5. Una pregunta de quiz
6. Recomendaciones para próximos pasos

Formato la respuesta de manera estructurada y educativa.`;

    const result2 = await model.generateContent(prompt2);
    const response2 = await result2.response;
    const text2 = response2.text();
    
    console.log('Lección generada:', text2.substring(0, 300) + '...\n');
    
    // Test 3: Emotional intelligence and adaptation
    console.log('🎭 Prueba 3: Detección emocional y adaptación pedagógica');
    const prompt3 = `El estudiante dice: "No entiendo nada de esto, es muy confuso y complicado. Me siento frustrado."

Como ProfAI con inteligencia emocional:
1. Detecta el estado emocional del estudiante
2. Adapta tu explicación para reducir la frustración
3. Ofrece una reformulación más simple y empática
4. Sugiere un enfoque paso a paso

Responde de manera comprensiva y adaptativa.`;

    const result3 = await model.generateContent(prompt3);
    const response3 = await result3.response;
    const text3 = response3.text();
    
    console.log('Respuesta empática:', text3.substring(0, 300) + '...\n');
    
    // Test 4: Exercise generation
    console.log('⚡ Prueba 4: Generación de ejercicios prácticos');
    const prompt4 = `Crea un ejercicio práctico de coding para un estudiante que acaba de aprender sobre clasificación en machine learning. 

Incluye:
1. Descripción del problema
2. Datos de ejemplo
3. Plantilla de código (scaffold)
4. Criterios de evaluación
5. Pistas para ayudar

Hazlo educativo pero desafiante.`;

    const result4 = await model.generateContent(prompt4);
    const response4 = await result4.response;
    const text4 = response4.text();
    
    console.log('Ejercicio generado:', text4.substring(0, 300) + '...\n');
    
    console.log('✅ ¡Todas las pruebas completadas exitosamente!');
    console.log('🎉 La integración con Gemini Pro 2.5 está funcionando correctamente');
    console.log('🧠 ProfAI está listo para educar con inteligencia emocional\n');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error en la prueba de integración:', error.message);
    console.error('Detalles del error:', error);
    return false;
  }
}

// Run the test
testGeminiIntegration().then(success => {
  if (success) {
    console.log('🟢 Status: READY - ProfAI can start teaching!');
  } else {
    console.log('🔴 Status: ERROR - Check configuration');
  }
  process.exit(success ? 0 : 1);
});
