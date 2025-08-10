/**
 * Lessons API Route for ProfAI
 * Generates educational content using Gemini Pro 2.5
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { geminiService } from '@/lib/gemini';
import { prisma } from '@/lib/db';
import { mockData, isDemoUser } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const topic = searchParams.get('topic') || 'AI fundamentals';
    const difficulty = (searchParams.get('difficulty') as 'beginner' | 'intermediate' | 'advanced') || 'intermediate';
    const learningStyle = (searchParams.get('learningStyle') as 'theory' | 'tooling' | 'hybrid') || 'hybrid';

    // Check if this is a demo user
    if (isDemoUser(session.user.id)) {
      // If courseId is provided, return lessons for that course
      if (courseId && mockData.lessons[courseId]) {
        return NextResponse.json({
          success: true,
          data: mockData.lessons[courseId]
        });
      }

      // Generate mock lesson based on topic
      const mockLesson = generateMockLesson(topic, difficulty, learningStyle);
      
      return NextResponse.json({
        success: true,
        data: mockLesson,
        demo: true
      });
    }

    // Database timeout wrapper
    const databaseTimeout = 15000; // 15 seconds

    try {
      // Get user profile with timeout
      const user = await Promise.race([
        prisma.user.findUnique({
          where: { id: session.user.id }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), databaseTimeout)
        )
      ]);

      if (!user) {
        console.log('⚠️ User not found, falling back to mock data');
        const mockLesson = generateMockLesson(topic, difficulty, learningStyle);
        return NextResponse.json({
          success: true,
          data: mockLesson,
          fallback: true
        });
      }

      // If courseId is provided, get lessons for that course
      if (courseId) {
        const lessons = await Promise.race([
          prisma.lesson.findMany({
            where: { courseId },
            orderBy: { createdAt: 'asc' }
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Database timeout')), databaseTimeout)
          )
        ]);

        return NextResponse.json({
          success: true,
          data: lessons
        });
      }

      // Generate lesson using Gemini
      const lesson = await geminiService.generateLesson(
        topic,
        difficulty,
        learningStyle
      );

      // Save lesson to database with timeout
      const savedLesson = await Promise.race([
        prisma.lesson.create({
          data: {
            courseId: 'default', 
            title: lesson.title,
            content: lesson.content,
            metadata: {
              generatedBy: 'gemini-2.0',
              topic,
              learningStyle,
              duration: 15,
              difficulty: getDifficultyNumber(difficulty),
              objectives: lesson.objectives,
              quiz: lesson.quiz,
              nextSteps: lesson.nextSteps,
              codeExample: lesson.codeExample
            }
          }
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), databaseTimeout)
        )
      ]) as { id: string; [key: string]: any };

      return NextResponse.json({
        success: true,
        data: {
          id: savedLesson.id,
          ...lesson,
          metadata: {
            generated: true,
            timestamp: new Date().toISOString(),
            difficulty,
            learningStyle
          }
        }
      });

    } catch (error) {
      console.log('⚠️ Database error, falling back to mock lesson:', error);
      
      const mockLesson = generateMockLesson(topic, difficulty, learningStyle);
      
      return NextResponse.json({
        success: true,
        data: mockLesson,
        fallback: true
      });
    }

  } catch (error) {
    console.error('Lesson generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate lesson',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      topic, 
      difficulty = 'intermediate', 
      learningStyle = 'hybrid',
      customPrompt,
      emotionalState = 'neutral'
    } = body;

    if (!topic && !customPrompt) {
      return NextResponse.json(
        { error: 'Topic or custom prompt is required' },
        { status: 400 }
      );
    }

    // Check if this is a demo user
    if (isDemoUser(session.user.id)) {
      console.log('🎭 Demo user detected, generating mock lesson');
      
      let mockLesson;
      
      if (customPrompt) {
        // Generate mock response for custom prompt
        mockLesson = generateMockCustomLesson(customPrompt, topic || 'AI Concepts', emotionalState);
      } else {
        // Generate structured mock lesson
        mockLesson = generateMockLesson(topic, difficulty, learningStyle, emotionalState);
      }

      return NextResponse.json({
        success: true,
        data: mockLesson,
        demo: true
      });
    }

    // Database timeout wrapper
    const databaseTimeout = 15000;

    try {
      // Get user profile with timeout
      const user = await Promise.race([
        prisma.user.findUnique({
          where: { id: session.user.id }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), databaseTimeout)
        )
      ]);

      if (!user) {
        console.log('⚠️ User not found, falling back to mock lesson');
        const mockLesson = customPrompt 
          ? generateMockCustomLesson(customPrompt, topic || 'AI Concepts', emotionalState)
          : generateMockLesson(topic, difficulty, learningStyle, emotionalState);
        
        return NextResponse.json({
          success: true,
          data: mockLesson,
          fallback: true
        });
      }

      let lesson;

      if (customPrompt) {
        // Handle custom prompts for specific requests
        const content = await geminiService.generateContent(
          customPrompt,
          buildSystemPrompt(emotionalState, user)
        );

        lesson = {
          title: `Custom Lesson: ${topic || 'AI Concepts'}`,
          content,
          objectives: [`Understand ${topic || 'the requested concept'}`],
          quiz: null,
          nextSteps: ['Practice the concepts', 'Ask questions if needed']
        };
      } else {
        // Generate structured lesson
        lesson = await geminiService.generateLesson(
          topic,
          difficulty,
          learningStyle
        );
      }

      // Save lesson to database with timeout
      const savedLesson = await Promise.race([
        prisma.lesson.create({
          data: {
            courseId: 'default',
            title: lesson.title,
            content: lesson.content,
            metadata: {
              generatedBy: 'gemini-2.0',
              topic,
              learningStyle,
              duration: estimateDuration(lesson.content),
              difficulty: getDifficultyNumber(difficulty),
              objectives: lesson.objectives,
              customPrompt: !!customPrompt,
              quiz: lesson.quiz,
              nextSteps: lesson.nextSteps,
              codeExample: lesson.codeExample,
              emotionalState
            }
          }
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), databaseTimeout)
        )
      ]) as { id: string; [key: string]: any };

      return NextResponse.json({
        success: true,
        data: {
          id: savedLesson.id,
          ...lesson,
          metadata: {
            generated: true,
            timestamp: new Date().toISOString(),
            difficulty,
            learningStyle,
            customPrompt: !!customPrompt
          }
        }
      });

    } catch (error) {
      console.log('⚠️ Database error, falling back to mock lesson:', error);
      
      const mockLesson = customPrompt 
        ? generateMockCustomLesson(customPrompt, topic || 'AI Concepts', emotionalState)
        : generateMockLesson(topic, difficulty, learningStyle, emotionalState);
      
      return NextResponse.json({
        success: true,
        data: mockLesson,
        fallback: true
      });
    }

  } catch (error) {
    console.error('Custom lesson generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate lesson',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper functions
function getUserBackground(user: any): string {
  const skillLevel = user.skillLevel;
  if (!skillLevel) return "General audience with mixed background";

  const levels = [];
  if (skillLevel.theory) levels.push(`Theory: ${skillLevel.theory}`);
  if (skillLevel.tooling) levels.push(`Tooling: ${skillLevel.tooling}`);
  if (skillLevel.prompting) levels.push(`Prompting: ${skillLevel.prompting}`);

  return levels.join(', ');
}

function buildSystemPrompt(emotionalState: string, user: any): string {
  let basePrompt = `You are ProfAI, a world-class AI professor similar to MIT instructors. You excel at:

1. Breaking down complex AI concepts into digestible explanations
2. Providing practical, hands-on coding examples  
3. Adapting teaching style based on student's emotional state and background
4. Creating engaging content that bridges theory and practical application

Student background: ${getUserBackground(user)}
Always be encouraging, clear, and educational in your responses.`;

  if (emotionalState === 'confused') {
    basePrompt += `\n\nStudent seems confused - Use simpler explanations, more analogies, and step-by-step breakdowns.`;
  } else if (emotionalState === 'frustrated') {
    basePrompt += `\n\nStudent seems frustrated - Be extra patient, offer encouragement, and break concepts into smaller pieces.`;
  } else if (emotionalState === 'bored') {
    basePrompt += `\n\nStudent seems bored - Add challenges, advanced concepts, and engaging real-world examples.`;
  } else if (emotionalState === 'engaged') {
    basePrompt += `\n\nStudent is engaged - Maintain momentum with exciting examples and encourage deeper exploration.`;
  }

  return basePrompt;
}

function getDifficultyNumber(difficulty: string): number {
  switch (difficulty) {
    case 'beginner': return 1;
    case 'intermediate': return 3;
    case 'advanced': return 5;
    default: return 3;
  }
}

function estimateDuration(content: string): number {
  // Rough estimation: 200 words per minute reading speed
  const wordCount = content.split(' ').length;
  const readingMinutes = Math.ceil(wordCount / 200);
  
  // Add time for examples and practice
  return Math.max(readingMinutes + 5, 10); // Minimum 10 minutes
}

// Generate mock lesson data for demo users
function generateMockLesson(topic: string, difficulty: string, learningStyle: string, emotionalState: string = 'neutral') {
  const lessonTemplates = {
    'machine learning': {
      title: '🤖 Introducción al Machine Learning',
      content: `
# Machine Learning: Tu primer paso en la IA

## ¿Qué es Machine Learning?

El Machine Learning es como enseñar a una computadora a aprender patrones y hacer predicciones sin programar explícitamente cada regla. Imagina que quieres que una computadora reconozca gatos en fotos - en lugar de escribir miles de reglas sobre qué hace que algo sea un gato, le muestras miles de fotos de gatos y no-gatos, ¡y ella aprende sola!

## Tipos principales:

### 1. 🎯 Aprendizaje Supervisado
- Tienes datos con respuestas correctas
- Como estudiar con un libro de respuestas
- Ejemplo: Predecir precios de casas

### 2. 🔍 Aprendizaje No Supervisado  
- Buscas patrones ocultos en los datos
- Como ser detective con pistas
- Ejemplo: Agrupar clientes similares

### 3. 🎮 Aprendizaje por Refuerzo
- Aprende probando y recibiendo recompensas
- Como entrenar una mascota con premios
- Ejemplo: IA que juega videojuegos

## Algoritmo básico en Python:

\`\`\`python
from sklearn.linear_model import LinearRegression
import numpy as np

# Datos de ejemplo: años de experiencia vs salario
X = np.array([[1], [2], [3], [4], [5]])  # Experiencia
y = np.array([30000, 40000, 50000, 60000, 70000])  # Salario

# Crear y entrenar el modelo
modelo = LinearRegression()
modelo.fit(X, y)

# Hacer una predicción
prediccion = modelo.predict([[6]])  # 6 años de experiencia
print(f"Salario predicho: {prediccion[0]:,.0f}")
\`\`\`

¡En solo 10 líneas de código has creado tu primer modelo de IA! 🚀
      `,
      objectives: [
        'Entender qué es Machine Learning y cómo funciona',
        'Distinguir entre los 3 tipos principales de ML',
        'Implementar tu primer modelo con Python',
        'Visualizar cómo las máquinas aprenden patrones'
      ],
      quiz: [
        {
          question: '¿Qué tipo de ML usarías para predecir el precio de una casa?',
          options: ['Supervisado', 'No supervisado', 'Por refuerzo'],
          correct: 0
        }
      ]
    },
    'neural networks': {
      title: '🧠 Redes Neuronales: El Cerebro Artificial',
      content: `
# Redes Neuronales: Simulando el Cerebro

## ¿Cómo funciona nuestro cerebro?
Tu cerebro tiene ~86 mil millones de neuronas conectadas. Cada neurona:
1. Recibe señales de otras neuronas
2. Las procesa (suma, evalúa)
3. Decide si "disparar" a otras neuronas

¡Las redes neuronales artificiales copian esta idea! 🧠✨

## Estructura básica:

### Neurona Artificial
\`\`\`
Entradas → [Pesos] → Suma → Activación → Salida
x1 * w1 + x2 * w2 + b = y
\`\`\`

### Red Neuronal Simple
\`\`\`python
import tensorflow as tf

# Crear una red simple para clasificar imágenes
modelo = tf.keras.Sequential([
    tf.keras.layers.Dense(128, activation='relu', input_shape=(784,)),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(10, activation='softmax')
])

# Compilar el modelo
modelo.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

print("¡Tu primera red neuronal está lista! 🎉")
\`\`\`

## ¿Por qué son tan poderosas?

1. **Reconocimiento de patrones complejos**: Pueden ver patrones que nosotros no notamos
2. **Aprendizaje automático**: Se mejoran solas con más datos
3. **Versatilidad**: Funcionan para imágenes, texto, voz, juegos...

## Aplicaciones fascinantes:
- 🖼️ **Reconocer tu cara** en fotos (Instagram, Facebook)
- 🎵 **Recomendar música** (Spotify, Apple Music)  
- 🗣️ **Entender tu voz** (Siri, Google Assistant)
- 🚗 **Conducir autos** (Tesla, Waymo)
- 🎨 **Crear arte** (DALL-E, Midjourney)

¡Las posibilidades son infinitas! 🚀
      `,
      objectives: [
        'Entender cómo funcionan las neuronas biológicas y artificiales',
        'Crear tu primera red neuronal con TensorFlow',
        'Identificar aplicaciones reales de redes neuronales',
        'Comprender por qué son tan poderosas'
      ]
    },
    'prompt engineering': {
      title: '🎯 Prompt Engineering: El Arte de Hablar con IA',
      content: `
# Prompt Engineering: Comunicándote con la IA

## ¿Qué es un Prompt?
Un prompt es como una **receta de cocina para la IA**. Si le das ingredientes vagos, obtienes resultados mediocres. ¡Pero con la receta correcta, obtienes un plato de chef! 👨‍🍳

## Técnicas Fundamentales:

### 1. 🎯 Sé Específico
❌ **Mal**: "Explícame marketing"
✅ **Bien**: "Explícame 3 estrategias de marketing digital para una startup de comida vegana dirigida a millennials urbanos"

### 2. 🎭 Asigna un Rol
\`\`\`
Actúa como un experto chef con 20 años de experiencia.
Necesito ayuda para crear un menú saludable...
\`\`\`

### 3. 📝 Proporciona Contexto
\`\`\`
Contexto: Soy estudiante de segundo año de ingeniería
Tarea: Explicar algoritmos de ordenamiento
Estilo: Usando analogías de la vida real
Nivel: Intermedio
\`\`\`

### 4. 🔢 Usa Ejemplos (Few-shot)
\`\`\`
Convierte estas frases a emojis:
Feliz cumpleaños → 🎉🎂🎈
Voy al gimnasio → 💪🏋️‍♂️🏃
Estudiando para examen → 📚📖💡
\`\`\`

## Prompt Avanzado - Ejemplo Real:
\`\`\`
Eres un tutor de matemáticas experimentado y paciente.

CONTEXTO: Estudiante de 16 años tiene dificultades con álgebra
OBJETIVO: Explicar ecuaciones cuadráticas de forma visual y práctica
RESTRICCIONES: 
- Usar analogías del deporte (le gusta el fútbol)
- Evitar jerga matemática compleja
- Incluir ejemplos paso a paso
- Ser motivador y positivo

Explica qué son las ecuaciones cuadráticas y cómo resolverlas.
\`\`\`

## 🚀 Consejos Pro:

1. **Itera y mejora**: Tu primer prompt rara vez es perfecto
2. **Usa delimitadores**: \`\`\`triples comillas\`\`\` o ---separadores---
3. **Pide formato específico**: tablas, listas, código, etc.
4. **Controla la temperatura**: Creativo vs. factual

¡Dominar prompts es como tener un superpoder! 🦸‍♀️
      `,
      objectives: [
        'Dominar las 4 técnicas fundamentales de prompting',
        'Crear prompts específicos y efectivos',
        'Usar contexto y ejemplos para mejores resultados',
        'Aplicar prompt engineering en casos reales'
      ]
    }
  };

  const defaultContent = {
    title: `📚 Explorando: ${topic}`,
    content: `
# ${topic}

Este es un tema fascinante en el mundo de la Inteligencia Artificial. 

## Conceptos Clave:
- Fundamentos teóricos importantes
- Aplicaciones prácticas en la industria
- Herramientas y tecnologías relevantes

## Ejemplo de Código:
\`\`\`python
# Ejemplo básico relacionado con ${topic}
import numpy as np

def ejemplo_${topic.toLowerCase().replace(/\s+/g, '_')}():
    print("Explorando ${topic}")
    # Tu código aquí
    pass
\`\`\`

## Próximos Pasos:
1. Practica con ejemplos
2. Explora casos de uso reales
3. Únete a la comunidad de desarrolladores

¡Sigue aprendiendo! 🚀
    `,
    objectives: [
      `Entender los conceptos fundamentales de ${topic}`,
      'Aplicar el conocimiento en ejercicios prácticos',
      'Identificar casos de uso en el mundo real'
    ]
  };

  const selectedTemplate = lessonTemplates[topic.toLowerCase() as keyof typeof lessonTemplates] || defaultContent;

  return {
    id: `mock-lesson-${Date.now()}`,
    ...selectedTemplate,
    difficulty: getDifficultyNumber(difficulty),
    learningStyle,
    duration: estimateDuration(selectedTemplate.content),
    metadata: {
      generated: true,
      timestamp: new Date().toISOString(),
      difficulty,
      learningStyle,
      emotionalState,
      demo: true
    }
  };
}

function generateMockCustomLesson(customPrompt: string, topic: string, emotionalState: string) {
  // Generate contextual response based on the prompt
  const responses = {
    neural: `
# Redes Neuronales Explicadas

Tu pregunta sobre redes neuronales es excelente. Déjame explicártelo de forma simple:

## ¿Cómo funciona?
Las redes neuronales son como tu cerebro, pero digital:
1. **Neuronas**: Nodos que procesan información
2. **Conexiones**: Como sinapsis, transmiten señales
3. **Pesos**: Determinan qué tan importante es cada conexión

## Ejemplo Práctico:
\`\`\`python
# Red simple para reconocer números
import tensorflow as tf

model = tf.keras.Sequential([
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(10, activation='softmax')
])
\`\`\`

¡Espero que esto aclare tus dudas! 🧠
    `,
    machine: `
# Machine Learning Simplificado

Basándome en tu consulta, aquí tienes una explicación clara:

## ¿Qué es ML?
Es enseñar a las computadoras a aprender patrones automáticamente, como:
- 📸 Reconocer fotos de gatos
- 📧 Filtrar spam en email
- 🎵 Recomendar música que te guste

## Código de Ejemplo:
\`\`\`python
from sklearn.linear_model import LinearRegression

# Predecir precios de casas
model = LinearRegression()
model.fit(datos_casas, precios)
prediccion = model.predict(casa_nueva)
\`\`\`

¡Es más fácil de lo que parece! 🤖
    `,
    default: `
# Respuesta a tu Consulta: ${topic}

Gracias por tu pregunta interesante. Aquí tienes una explicación detallada:

## Concepto Principal
${topic} es un tema fundamental en IA que se aplica en muchos contextos.

## Aplicaciones Prácticas:
- Desarrollo de software inteligente
- Automatización de procesos
- Análisis de datos avanzado

## Ejemplo de Implementación:
\`\`\`python
# Implementación básica
def resolver_problema():
    # Tu lógica aquí
    return "Solución implementada"
\`\`\`

¡Sigue preguntando si necesitas más claridad! 💡
    `
  };

  let key = 'default';
  const promptLower = customPrompt.toLowerCase();
  
  if (promptLower.includes('neural')) {
    key = 'neural';
  } else if (promptLower.includes('machine') || promptLower.includes('ml')) {
    key = 'machine';
  }

  return {
    id: `mock-custom-lesson-${Date.now()}`,
    title: `Respuesta Personalizada: ${topic}`,
    content: responses[key as keyof typeof responses],
    objectives: [
      'Responder a tu consulta específica',
      'Proporcionar ejemplos prácticos',
      'Aclarar conceptos complejos'
    ],
    quiz: null,
    nextSteps: [
      'Practica con los ejemplos proporcionados',
      'Haz más preguntas si necesitas clarificación'
    ],
    metadata: {
      generated: true,
      timestamp: new Date().toISOString(),
      customPrompt: true,
      emotionalState,
      demo: true
    }
  };
}

// Create default course if it doesn't exist
async function ensureDefaultCourse() {
  const existingCourse = await prisma.course.findFirst({
    where: { id: 'default' }
  });

  if (!existingCourse) {
    await prisma.course.create({
      data: {
        id: 'default',
        title: 'AI Fundamentals & Practice',
        description: 'Dynamic lessons generated by ProfAI covering theory and practical applications',
        category: 'hybrid',
        difficulty: 3,
        isActive: true
      }
    });
  }
}

// Initialize default course
ensureDefaultCourse().catch(console.error);
