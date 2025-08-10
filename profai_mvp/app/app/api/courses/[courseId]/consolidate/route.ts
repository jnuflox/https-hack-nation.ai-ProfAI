import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { readFileSync } from 'fs';
import { join } from 'path';

export const dynamic = "force-dynamic";

interface ConsolidatedCourseData {
  courseId: string;
  courseName: string;
  courseDescription: string;
  lessons: Array<{
    id: string;
    title: string;
    content: string;
    metadata: any;
  }>;
  videoUrl: string;
  consolidatedPrompt: string;
  totalDuration: number;
  completionLevel: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { courseId } = params;
    
    console.log('📚 Consolidating course content for:', { courseId });

    // Course information mapping
    const courseInfo = getCourseInfo(courseId);
    
    // Get all lessons for this course
    const lessons = await getAllLessonsContent(courseId);
    
    // Generate consolidated prompt
    const consolidatedPrompt = generateConsolidatedPrompt(courseId, courseInfo, lessons);
    
    // Calculate total duration
    const totalDuration = lessons.reduce((acc, lesson) => acc + (lesson.metadata?.estimatedDuration || 10), 0);
    
    // Get educational video for the course
    const videoUrl = getEducationalVideo(courseId);

    const consolidatedData: ConsolidatedCourseData = {
      courseId,
      courseName: courseInfo.name,
      courseDescription: courseInfo.description,
      lessons,
      videoUrl,
      consolidatedPrompt,
      totalDuration,
      completionLevel: 'complete'
    };

