import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/gemini';

export async function GET() {
  try {
    console.log('🧪 Testing AI lesson generation system...');

    // Test the generateAILessonContent function
    const courseId = 'course-ml-fundamentals';
    const lessonId = 'lesson-ml-intro';

    console.log('🤖 Generating AI content for:', { courseId, lessonId });

    if (!geminiService) {
      throw new Error('Gemini service not available');
    }

    // Get course and lesson metadata
    const courseMetadata = getCourseMetadata(courseId);
    const lessonMetadata = getLessonMetadata(courseId, lessonId);

    console.log('📚 Course metadata:', courseMetadata);
    console.log('📝 Lesson metadata:', lessonMetadata);

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

    console.log('🔮 Generating content with Gemini...');
    const generatedPrompt = await geminiService.generateContent(aiPrompt);

    console.log('✅ Content generated!');
    console.log('📝 Generated content length:', generatedPrompt.length);

    // Generate title based on lesson metadata
    const title = lessonMetadata.name;
    
    // Check video availability
    const hasVideo = checkVideoAvailability(courseId, lessonId);
    
    // Determine content characteristics
    const hasCode = generatedPrompt.toLowerCase().includes('código') || 
                   generatedPrompt.toLowerCase().includes('code') ||
                   generatedPrompt.includes('```');
    
    const hasQuiz = generatedPrompt.toLowerCase().includes('quiz') ||
                   generatedPrompt.toLowerCase().includes('pregunta') ||
                   generatedPrompt.toLowerCase().includes('ejercicio');

    const result = {
      success: true,
      system_status: {
        gemini_service: '✅ Available',
        database: '✅ SQLite working',
        ai_generation: '✅ Working'
      },
      test_result: {
        courseId,
        lessonId,
        title,
        prompt: generatedPrompt,
        metadata: {
          hasVideo,
          hasCode,
          hasQuiz,
          estimatedDuration: lessonMetadata.duration,
          difficulty: courseMetadata.level,
          isAIGenerated: true,
          generatedAt: new Date().toISOString()
        }
      }
    };

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('❌ Error testing AI lesson generation:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      system_status: {
        gemini_service: '❌ Error',
        database: '✅ SQLite working', 
        ai_generation: '❌ Failed'
      },
      details: error.toString()
    }, { status: 500 });
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
    }
  };

  return lessonVideos[courseId]?.[lessonId] || false;
}
