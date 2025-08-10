
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando seed de ProfAI MVP...');

  // Limpiar datos existentes en orden correcto
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.learningSession.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.generatedContent.deleteMany();
  await prisma.user.deleteMany();

  // 1. Crear usuario de prueba
  const hashedPassword = await bcrypt.hash('johndoe123', 12);
  const testUser = await prisma.user.create({
    data: {
      email: 'john@doe.com',
      password: hashedPassword,
      name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      learningStyle: {
        visual: 0.8,
        auditory: 0.6,
        kinesthetic: 0.7
      },
      skillLevel: {
        theory: 'intermediate',
        tooling: 'beginner',
        prompting: 'intermediate'
      },
      emotionBaseline: {
        confusion_threshold: 0.7,
        frustration_threshold: 0.6,
        engagement_baseline: 0.5
      },
      preferences: {
        preferred_format: 'hybrid',
        language: 'es',
        pace: 'normal',
        difficulty_preference: 'adaptive'
      },
      currentStreak: 5,
      totalLessonsCompleted: 12
    }
  });

  console.log('✅ Usuario de prueba creado:', testUser.email);

  // 2. Crear cursos principales
  const courses = [
    {
      title: 'Fundamentos de Machine Learning',
      description: 'Aprende los conceptos básicos de ML desde cero con teoría sólida y práctica inmediata',
      category: 'theory',
      difficulty: 2,
      imageUrl: 'https://cdn.abacus.ai/images/19114917-eb72-4b4a-a9e4-688087c877e4.png',
      sortOrder: 1
    },
    {
      title: 'LLM Development Tooling',
      description: 'Herramientas prácticas para desarrollar con LLMs: APIs, frameworks y deployment',
      category: 'tooling', 
      difficulty: 3,
      imageUrl: 'https://cdn.abacus.ai/images/9f995499-8701-4513-aef9-d8ae08032fca.png',
      sortOrder: 2
    },
    {
      title: 'Prompt Engineering Avanzado',
      description: 'Domina el arte de crear prompts efectivos con técnicas avanzadas y optimización',
      category: 'hybrid',
      difficulty: 4,
      imageUrl: 'https://cdn.abacus.ai/images/2c446f95-6f0d-41b0-80ec-ea45087d8dad.png',
      sortOrder: 3
    },
    {
      title: 'Computer Vision Práctica',
      description: 'Implementa soluciones de visión por computadora con modelos modernos',
      category: 'hybrid',
      difficulty: 4,
      imageUrl: 'https://cdn.abacus.ai/images/00bf4b82-21db-47d9-bd93-2c9822714502.png',
      sortOrder: 4
    },
    {
      title: 'Natural Language Processing',
      description: 'Procesamiento de lenguaje natural: desde fundamentos hasta aplicaciones avanzadas',
      category: 'theory',
      difficulty: 3,
      imageUrl: 'https://cdn.abacus.ai/images/502a0eb1-51ad-40e0-8b9e-dc745b4488d7.png',
      sortOrder: 5
    }
  ];

  const createdCourses = [];
  for (const courseData of courses) {
    const course = await prisma.course.create({
      data: courseData
    });
    createdCourses.push(course);
    console.log(`✅ Curso creado: ${course.title}`);
  }

  // 3. Crear lecciones detalladas (ejemplo completo para el primer curso)
  const mlCourse = createdCourses[0];
  const mlLessons = [
    {
      title: '¿Qué es Machine Learning?',
      description: 'Introducción conceptual al aprendizaje automático con ejemplos prácticos',
      courseId: mlCourse.id,
      topicCategory: 'theory',
      difficultyLevel: 1,
      estimatedDuration: 600, // 10 minutos
      prerequisites: JSON.stringify([]),
      tags: JSON.stringify(['introducción', 'conceptos básicos', 'teoría']),
      hasVideoContent: true,
      hasCodeExamples: false,
      hasQuiz: true,
      content: {
        version: '1.0',
        specialization: 'theory',
        delivery_format: 'micro_lesson',
        sections: [
          {
            title: 'Introducción',
            theory_explanation: 'Machine Learning es una rama de la IA que permite a las máquinas aprender patrones de los datos sin ser programadas explícitamente.',
            visual_aids: ['ml_diagram_basic.svg'],
            duration: 120,
            emotion_adaptations: {
              confusion_detected: {
                action: 'insert_analogy',
                content: 'Piensa en ML como enseñar a un niño a reconocer animales mostrándole muchas fotos...'
              }
            }
          },
          {
            title: 'Tipos de ML',
            theory_explanation: 'Existen tres tipos principales: supervisado, no supervisado y por refuerzo.',
            examples: [
              'Supervisado: clasificar emails como spam',
              'No supervisado: encontrar grupos de clientes similares',
              'Refuerzo: entrenar un agente de videojuegos'
            ],
            duration: 300
          },
          {
            title: 'Aplicaciones Reales',
            theory_explanation: 'ML está en todas partes: recomendaciones de Netflix, asistentes de voz, autos autónomos.',
            duration: 180
          }
        ],
        quiz: {
          question: '¿Cuál es la principal característica del Machine Learning?',
          options: [
            'Programación explícita de reglas',
            'Aprendizaje de patrones automático', 
            'Uso de bases de datos grandes',
            'Interfaz de usuario avanzada'
          ],
          correct_answer: 1,
          explanation: 'La clave del ML es que las máquinas aprenden patrones automáticamente de los datos, sin necesidad de programar reglas explícitas.'
        }
      }
    },
    {
      title: 'Redes Neuronales Básicas',
      description: 'Comprende cómo funcionan las redes neuronales desde la neurona artificial',
      courseId: mlCourse.id,
      topicCategory: 'hybrid',
      difficultyLevel: 2,
      estimatedDuration: 900, // 15 minutos
      prerequisites: JSON.stringify([/* ID de la lección anterior */]),
      tags: JSON.stringify(['redes neuronales', 'perceptrón', 'backpropagation']),
      hasVideoContent: true,
      hasCodeExamples: true,
      hasQuiz: true,
      content: {
        version: '1.0',
        specialization: 'hybrid',
        delivery_format: 'video_tutorial',
        sections: [
          {
            title: 'La Neurona Artificial',
            theory_explanation: 'Una neurona artificial es una función matemática que toma inputs, los procesa y genera un output.',
            code_demo: {
              language: 'python',
              code: `import numpy as np

def neurona(inputs, pesos, bias):
    # Suma ponderada
    suma = np.dot(inputs, pesos) + bias
    
    # Función de activación (sigmoid)
    output = 1 / (1 + np.exp(-suma))
    return output

# Ejemplo
inputs = [1, 0, 1]
pesos = [0.5, -0.3, 0.8]
bias = 0.1

resultado = neurona(inputs, pesos, bias)
print(f"Output de la neurona: {resultado}")`,
              explanation_points: [
                'Observa cómo calculamos la suma ponderada',
                'La función sigmoid convierte cualquier número a un rango [0,1]',
                'Este es el building block de las redes neuronales'
              ]
            },
            duration: 420
          },
          {
            title: 'Construyendo una Red',
            theory_explanation: 'Una red neuronal es simplemente muchas neuronas conectadas en capas.',
            code_demo: {
              language: 'python',
              code: `from sklearn.neural_network import MLPClassifier
import numpy as np

# Crear datos de ejemplo (XOR problem)
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y = np.array([0, 1, 1, 0])

# Crear la red neuronal
red = MLPClassifier(hidden_layer_sizes=(4,), activation='relu', max_iter=1000)

# Entrenar
red.fit(X, y)

# Probar
predicciones = red.predict(X)
print("Predicciones:", predicciones)
print("Real:", y)`,
              explanation_points: [
                'El problema XOR no es linealmente separable',
                'Una capa oculta de 4 neuronas puede resolverlo',
                'Observa cómo la red aprende el patrón automáticamente'
              ]
            },
            duration: 480
          }
        ],
        practice_exercise: {
          title: 'Implementa tu primera neurona',
          starter_code: `def mi_neurona(inputs, pesos, bias):
    # TODO: Implementa la suma ponderada
    suma = ???
    
    # TODO: Aplica función de activación sigmoid
    output = ???
    
    return output`,
          hints_progressive: [
            'Usa np.dot para el producto punto',
            'Sigmoid: 1 / (1 + np.exp(-x))',
            'No olvides sumar el bias'
          ]
        },
        quiz: {
          question: '¿Qué hace la función de activación en una neurona?',
          options: [
            'Calcula la suma ponderada',
            'Introduce no-linealidad al sistema',
            'Almacena los pesos',
            'Conecta con otras neuronas'
          ],
          correct_answer: 1,
          explanation: 'La función de activación introduce no-linealidad, permitiendo que la red aprenda patrones complejos.'
        }
      }
    },
    {
      title: 'Overfitting y Regularización',
      description: 'Aprende a identificar y prevenir el sobreajuste en tus modelos',
      courseId: mlCourse.id,
      topicCategory: 'theory',
      difficultyLevel: 3,
      estimatedDuration: 720, // 12 minutos
      prerequisites: JSON.stringify([]),
      tags: JSON.stringify(['overfitting', 'regularización', 'validación']),
      hasVideoContent: true,
      hasCodeExamples: true,
      hasQuiz: true,
      content: {
        version: '1.0',
        specialization: 'theory',
        delivery_format: 'micro_lesson',
        sections: [
          {
            title: 'El Problema del Overfitting',
            theory_explanation: 'Overfitting ocurre cuando un modelo memoriza los datos de entrenamiento pero no generaliza bien a datos nuevos.',
            visual_aids: ['overfitting_graph.png'],
            analogies: [
              'Es como estudiar para un examen memorizando las respuestas exactas, pero no entender los conceptos.'
            ],
            duration: 240
          },
          {
            title: 'Técnicas de Regularización',
            theory_explanation: 'L1, L2, Dropout y Early Stopping son técnicas para prevenir overfitting.',
            examples: [
              'L1: Penaliza la suma absoluta de pesos',
              'L2: Penaliza la suma cuadrática de pesos', 
              'Dropout: Apaga neuronas aleatoriamente durante entrenamiento'
            ],
            duration: 300
          },
          {
            title: 'Validación Cruzada',
            theory_explanation: 'Divide los datos para evaluar correctamente la generalización del modelo.',
            duration: 180
          }
        ]
      }
    }
  ];

  // Crear las lecciones
  const createdLessons = [];
  for (const lessonData of mlLessons) {
    const lesson = await prisma.lesson.create({
      data: lessonData
    });
    createdLessons.push(lesson);
    console.log(`✅ Lección creada: ${lesson.title}`);
  }

  // Actualizar prerequisitos (ahora que tenemos los IDs)
  if (createdLessons.length > 1) {
    await prisma.lesson.update({
      where: { id: createdLessons[1].id },
      data: { prerequisites: JSON.stringify([createdLessons[0].id]) }
    });
  }

  // 4. Crear lecciones básicas para otros cursos
  const promptCourse = createdCourses.find(c => c.title.includes('Prompt Engineering'));
  
  if (promptCourse) {
    await prisma.lesson.create({
      data: {
        title: 'Anatomía de un Prompt Efectivo',
        description: 'Los componentes esenciales de un prompt que funciona',
        courseId: promptCourse.id,
        topicCategory: 'hybrid',
        difficultyLevel: 2,
        estimatedDuration: 480,
        prerequisites: JSON.stringify([]),
        tags: JSON.stringify(['prompts', 'estructura', 'componentes']),
        hasVideoContent: true,
        hasCodeExamples: true,
        hasQuiz: true,
        content: {
          version: '1.0',
          specialization: 'hybrid',
          sections: [
            {
              title: 'Estructura Básica',
              theory_explanation: 'Un prompt efectivo tiene: contexto, tarea específica, formato deseado y ejemplos.',
              examples: [
                'Contexto: "Eres un experto en Python..."',
                'Tarea: "Explica el concepto de decoradores..."',
                'Formato: "Responde en 3 párrafos con código..."',
                'Ejemplo: "Ejemplo: @property para getters..."'
              ]
            },
            {
              title: 'Técnicas Avanzadas',
              theory_explanation: 'Chain-of-thought, few-shot prompting y prompt chaining.',
              code_demo: {
                language: 'text',
                code: `# Ejemplo de Chain-of-Thought
Pregunta: María tiene 23 manzanas. Le da 7 a Juan y compra 15 más. ¿Cuántas tiene ahora?

Paso 1: María empieza con 23 manzanas
Paso 2: Le da 7 a Juan, le quedan: 23 - 7 = 16
Paso 3: Compra 15 más: 16 + 15 = 31
Respuesta: 31 manzanas`
              }
            }
          ]
        }
      }
    });
  }

  // 5. Crear algunas sesiones de aprendizaje de ejemplo
  await prisma.learningSession.create({
    data: {
      userId: testUser.id,
      lessonId: createdLessons[0].id,
      status: 'completed',
      completionRate: 1.0,
      formatUsed: 'video',
      emotionEvents: JSON.stringify([
        {
          timestamp: 120000,
          emotion: 'engaged',
          confidence: 0.8,
          trigger: 'quiz_completed'
        },
        {
          timestamp: 300000,
          emotion: 'slight_confusion',
          confidence: 0.6,
          trigger: 'concept_difficulty'
        }
      ]),
      adaptationCount: 1,
      chatMessages: 2,
      feedbackScore: 8,
      feedbackComment: 'Excelente explicación, las analogías ayudaron mucho',
      completedAt: new Date()
    }
  });

  // 6. Crear conversación de ejemplo
  const conversation = await prisma.conversation.create({
    data: {
      userId: testUser.id,
      title: 'Consulta sobre redes neuronales',
      context: {
        lesson_id: createdLessons[1]?.id,
        topic: 'neural_networks',
        emotional_state: 'curious'
      },
      lessonId: createdLessons[1]?.id
    }
  });

  // Mensajes de la conversación
  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation.id,
        content: 'No entiendo bien qué diferencia hay entre una neurona artificial y una real',
        role: 'user',
        emotionalState: {
          primary_emotion: 'confusion',
          confidence: 0.7,
          detected_confusion: true
        }
      },
      {
        conversationId: conversation.id,
        content: 'Excelente pregunta. Te explico la diferencia de forma clara:\n\n**Neurona Biológica:**\n- Es una célula física en el cerebro\n- Procesa señales electroquímicas\n- Se conecta con miles de otras neuronas\n- Es increíblemente compleja\n\n**Neurona Artificial:**\n- Es una función matemática simple\n- Toma números, los multiplica y suma\n- Aplica una función de activación\n- Es mucho más simple, pero en conjunto crean patrones complejos\n\n¿Te ayuda esta explicación? ¿Quieres que profundice en algún aspecto?',
        role: 'assistant',
        tokenCount: 156
      },
      {
        conversationId: conversation.id,
        content: 'Sí, ahora está más claro. ¿Podrías mostrarme un ejemplo práctico de cómo funciona matemáticamente?',
        role: 'user',
        emotionalState: {
          primary_emotion: 'curiosity',
          confidence: 0.9,
          detected_confusion: false
        }
      }
    ]
  });

  // 7. Crear evaluación de ejemplo
  await prisma.evaluation.create({
    data: {
      userId: testUser.id,
      lessonId: createdLessons[0].id,
      type: 'quiz',
      questions: {
        question_1: {
          text: '¿Cuál es la principal característica del Machine Learning?',
          options: [
            'Programación explícita de reglas',
            'Aprendizaje de patrones automático',
            'Uso de bases de datos grandes',
            'Interfaz de usuario avanzada'
          ],
          correct_answer: 1
        }
      },
      answers: {
        question_1: {
          selected: 1,
          time_taken_ms: 15000
        }
      },
      results: {
        correctness: 1.0,
        clarity: 0.9,
        efficiency: 0.8,
        next_actions: ['Continúar con redes neuronales', 'Practicar con código']
      },
      score: 1.0,
      maxScore: 1.0,
      feedback: '¡Perfecto! Has entendido correctamente el concepto fundamental del Machine Learning.',
      suggestions: {
        next_topics: ['Redes Neuronales Básicas', 'Tipos de Algoritmos ML'],
        practice_exercises: ['Implementar una neurona simple', 'Clasificador básico']
      }
    }
  });

  // 8. Crear contenido generado automáticamente de ejemplo
  await prisma.generatedContent.create({
    data: {
      title: 'Novedades: LangChain v0.2.0 - Nuevas Features',
      type: 'tool_update',
      generationTrigger: {
        type: 'tool_update',
        source: 'github_release',
        tool: 'langchain',
        version: '0.2.0',
        release_url: 'https://github.com/langchain-ai/langchain/releases/tag/v0.2.0'
      },
      content: {
        summary: 'LangChain 0.2.0 incluye mejoras significativas en performance y nuevas herramientas para agentes.',
        key_features: [
          'Nuevo LangGraph para workflows complejos',
          'Mejoras de performance del 40%',
          'Soporte para multimodal agents',
          'Nueva API de streaming'
        ],
        migration_guide: 'Actualiza dependencies y revisa breaking changes en chains.',
        code_examples: [
          {
            title: 'Nuevo LangGraph Usage',
            language: 'python',
            code: `from langgraph import StateGraph\n\ndef agent_node(state):\n    return {"messages": state["messages"] + ["Processed"]}\n\nworkflow = StateGraph({"messages": list})\nworkflow.add_node("agent", agent_node)\napp = workflow.compile()`
          }
        ]
      },
      metadata: {
        impact_level: 'high',
        learning_time_estimate: 15,
        difficulty: 'intermediate'
      },
      isPublished: true,
      publishedAt: new Date(),
      viewCount: 47,
      generationTimeMs: 23000,
      tokensUsed: 1250
    }
  });

  console.log('🎉 Seed completado exitosamente!');
  console.log(`📊 Datos creados:`);
  console.log(`   - ${createdCourses.length} cursos`);
  console.log(`   - ${createdLessons.length} lecciones`);
  console.log(`   - 1 usuario de prueba (john@doe.com)`);
  console.log(`   - 1 sesión de aprendizaje`);
  console.log(`   - 1 conversación con 3 mensajes`);
  console.log(`   - 1 evaluación completada`);
  console.log(`   - 1 contenido generado automáticamente`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