    return NextResponse.json({
      success: true,
      data: consolidatedData,
      metadata: {
        consolidatedAt: new Date().toISOString(),
        lessonsCount: lessons.length,
        totalDuration: `${totalDuration} minutos`
      }
    });

  } catch (error) {
    console.error('Error consolidating course:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Get course basic information
function getCourseInfo(courseId: string) {
  const courseMap: { [key: string]: any } = {
    'course-ml-fundamentals': {
      name: 'Machine Learning Fundamentals',
      description: 'Aprende los conceptos básicos de Machine Learning con ejemplos prácticos y teoría aplicada',
      category: 'theory',
      difficulty: 2
    },
    'course-prompt-engineering': {
      name: 'Prompt Engineering Avanzado',
      description: 'Domina el arte de crear prompts efectivos para maximizar el potencial de las IAs generativas',
      category: 'tooling',
      difficulty: 3
    },
    'course-deep-learning': {
      name: 'Deep Learning con PyTorch',
      description: 'Construye redes neuronales profundas y entiende los algoritmos que potencian la IA moderna',
      category: 'hybrid',
      difficulty: 4
    }
  };

  return courseMap[courseId] || {
    name: 'Curso de IA',
    description: 'Curso especializado en Inteligencia Artificial',
    category: 'hybrid',
    difficulty: 3
  };
}

// Get all lessons content for a course
async function getAllLessonsContent(courseId: string) {
  const lessons = [];
  const promptsDir = join(process.cwd(), 'prompts', 'lessons', courseId);
  
  try {
    // Define lesson order based on course
    const lessonOrder = getLessonOrder(courseId);
    
    for (const lessonId of lessonOrder) {
      try {
        const promptFilePath = join(promptsDir, `${lessonId}.md`);
        const content = readFileSync(promptFilePath, 'utf8');
        
        // Extract lesson title from content
        const titleMatch = content.match(/^# Lección: (.+)$/m);
        const title = titleMatch ? titleMatch[1] : lessonId;
        
        // Extract metadata
        const durationMatch = content.match(/(\d+)\s*minutos?/i);
        const duration = durationMatch ? parseInt(durationMatch[1]) : 10;
        
        lessons.push({
          id: lessonId,
          title,
          content,
          metadata: {
            estimatedDuration: duration,
            hasVideo: content.includes('🎥') || content.includes('video'),
            hasCode: content.includes('```'),
            hasQuiz: content.includes('quiz')
          }
        });
      } catch (lessonError) {
        console.log(`⚠️ Lesson ${lessonId} not found, skipping`);
      }
    }
    
    return lessons;
  } catch (error) {
    console.error('Error reading lessons:', error);
    return [];
  }
}

// Define lesson order for each course
function getLessonOrder(courseId: string): string[] {
  const orderMap: { [key: string]: string[] } = {
    'course-ml-fundamentals': [
      'lesson-ml-intro',
      'lesson-ml-types', 
      'lesson-ml-algorithms',
      'lesson-ml-evaluation'
    ],
    'course-prompt-engineering': [
      'lesson-prompt-intro',
      'lesson-prompt-advanced'
    ],
    'course-deep-learning': [
      'lesson-dl-intro'
    ]
  };
  
  return orderMap[courseId] || [];
}

// Generate consolidated prompt for complete course
function generateConsolidatedPrompt(courseId: string, courseInfo: any, lessons: any[]): string {
  const lessonSummaries = lessons.map((lesson, index) => {
    const number = index + 1;
    return `**Lección ${number}: ${lesson.title}**
- Duración: ${lesson.metadata?.estimatedDuration || 10} minutos
- Contenido clave: ${extractKeyPoints(lesson.content)}
`;
  }).join('\n');

  return `# 🎓 Curso Completo: ${courseInfo.name}

## 🎯 Contexto de Completación del Curso

¡Felicitaciones! El estudiante ha completado exitosamente el curso "${courseInfo.name}". Esta es una sesión especial de consolidación donde revisaremos todo el aprendizaje y proporcionaremos recursos adicionales.

## 📚 Resumen Completo del Curso

**Descripción**: ${courseInfo.description}

**Lecciones Completadas:**
${lessonSummaries}

**Duración Total**: ${lessons.reduce((acc, l) => acc + (l.metadata?.estimatedDuration || 10), 0)} minutos

## 🎬 Video Educativo Incluido

Se ha proporcionado un video educativo especializado que complementa todo el contenido del curso. Este video está diseñado para reforzar los conceptos clave aprendidos.

## 🎯 Prompt Específico para ProfAI

Eres ProfAI, el tutor especializado en IA. El estudiante acaba de COMPLETAR todo el curso "${courseInfo.name}". Esta es una sesión especial de consolidación y celebración.

**Tu rol específico para esta sesión de completación:**

### 1. 🎉 **Celebración del Logro**
- Felicita calurosamente por completar el curso completo
- Reconoce el esfuerzo y dedicación mostrados
- Destaca los conceptos más importantes dominados

### 2. 📋 **Repaso Estratégico**
- Haz un repaso de los conceptos clave de todo el curso
- Conecta todas las lecciones en una narrativa coherente
- Identifica las habilidades específicas que ha desarrollado

### 3. 🎬 **Integración con Video Educativo**
- Referencias específicas al video educativo proporcionado
- Usa el video como apoyo visual para conceptos complejos
- Conecta el contenido del video con las lecciones completadas

### 4. 🚀 **Próximos Pasos y Aplicaciones**
- Sugiere proyectos prácticos usando lo aprendido
- Recomienda cursos avanzados relacionados
- Propón aplicaciones reales de los conocimientos

### 5. 💡 **Sesión Interactiva**
- Pregunta sobre qué concepto fue más interesante
- Ofrece aclarar cualquier duda pendiente
- Propón ejercicios de consolidación

**Formato de inicio sugerido:**
"🎉 ¡Increíble! Has completado todo el curso de ${courseInfo.name}. Esto es un logro significativo que merece ser celebrado.

Ahora tienes una comprensión sólida de [conceptos clave]. El video educativo que acompaña esta sesión te ayudará a visualizar estos conceptos en acción.

¿Qué te pareció más fascinante del curso? ¿Hay algún concepto que te gustaría explorar más profundamente?"

**Recuerda:**
- Esta es una sesión de CONSOLIDACIÓN, no de enseñanza básica
- El estudiante ya domina los fundamentos
- Enfócate en aplicaciones avanzadas y conexiones
- Mantén un tono celebratorio y motivacional
- Usa el video como recurso principal de apoyo

## 🎯 Objetivos de Esta Sesión
1. Consolidar todos los aprendizajes del curso
2. Crear conexiones entre todos los conceptos
3. Inspirar para continuar el aprendizaje
4. Proporcionar recursos para la práctica continua`;
}

// Extract key points from lesson content (simplified)
function extractKeyPoints(content: string): string {
  // Extract first few bullet points or key concepts
  const lines = content.split('\n');
  const keyPoints = [];
  
  for (const line of lines) {
    if (line.includes('###') || line.includes('**') && keyPoints.length < 3) {
      const clean = line.replace(/[#*]/g, '').trim();
      if (clean && clean.length > 10 && clean.length < 100) {
        keyPoints.push(clean);
      }
    }
  }
  
  return keyPoints.slice(0, 3).join(', ') || 'Conceptos fundamentales cubiertos';
}

// Get educational video URL for course
function getEducationalVideo(courseId: string): string {
  const videoMap: { [key: string]: string } = {
    'course-ml-fundamentals': 'https://www.youtube.com/watch?v=ukzFI9rgwfU', // ML Fundamentals Complete Course
    'course-prompt-engineering': 'https://www.youtube.com/watch?v=_VjQlb6iTI', // Prompt Engineering Master Class
    'course-deep-learning': 'https://www.youtube.com/watch?v=aircAruvnKk' // Deep Learning Explained
  };
  
  return videoMap[courseId] || 'https://www.youtube.com/watch?v=ukzFI9rgwfU';
}
