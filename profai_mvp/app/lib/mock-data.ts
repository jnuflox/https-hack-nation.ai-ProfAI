// Mock data helper for ProfAI demo mode
// This provides fallback data when database is unavailable

import { getImageWithFallback } from './image-fallbacks';

export const mockData = {
  // Demo users
  demoUsers: {
    'demo_john_doe': {
      id: 'demo_john_doe',
      email: 'john@doe.com',
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
      totalLessonsCompleted: 12,
      currentStreak: 5,
      lastActiveAt: new Date().toISOString()
    },
    'demo_profai': {
      id: 'demo_profai',
      email: 'demo@profai.com',
      name: 'Demo User',
      firstName: 'Demo',
      lastName: 'User',
      learningStyle: {
        visual: 0.7,
        auditory: 0.5,
        kinesthetic: 0.6
      },
      skillLevel: {
        theory: 'beginner',
        tooling: 'beginner',
        prompting: 'beginner'
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
      totalLessonsCompleted: 3,
      currentStreak: 1,
      lastActiveAt: new Date().toISOString()
    }
  },

  // Mock courses
  courses: [
    {
      id: 'course-ml-fundamentals',
      title: 'Machine Learning Fundamentals',
      description: 'Aprende los conceptos básicos de Machine Learning con ejemplos prácticos y teoría aplicada',
      category: 'theory',
      difficulty: 2,
      imageUrl: getImageWithFallback('course-ml-fundamentals', 'machine-learning'),
      progress: 45,
      totalLessons: 8,
      completedLessons: 3,
      isActive: true,
      sortOrder: 1
    },
    {
      id: 'course-prompt-engineering',
      title: 'Prompt Engineering Avanzado',
      description: 'Domina el arte de crear prompts efectivos para maximizar el potencial de las IAs generativas',
      category: 'tooling',
      difficulty: 3,
      imageUrl: getImageWithFallback('course-prompt-engineering', 'prompt-engineering'),
      progress: 20,
      totalLessons: 6,
      completedLessons: 1,
      isActive: true,
      sortOrder: 2
    },
    {
      id: 'course-deep-learning',
      title: 'Deep Learning con PyTorch',
      description: 'Construye redes neuronales profundas y entiende los algoritmos que potencian la IA moderna',
      category: 'hybrid',
      difficulty: 4,
      imageUrl: getImageWithFallback('course-deep-learning', 'deep-learning'),
      progress: 0,
      totalLessons: 12,
      completedLessons: 0,
      isActive: true,
      sortOrder: 3
    },
    {
      id: 'course-nlp-basics',
      title: 'Procesamiento de Lenguaje Natural',
      description: 'Explora cómo las máquinas entienden y generan lenguaje humano',
      category: 'theory',
      difficulty: 3,
      imageUrl: getImageWithFallback('course-nlp-basics', 'nlp'),
      progress: 75,
      totalLessons: 5,
      completedLessons: 4,
      isActive: true,
      sortOrder: 4
    },
    {
      id: 'course-ai-ethics',
      title: 'Ética en Inteligencia Artificial',
      description: 'Comprende los aspectos éticos y sociales del desarrollo de IA responsable',
      category: 'theory',
      difficulty: 2,
      imageUrl: getImageWithFallback('course-ai-ethics', 'ai-ethics'),
      progress: 100,
      totalLessons: 4,
      completedLessons: 4,
      isActive: true,
      sortOrder: 5
    }
  ],

  // Mock lessons for each course
  lessons: {
    'course-ml-fundamentals': [
      {
        id: 'lesson-ml-intro',
        title: '¿Qué es Machine Learning?',
        description: 'Introducción conceptual al aprendizaje automático con ejemplos prácticos',
        estimatedDuration: 600,
        difficultyLevel: 1,
        hasVideoContent: true,
        hasCodeExamples: false,
        hasQuiz: true,
        isCompleted: true,
        progress: 100
      },
      {
        id: 'lesson-ml-types',
        title: 'Tipos de Aprendizaje Automático',
        description: 'Supervisado, no supervisado y por refuerzo: cuándo usar cada uno',
        estimatedDuration: 900,
        difficultyLevel: 2,
        hasVideoContent: true,
        hasCodeExamples: true,
        hasQuiz: true,
        isCompleted: true,
        progress: 100
      },
      {
        id: 'lesson-ml-algorithms',
        title: 'Algoritmos Fundamentales',
        description: 'Regresión lineal, árboles de decisión y k-means explicados',
        estimatedDuration: 1200,
        difficultyLevel: 2,
        hasVideoContent: false,
        hasCodeExamples: true,
        hasQuiz: true,
        isCompleted: true,
        progress: 100
      },
      {
        id: 'lesson-ml-evaluation',
        title: 'Evaluación de Modelos',
        description: 'Métricas y técnicas para medir el rendimiento de tus modelos',
        estimatedDuration: 800,
        difficultyLevel: 3,
        hasVideoContent: true,
        hasCodeExamples: true,
        hasQuiz: true,
        isCompleted: false,
        progress: 60
      }
    ],
    'course-prompt-engineering': [
      {
        id: 'lesson-prompt-intro',
        title: 'Fundamentos de Prompt Engineering',
        description: 'Aprende los principios básicos para crear prompts efectivos',
        estimatedDuration: 600,
        difficultyLevel: 1,
        hasVideoContent: true,
        hasCodeExamples: false,
        hasQuiz: true,
        isCompleted: true,
        progress: 100
      },
      {
        id: 'lesson-prompt-advanced',
        title: 'Técnicas Avanzadas',
        description: 'Chain-of-thought, few-shot learning y más técnicas avanzadas',
        estimatedDuration: 900,
        difficultyLevel: 3,
        hasVideoContent: true,
        hasCodeExamples: true,
        hasQuiz: true,
        isCompleted: false,
        progress: 0
      }
    ]
  } as { [key: string]: any[] },

  // Mock exercises
  exercises: [
    {
      id: 'exercise-regression-basic',
      title: 'Implementa Regresión Lineal Simple',
      description: 'Crea un modelo de regresión lineal desde cero usando Python',
      instructions: [
        'Importa las librerías necesarias (numpy, matplotlib)',
        'Carga el dataset de precios de casas',
        'Implementa la función de costo',
        'Usa gradiente descendente para optimizar',
        'Visualiza los resultados'
      ],
      starterCode: `import numpy as np
import matplotlib.pyplot as plt

# TODO: Implementa aquí tu solución
def linear_regression(X, y, learning_rate=0.01, epochs=1000):
    # Tu código aquí
    pass

# Datos de ejemplo
X = np.array([1, 2, 3, 4, 5])
y = np.array([2, 4, 6, 8, 10])`,
      expectedOutput: 'Un modelo entrenado que prediga correctamente los valores de y',
      evaluationCriteria: [
        'Implementación correcta del algoritmo',
        'Uso apropiado de numpy',
        'Código limpio y bien comentado',
        'Visualización de resultados'
      ],
      hints: [
        'Recuerda normalizar los datos antes de entrenar',
        'La función de costo debería decrecer en cada época'
      ],
      difficulty: 2,
      exerciseType: 'coding'
    }
  ],

  // Mock conversations
  conversations: [
    {
      id: 'conv-demo-1',
      userId: 'demo_john_doe',
      title: 'Consulta sobre redes neuronales',
      context: {
        emotional_state: 'engaged',
        adaptation_count: 1,
        topic: 'neural networks'
      },
      isActive: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      messages: [
        {
          id: 'msg-1',
          content: '¿Puedes explicarme cómo funcionan las redes neuronales?',
          role: 'user',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'msg-2',
          content: 'Las redes neuronales son sistemas computacionales inspirados en el funcionamiento del cerebro humano...',
          role: 'assistant',
          createdAt: new Date(Date.now() - 86340000).toISOString()
        }
      ]
    }
  ],

  // Mock user progress
  userProgress: {
    'demo_john_doe': {
      totalLessonsCompleted: 12,
      currentStreak: 5,
      coursesInProgress: 3,
      avgSessionTime: 18,
      recentActivity: [
        {
          id: 'activity-1',
          type: 'lesson_completed',
          title: 'Algoritmos Fundamentales',
          courseName: 'Machine Learning Fundamentals',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          score: 85
        },
        {
          id: 'activity-2',
          type: 'exercise_submitted',
          title: 'Implementa Regresión Lineal',
          courseName: 'Machine Learning Fundamentals',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          score: 92
        }
      ]
    }
  }
};

// Helper function to check if user is demo user
export function isDemoUser(userId?: string): boolean {
  return !!(userId && (userId.startsWith('demo_') || userId.startsWith('temp_')));
}

// Helper function to get demo user data
export function getDemoUser(userId: string) {
  return (mockData.demoUsers as any)[userId] || null;
}
