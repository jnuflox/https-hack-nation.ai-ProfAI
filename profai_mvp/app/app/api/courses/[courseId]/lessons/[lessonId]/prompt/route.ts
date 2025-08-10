import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { geminiService } from '@/lib/gemini';

export const dynamic = "force-dynamic";

interface LessonPromptRequest {
  courseId: string;
  lessonId: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, lessonId } = params;
    
    console.log('📝 Generating AI lesson content for:', { courseId, lessonId });

    // Generate lesson content with AI instead of reading static files
    const aiGeneratedContent = await generateAILessonContent(courseId, lessonId);
    
    // Check if video exists for this lesson
    const hasVideo = checkVideoAvailability(courseId, lessonId);
    
    return NextResponse.json({
      success: true,
      data: {
        courseId,
        lessonId,
        prompt: aiGeneratedContent.prompt,
        title: aiGeneratedContent.title,
        metadata: {
          hasVideo,
          hasCode: aiGeneratedContent.hasCode,
          hasQuiz: aiGeneratedContent.hasQuiz,
          estimatedDuration: aiGeneratedContent.estimatedDuration,
          difficulty: aiGeneratedContent.difficulty,
          isAIGenerated: true,
          generatedAt: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Error generating AI lesson content:', error);
    
    // Fallback to static prompt if AI generation fails
    try {
      const { courseId, lessonId } = params;
      const fallbackContent = await generateFallbackPrompt(courseId, lessonId);
      return NextResponse.json({
        success: true,
        data: {
          courseId,
          lessonId,
          prompt: fallbackContent,
          metadata: {
            isFallback: true,
            hasVideo: checkVideoAvailability(courseId, lessonId),
            generatedAt: new Date().toISOString()
          }
        },
        warning: 'Using fallback prompt - AI generation failed'
      });
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}

// Generate AI lesson content for any course and lesson
async function generateAILessonContent(courseId: string, lessonId: string) {
  try {
    console.log('🤖 Generating AI content for:', { courseId, lessonId });

    if (!geminiService) {
      throw new Error('Gemini service not available');
    }

    // Get course and lesson metadata
    const courseMetadata = getCourseMetadata(courseId);
    const lessonMetadata = getLessonMetadata(courseId, lessonId);

    // Generate AI content using Gemini
    const aiPrompt = `Eres ProfAI, un tutor experto en Inteligencia Artificial. Genera contenido educativo específico para esta lección:

**CONTEXTO DEL CURSO:**
- Curso: ${courseMetadata.name}
- Descripción: ${courseMetadata.description}
- Nivel: ${courseMetadata.level}

**CONTEXTO DE LA LECCIÓN:**
- Lección: ${lessonMetadata.name}
- Objetivo: ${lessonMetadata.objective}
- Duración estimada: ${lessonMetadata.duration} minutos

**INSTRUCCIONES:**
1. Genera un prompt educativo específico y detallado para esta lección
2. El prompt debe ser interactivo y pedagógico
3. Incluye preguntas de seguimiento
4. Mantén un tono amigable y profesional
5. Adapta el contenido al nivel especificado
6. Incluye ejemplos prácticos cuando sea apropiado

**FORMATO DE RESPUESTA:**
Genera SOLO el contenido del prompt educativo, sin metadata adicional.`;

    const generatedPrompt = await geminiService.generateContent(aiPrompt);

    // Generate title based on lesson metadata
    const title = lessonMetadata.name;

    // Determine content characteristics
    const hasCode = generatedPrompt.toLowerCase().includes('código') || 
                   generatedPrompt.toLowerCase().includes('code') ||
                   generatedPrompt.includes('```');
    
    const hasQuiz = generatedPrompt.toLowerCase().includes('quiz') ||
                   generatedPrompt.toLowerCase().includes('pregunta') ||
                   generatedPrompt.toLowerCase().includes('ejercicio');

    const result = {
      prompt: generatedPrompt,
      title: title,
      hasCode: hasCode,
      hasQuiz: hasQuiz,
      estimatedDuration: lessonMetadata.duration,
      difficulty: courseMetadata.level,
      generatedAt: new Date().toISOString()
    };

    console.log('✅ AI content generated successfully');
    return result;

  } catch (error) {
    console.error('❌ Error generating AI lesson content:', error);
    throw error;
  }
}

// Get course metadata
function getCourseMetadata(courseId: string) {
  const courseMetadata: { [key: string]: any } = {
    'course-ml-fundamentals': {
      name: 'Machine Learning Fundamentals',
      description: 'Introducción completa a los fundamentos del Machine Learning',
      level: 'beginner',
      topics: ['supervised learning', 'unsupervised learning', 'neural networks', 'evaluation']
    },
    'course-prompt-engineering': {
      name: 'Prompt Engineering Avanzado',
      description: 'Técnicas avanzadas para optimizar prompts en IA generativa',
      level: 'intermediate',
      topics: ['prompt design', 'chain of thought', 'few-shot learning', 'optimization']
    },
    'course-deep-learning': {
      name: 'Deep Learning con PyTorch',
      description: 'Deep Learning práctico usando PyTorch',
      level: 'advanced',
      topics: ['neural networks', 'CNNs', 'RNNs', 'transformers']
    },
    'course-nlp-basics': {
      name: 'Procesamiento de Lenguaje Natural',
      description: 'Fundamentos del procesamiento de texto con IA',
      level: 'intermediate',
      topics: ['tokenization', 'embeddings', 'sentiment analysis', 'transformers']
    },
    'course-ai-ethics': {
      name: 'Ética en Inteligencia Artificial',
      description: 'Principios éticos y responsables en el desarrollo de IA',
      level: 'beginner',
      topics: ['bias', 'fairness', 'privacy', 'transparency']
    }
  };

  return courseMetadata[courseId] || {
    name: 'Curso de IA',
    description: 'Curso de Inteligencia Artificial',
    level: 'intermediate',
    topics: ['artificial intelligence', 'machine learning']
  };
}

// Get lesson metadata
function getLessonMetadata(courseId: string, lessonId: string) {
  const lessonMetadata: { [key: string]: { [key: string]: any } } = {
    'course-ml-fundamentals': {
      'lesson-ml-intro': {
        name: 'Introducción al Machine Learning',
        objective: 'Comprender qué es ML y sus aplicaciones principales',
        duration: 15,
        topics: ['definition', 'applications', 'types of learning']
      },
      'lesson-ml-types': {
        name: 'Tipos de Machine Learning',
        objective: 'Distinguir entre aprendizaje supervisado, no supervisado y por refuerzo',
        duration: 20,
        topics: ['supervised', 'unsupervised', 'reinforcement learning']
      },
      'lesson-ml-algorithms': {
        name: 'Algoritmos Fundamentales',
        objective: 'Conocer los algoritmos más importantes de ML',
        duration: 25,
        topics: ['linear regression', 'decision trees', 'clustering', 'neural networks']
      },
      'lesson-ml-evaluation': {
        name: 'Evaluación de Modelos',
        objective: 'Aprender a evaluar y mejorar modelos de ML',
        duration: 20,
        topics: ['metrics', 'cross-validation', 'overfitting', 'hyperparameters']
      }
    },
    'course-prompt-engineering': {
      'lesson-prompt-intro': {
        name: 'Introducción al Prompt Engineering',
        objective: 'Fundamentos del diseño de prompts efectivos',
        duration: 18,
        topics: ['prompt basics', 'best practices', 'common mistakes']
      },
      'lesson-prompt-advanced': {
        name: 'Técnicas Avanzadas de Prompts',
        objective: 'Técnicas sofisticadas para prompts complejos',
        duration: 25,
        topics: ['chain of thought', 'few-shot learning', 'role playing']
      }
    },
    'course-deep-learning': {
      'lesson-dl-intro': {
        name: 'Introducción al Deep Learning',
        objective: 'Fundamentos de las redes neuronales profundas',
        duration: 22,
        topics: ['neural networks', 'backpropagation', 'activation functions']
      },
      'lesson-dl-backprop': {
        name: 'Backpropagation y Optimización',
        objective: 'Entender cómo las redes aprenden mediante backpropagation',
        duration: 30,
        topics: ['gradient descent', 'backpropagation', 'optimization', 'learning rate']
      },
      'lesson-dl-cnns': {
        name: 'Redes Neuronales Convolucionales',
        objective: 'Dominar las CNNs para procesamiento de imágenes',
        duration: 35,
        topics: ['convolution', 'pooling', 'image recognition', 'computer vision']
      },
      'lesson-dl-rnns': {
        name: 'Redes Neuronales Recurrentes',
        objective: 'Aplicar RNNs y LSTM para datos secuenciales',
        duration: 40,
        topics: ['sequential data', 'LSTM', 'GRU', 'time series']
      }
    },
    'course-nlp-basics': {
      'lesson-nlp-intro': {
        name: 'Introducción al Procesamiento de Lenguaje Natural',
        objective: 'Fundamentos del análisis computacional de texto',
        duration: 25,
        topics: ['NLP basics', 'text analysis', 'linguistic processing']
      },
      'lesson-nlp-tokenization': {
        name: 'Tokenización y Preprocesamiento',
        objective: 'Técnicas para preparar texto para análisis',
        duration: 20,
        topics: ['tokenization', 'stemming', 'lemmatization', 'preprocessing']
      },
      'lesson-nlp-embeddings': {
        name: 'Embeddings de Palabras',
        objective: 'Representación vectorial de palabras y conceptos',
        duration: 30,
        topics: ['word2vec', 'GloVe', 'embeddings', 'semantic similarity']
      },
      'lesson-nlp-transformers': {
        name: 'Transformers y Modelos de Atención',
        objective: 'Arquitecturas modernas para NLP',
        duration: 45,
        topics: ['attention mechanism', 'transformers', 'BERT', 'GPT']
      }
    },
    'course-ai-ethics': {
      'lesson-ethics-intro': {
        name: 'Introducción a la Ética en IA',
        objective: 'Principios fundamentales de IA responsable',
        duration: 20,
        topics: ['AI ethics', 'responsibility', 'societal impact']
      },
      'lesson-ethics-bias': {
        name: 'Sesgo y Equidad en IA',
        objective: 'Identificar y mitigar sesgos algorítmicos',
        duration: 25,
        topics: ['algorithmic bias', 'fairness', 'discrimination', 'mitigation']
      },
      'lesson-ethics-privacy': {
        name: 'Privacidad y Seguridad de Datos',
        objective: 'Protección de datos en sistemas de IA',
        duration: 22,
        topics: ['data privacy', 'security', 'GDPR', 'anonymization']
      },
      'lesson-ethics-transparency': {
        name: 'Transparencia y Explicabilidad',
        objective: 'IA interpretable y transparente',
        duration: 28,
        topics: ['explainable AI', 'interpretability', 'transparency', 'trust']
      }
    }
  };

  const courseData = lessonMetadata[courseId] || {};
  return courseData[lessonId] || {
    name: 'Lección de IA',
    objective: 'Aprender conceptos de inteligencia artificial',
    duration: 15,
    topics: ['artificial intelligence']
  };
}

// Check if video is available for lesson
function checkVideoAvailability(courseId: string, lessonId: string): boolean {
  // This maps to the same logic as the video API
  const lessonVideos: { [key: string]: { [key: string]: boolean } } = {
    'course-ml-fundamentals': {
      'lesson-ml-intro': true,
      'lesson-ml-types': true,
      'lesson-ml-algorithms': true,
      'lesson-ml-evaluation': true
    },
    'course-prompt-engineering': {
      'lesson-prompt-intro': true,
      'lesson-prompt-advanced': true
    },
    'course-deep-learning': {
      'lesson-dl-intro': true,
      'lesson-dl-backprop': true,
      'lesson-dl-cnns': true,
      'lesson-dl-rnns': true
    },
    'course-nlp-basics': {
      'lesson-nlp-intro': true,
      'lesson-nlp-tokenization': true,
      'lesson-nlp-embeddings': true,
      'lesson-nlp-transformers': true
    },
    'course-ai-ethics': {
      'lesson-ethics-intro': true,
      'lesson-ethics-bias': true,
      'lesson-ethics-privacy': true,
      'lesson-ethics-transparency': true
    }
  };

  return lessonVideos[courseId]?.[lessonId] || false;
}

// Extract metadata from prompt content
function extractPromptMetadata(promptContent: string) {
  const metadata: any = {
    hasVideo: false,
    hasCode: false,
    hasQuiz: false,
    estimatedDuration: 10,
    difficulty: 'beginner'
  };

  // Check for video references
  if (promptContent.includes('video') || promptContent.includes('Video') || promptContent.includes('🎥')) {
    metadata.hasVideo = true;
  }

  // Check for code references
  if (promptContent.includes('código') || promptContent.includes('Code') || promptContent.includes('```') || promptContent.includes('💻')) {
    metadata.hasCode = true;
  }

  // Check for quiz references
  if (promptContent.includes('quiz') || promptContent.includes('Quiz') || promptContent.includes('pregunta')) {
    metadata.hasQuiz = true;
  }

  // Extract duration from content
  const durationMatch = promptContent.match(/(\d+)\s*minutos?/i);
  if (durationMatch) {
    metadata.estimatedDuration = parseInt(durationMatch[1]);
  }

  // Extract difficulty
  if (promptContent.includes('Principiante') || promptContent.includes('beginner')) {
    metadata.difficulty = 'beginner';
  } else if (promptContent.includes('Intermedio') || promptContent.includes('intermediate')) {
    metadata.difficulty = 'intermediate';
  } else if (promptContent.includes('Avanzado') || promptContent.includes('advanced')) {
    metadata.difficulty = 'advanced';
  }

  return metadata;
}

// Generate fallback prompt when specific file is not found
function generateFallbackPrompt(courseId: string, lessonId: string): string {
  const courseNames: { [key: string]: string } = {
    'course-ml-fundamentals': 'Machine Learning Fundamentals',
    'course-prompt-engineering': 'Prompt Engineering Avanzado',
    'course-deep-learning': 'Deep Learning con PyTorch',
    'course-nlp-basics': 'Procesamiento de Lenguaje Natural',
    'course-ai-ethics': 'Ética en Inteligencia Artificial'
  };

  const courseName = courseNames[courseId] || 'Curso de IA';
  
  return `# Prompt para Lección

## Contexto de la Lección
Esta lección pertenece al curso "${courseName}". 

## Prompt Específico para ProfAI

Eres ProfAI, el tutor especializado en Inteligencia Artificial. El estudiante acaba de acceder a una lección del curso ${courseName}.

**Tu rol específico para esta lección:**
1. 🎯 **Contexto del curso**: Mantén coherencia con el tema principal del curso
2. 📚 **Personalización**: Adapta tu respuesta al nivel del estudiante
3. 💡 **Interactividad**: Haz preguntas para mantener el engagement
4. 🔗 **Conexiones**: Relaciona con otras lecciones del curso cuando sea apropiado

**Recuerda:**
- Mantén un tono amigable y profesional
- Usa ejemplos prácticos y relevantes
- Ofrece recursos adicionales cuando sea apropiado
- Adapta tu nivel de detalle según las respuestas del estudiante

Inicia la conversación preguntando qué le gustaría aprender específicamente sobre este tema.
`;
}
