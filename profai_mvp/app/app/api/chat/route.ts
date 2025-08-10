/**
 * Chat API Route for ProfAI
 * Handles conversational interactions with the AI tutor system using Gemini Pro 2.5
 * 
 * DEVELOPMENT MODE:
 * - Authentication validation is disabled for easier testing
 * - Using mock user session to bypass auth requirements
 * - To enable authentication: uncomment getServerSession imports and validation
 */

import { NextRequest, NextResponse } from 'next/server';
// DESARROLLO: Comentado para facilitar pruebas
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
import { geminiService } from '@/lib/gemini';
// Add Enhanced Gemini Service import
import { enhancedGeminiService, MessageSender, type Message as EnhancedMessage, type ChatResponse } from '@/lib/enhanced-gemini';
import { prisma } from '@/lib/db';
import { isDemoUser } from '@/lib/mock-data';

export const dynamic = "force-dynamic";

interface ChatRequest {
  message: string;
  conversationId?: string;
  context?: any;
  action?: 'chat' | 'help' | 'exercise_evaluation' | 'enhanced_chat';
  emotionalState?: {
    primary_emotion: string;
    confidence: number;
    detected_confusion?: boolean;
  };
}

export async function POST(request: NextRequest) {
  try {
    // DESARROLLO: Usuario mock para pruebas (sin validación de autenticación)
    const session = {
      user: {
        id: 'demo_user_dev',
        email: 'dev@profai.com',
        name: 'Usuario Desarrollo'
      }
    };

    const body: ChatRequest = await request.json();
    const { message, context, action = 'chat', conversationId, emotionalState } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log('💬 Chat request for user:', session.user.id, 'action:', action);

    // CAMBIO: Usar Enhanced Gemini para todos los usuarios, incluyendo demo users
    // Eliminar el bypass de usuario demo para usar siempre la IA real
    
    // Si es usuario demo, usar Enhanced Gemini directamente sin base de datos
    if (isDemoUser(session.user.id)) {
      try {
        // Usar Enhanced Gemini directamente para usuarios demo
        const messageHistory: EnhancedMessage[] = (context?.previousMessages || []).map((msg: any, index: number) => ({
          id: msg.id || `msg_${index}`,
          text: msg.content,
          sender: msg.role === 'user' ? MessageSender.USER : MessageSender.AI,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
          metadata: msg.metadata || {}
        }));

        const chatResponse: ChatResponse = await enhancedGeminiService.analyzeAndRespond(
          messageHistory,
          message,
          {
            currentTopic: context?.currentTopic,
            userProfile: {
              name: session.user.name || 'estudiante',
              learningLevel: 'intermediate'
            },
            emotionalState: emotionalState?.primary_emotion,
            userName: context?.userName || session.user.name
          }
        );

        return NextResponse.json({
          success: true,
          conversationId: conversationId || 'demo-conversation-' + Date.now(),
          data: {
            type: 'enhanced_chat',
            message: chatResponse.text,
            text: chatResponse.text,
            content: chatResponse.text, // Agregar también content para compatibilidad
            video: chatResponse.video,
            suggestions: chatResponse.suggestions,
            audio: chatResponse.audio,
            metadata: {
              ...chatResponse.metadata,
              enhancedFeatures: true,
              emotionalAdaptation: true,
              videoSupport: !!chatResponse.video,
              audioSupport: !!chatResponse.audio?.enabled,
              isDemoMode: true
            }
          },
          metadata: {
            userId: session.user.id,
            action,
            isDemoMode: true,
            enhancedAI: true,
            timestamp: new Date().toISOString()
          }
        });

      } catch (error) {
        console.error('❌ Enhanced Gemini error for demo user:', error);
        
        // Fallback a respuesta mock solo si Enhanced Gemini falla
        const mockResponse = generateMockChatResponse(message, action, emotionalState);
        
        return NextResponse.json({
          success: true,
          conversationId: conversationId || 'mock-conversation-' + Date.now(),
          data: mockResponse,
          metadata: {
            userId: session.user.id,
            action,
            isDemoMode: true,
            fallback: true,
            timestamp: new Date().toISOString()
          }
        });
      }
    }

    // Get user profile from database with timeout
    let user;
    try {
      user = await Promise.race([
        prisma.user.findUnique({
          where: { id: session.user.id }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 10000)
        )
      ]);
    } catch (dbError) {
      console.error('🗄️ Database error getting user, using fallback');
      // Use fallback mock response for database issues
      const mockResponse = generateMockChatResponse(message, action, emotionalState);
      
      return NextResponse.json({
        success: true,
        conversationId: conversationId || 'fallback-conversation-' + Date.now(),
        data: mockResponse,
        metadata: {
          userId: session.user.id,
          action,
          isDemoMode: true,
          timestamp: new Date().toISOString(),
          warning: 'Modo de demostración - base de datos no disponible'
        }
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create or get conversation
    let conversation = null;
    if (conversationId) {
      conversation = await prisma.conversation.findFirst({
        where: { 
          id: conversationId,
          userId: session.user.id 
        }
      });
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: session.user.id,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
          context: {
            emotional_state: emotionalState?.primary_emotion || 'neutral',
            adaptation_count: 0,
            topic: context?.currentTopic
          }
        }
      });
    }

    // Save user message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        content: message,
        role: 'user',
        emotionalState: emotionalState
      }
    });

    let response;

    switch (action) {
      case 'enhanced_chat':
        response = await handleEnhancedChatInteraction(user, message, context, emotionalState);
        break;
      case 'chat':
        response = await handleChatInteraction(user, message, context, emotionalState);
        break;
      case 'help':
        response = await handleHelpRequest(user, message, context, emotionalState);
        break;
      case 'exercise_evaluation':
        response = await handleExerciseEvaluation(user, message, context, emotionalState);
        break;
      default:
        // Default to enhanced chat for better experience
        response = await handleEnhancedChatInteraction(user, message, context, emotionalState);
    }

    // ...rest of existing code...

// New Enhanced Chat Handler using Enhanced Gemini Service
async function handleEnhancedChatInteraction(
  user: any, 
  message: string, 
  context: any, 
  emotionalState: any
): Promise<any> {
  try {
    // Convert previous messages to Enhanced Gemini format
    const messageHistory: EnhancedMessage[] = (context?.previousMessages || []).map((msg: any, index: number) => ({
      id: msg.id || `msg_${index}`,
      text: msg.content,
      sender: msg.role === 'user' ? MessageSender.USER : MessageSender.AI,
      timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
      metadata: msg.metadata || {}
    }));

    // Prepare lesson context if available
    let enhancedContext: {
      currentTopic?: string;
      userProfile?: any;
      emotionalState?: string;
      userName?: string;
      lessonPrompt?: string;
      lessonId?: string;
      courseId?: string;
      isLessonMode?: boolean;
    } = {
      currentTopic: context?.currentTopic,
      userProfile: {
        name: user?.firstName || 'estudiante',
        learningLevel: 'intermediate' // Could be derived from user data
      },
      emotionalState: emotionalState?.primary_emotion,
      userName: context?.userName
    };

    // Add lesson-specific context if available
    if (context?.lessonPrompt) {
      enhancedContext = {
        ...enhancedContext,
        lessonPrompt: context.lessonPrompt,
        lessonId: context.lessonId,
        courseId: context.courseId,
        isLessonMode: context.isLessonMode || true
      };
    }

    // Call Enhanced Gemini Service
    const chatResponse: ChatResponse = await enhancedGeminiService.analyzeAndRespond(
      messageHistory,
      message,
      enhancedContext
    );      // Format response for the frontend
      return {
        type: 'enhanced_chat',
        message: chatResponse.text,
        text: chatResponse.text, // For compatibility
        video: chatResponse.video,
        suggestions: chatResponse.suggestions,
        audio: chatResponse.audio, // Add audio support
        metadata: {
          ...chatResponse.metadata,
          enhancedFeatures: true,
          emotionalAdaptation: true,
          videoSupport: !!chatResponse.video,
          audioSupport: !!chatResponse.audio?.enabled
        },
        currentTopic: context?.currentTopic,
        emotionalFeedback: {
          detectedEmotion: chatResponse.metadata?.emotion,
          confidence: chatResponse.metadata?.confidence,
          adaptedResponse: true
        }
      };

  } catch (error) {
    console.error('❌ Enhanced chat error:', error);
    
    // Fallback to regular Gemini service
    try {
      const fallbackResponse = await geminiService.generateChatResponse(message, context);
      return {
        type: 'chat_fallback',
        message: fallbackResponse.message,
        text: fallbackResponse.message,
        followUpQuestions: fallbackResponse.followUpQuestions,
        relatedTopics: fallbackResponse.relatedTopics,
        metadata: {
          fallbackMode: true,
          error: 'Enhanced service unavailable'
        }
      };
    } catch (fallbackError) {
      console.error('❌ Fallback chat also failed:', fallbackError);
      
      // Final fallback - static response
      return {
        type: 'static_fallback',
        message: `Entiendo tu pregunta sobre "${message}". Aunque estoy teniendo problemas técnicos, puedo ayudarte con conceptos de IA. ¿Podrías ser más específico sobre qué tema te interesa?`,
        text: `Entiendo tu pregunta sobre "${message}". Aunque estoy teniendo problemas técnicos, puedo ayudarte con conceptos de IA. ¿Podrías ser más específico sobre qué tema te interesa?`,
        suggestions: [
          '¿Qué es machine learning?',
          'Explica las redes neuronales',
          'Dame ejemplos de IA',
          'Ayuda con Python'
        ],
        metadata: {
          staticFallback: true,
          error: 'All AI services unavailable'
        }
      };
    }
  }
}

// Mock chat response generator for demo mode
function generateMockChatResponse(message: string, action: string, emotionalState?: any) {
  const lowerMessage = message.toLowerCase();
  
  // Define mock responses based on common topics
  if (lowerMessage.includes('machine learning') || lowerMessage.includes('ml')) {
    return {
      type: 'learning_session',
      lesson: {
        title: 'Introducción a Machine Learning',
        content: `¡Excelente pregunta sobre Machine Learning! 

Machine Learning es una rama de la inteligencia artificial que permite a las computadoras aprender y tomar decisiones basándose en datos, sin ser explícitamente programadas para cada tarea específica.

**Key concepts:**
- **Supervised algorithms**: Learn from examples with known answers
- **Unsupervised algorithms**: Find patterns in unlabeled data
- **Reinforcement learning**: Learn through trial and error

**Practical example:**
Imagine you want to teach a computer to recognize cats in photos. You show it thousands of images labeled as "cat" or "not cat", and the algorithm learns to identify the characteristics that define a cat.

Would you like me to dive deeper into some specific type of algorithm or would you prefer to see an example with code?`,
        objectives: ['Understand what Machine Learning is', 'Identify the main types', 'Visualize practical applications'],
        nextSteps: ['Explore specific algorithms', 'Practice with real datasets', 'Implement your first model']
      },
      recommendations: ['Start with linear regression', 'Practice with small datasets', 'Use libraries like scikit-learn'],
      isDemoMode: true
    };
  }

  if (lowerMessage.includes('neural') || lowerMessage.includes('neural networks')) {
    return {
      type: 'learning_session',
      lesson: {
        title: 'Neural Networks Explained',
        content: `Neural networks are computational systems inspired by the functioning of the human brain.

**Basic structure:**
- **Artificial neurons**: Simple processing units
- **Layers**: Groups of connected neurons
- **Weights and biases**: Parameters that adjust during learning
- **Activation function**: Determines when a neuron is "activated"

**How do they learn?**
1. Receive input data
2. Process information through layers
3. Compare result with correct answer
4. Adjust weights to improve accuracy

**Popular applications:**
- Image recognition
- Natural language processing
- Recommendation systems

Would you like me to show you a simple code example of a neural network?`,
        objectives: ['Understand the structure of neural networks', 'Know the learning process', 'Identify applications'],
        nextSteps: ['Implement a simple network', 'Experiment with different architectures', 'Learn about deep learning']
      },
      recommendations: ['Start with perceptrons', 'Use TensorFlow or PyTorch', 'Practice with datasets like MNIST'],
      isDemoMode: true
    };
  }

  if (lowerMessage.includes('prompt') || lowerMessage.includes('prompting')) {
    return {
      type: 'learning_session',
      lesson: {
        title: 'Prompt Engineering Fundamentals',
        content: `Prompt Engineering is the art of designing effective instructions for generative AI models.

**Fundamental principles:**
- **Clarity**: Be specific and direct
- **Context**: Provide relevant information
- **Structure**: Organize your prompt logically
- **Examples**: Use few-shot learning when helpful

**Advanced techniques:**
1. **Chain-of-Thought**: Ask it to explain its reasoning
2. **Role Playing**: Define a specific role for the AI
3. **Template-based**: Use reusable templates
4. **Iterative refinement**: Improve progressively

**Practical example:**
❌ Bad: "Write code"
✅ Good: "As a Python expert, write a function that calculates the factorial of a number. Include explanatory comments and error handling for invalid inputs."

Would you like to practice creating prompts for some specific case?`,
        objectives: ['Master prompt engineering principles', 'Apply advanced techniques', 'Optimize AI interactions'],
        nextSteps: ['Practice with different types of prompts', 'Experiment with diverse models', 'Build your template library']
      },
      recommendations: ['Experiment with different styles', 'Measure the effectiveness of your prompts', 'Keep a repository of successful prompts'],
      isDemoMode: true
    };
  }

  // Default response for general questions
  return {
    type: 'chat_response',
    content: `Hello! I'm ProfAI, your personal artificial intelligence tutor. 

I noticed you're asking about: "${message}"

As an adaptive professor, I can help you with:
📚 **Theoretical concepts** - Clear explanations of AI, ML, Deep Learning
🛠️ **Practical tools** - Code, libraries, implementations
🧠 **Prompt Engineering** - Optimization of AI interactions
🎯 **Applied projects** - Real use cases and exercises

My approach adapts to your learning style and level. I can explain from basic concepts to advanced techniques.

What area would you like to dive into? Do you prefer to start with theory, see practical examples, or do you have a specific project in mind?`,
    suggestions: [
      'What is machine learning and how to get started?',
      'Explain neural networks with examples',
      'How to create better AI prompts?',
      'I want to do an AI project, where do I start?'
    ],
    isDemoMode: true
  };
}

// Handler for general chat interactions
async function handleChatInteraction(
  user: any, 
  message: string, 
  context: any, 
  emotionalState: any
) {
  // Determine the topic and difficulty  
  const topic = extractTopicFromMessage(message) || context?.currentTopic || 'AI concepts';
  const difficulty = determineUserDifficulty(user);

  // Generate personalized lesson using Gemini
  const lesson = await geminiService.generateLesson(
    topic,
    difficulty
  );

  // Check if user wants exercises
  const includeExercises = shouldIncludeExercises(message);
  let exercise = null;
  
  if (includeExercises) {
    exercise = await geminiService.generateExercise(
      topic,
      difficulty
    );
  }

  return {
    type: 'learning_session',
    lesson,
    exercise,
    recommendations: generateRecommendations(emotionalState, lesson),
    nextSteps: generateNextSteps(lesson, exercise)
  };
}

// Handler for help requests
async function handleHelpRequest(
  user: any, 
  message: string, 
  context: any, 
  emotionalState: any
) {
  const currentContent = context?.lessonId ? await getLessonContent(context.lessonId) : null;
  
  if (currentContent) {
    // For now, provide a simple reformulated response since reformulateContent doesn't exist
    const reformulatedContent = `Entiendo tu confusión sobre el tema. Déjame explicarlo de otra manera: ${currentContent.toString()}`;
    
    return {
      type: 'help_response',
      reformulatedContent,
      supportMessage: generateSupportMessage(emotionalState?.primary_emotion || 'confused'),
      suggestions: [
        'Would you like me to break this down further?',
        'Should I provide more examples?',
        'Do you want to try a practice exercise?'
      ]
    };
  }

  // General help without specific content
  const helpResponse = await geminiService.generateContent(
    `The student is asking for help: "${message}". They seem ${emotionalState?.primary_emotion || 'neutral'}. Provide encouraging, specific help.`,
    buildSystemPrompt(emotionalState, {})
  );

  return {
    type: 'general_help',
    content: helpResponse,
    supportMessage: generateSupportMessage(emotionalState?.primary_emotion || 'confused')
  };
}

// Handler for exercise submissions
async function handleExerciseSubmission(
  user: any, 
  submission: string, 
  context: any
) {
  if (!context?.exerciseId) {
    throw new Error('Exercise ID required for submission evaluation');
  }

  const exercise = await getExerciseDetails(context.exerciseId);
  
  const evaluation = await geminiService.evaluateSubmission(
    exercise,
    {
      code: submission,
      timestamp: new Date().toISOString()
    }
  );

  // Update user progress
  await updateUserProgress(user.id, context.exerciseId, evaluation);

  return {
    type: 'exercise_evaluation',
    evaluation,
    progressUpdate: await getUserProgressUpdate(user.id),
    nextSteps: generatePostEvaluationSteps(evaluation)
  };
}

// Handler for reformulation requests
async function handleReformulationRequest(
  user: any, 
  feedback: string, 
  context: any, 
  emotionalState: any
) {
  const currentContent = context?.lessonId ? await getLessonContent(context.lessonId) : null;
  
  if (!currentContent) {
    return {
      type: 'error',
      message: 'No content available for reformulation'
    };
  }

  // Simple reformulation since the API method doesn't exist yet
  const reformulatedContent = `Entiendo tu confusión. Déjame explicarlo de otra manera: ${currentContent}`;

  return {
    type: 'reformulation',
    originalEmotion: emotionalState?.primary_emotion || 'confused',
    newExplanation: reformulatedContent,
    encouragement: generateEncouragementMessage(),
    suggestions: [
      'Is this clearer now?',
      'Would you like even more examples?',
      'Ready to try a practice exercise?'
    ]
  };
}

// Utility functions
function extractTopicFromMessage(message: string): string | null {
  const aiTopics = [
    'machine learning', 'deep learning', 'neural networks', 'transformers',
    'llm', 'gpt', 'prompt engineering', 'fine-tuning', 'embeddings',
    'rag', 'retrieval augmented generation', 'langchain', 'openai', 'hugging face'
  ];

  const lowerMessage = message.toLowerCase();
  for (const topic of aiTopics) {
    if (lowerMessage.includes(topic)) {
      return topic;
    }
  }
  
  return null;
}

function determineUserDifficulty(user: any): 'beginner' | 'intermediate' | 'advanced' {
  const skillLevel = user.skillLevel;
  if (!skillLevel) return 'beginner';
  
  const levels = [skillLevel.theory, skillLevel.tooling, skillLevel.prompting].filter(Boolean);
  const avgLevel = levels.reduce((sum: number, level: string) => {
    let score: number;
    if (level === 'beginner') {
      score = 1;
    } else if (level === 'intermediate') {
      score = 2;
    } else {
      score = 3;
    }
    return sum + score;
  }, 0) / levels.length;
  
  if (avgLevel <= 1.5) return 'beginner';
  if (avgLevel <= 2.5) return 'intermediate';
  return 'advanced';
}

function determineLearningStyle(user: any): 'theory' | 'tooling' | 'hybrid' {
  const preferences = user.preferences;
  return preferences?.preferred_format || 'hybrid';
}

function getUserBackground(user: any): string {
  const skillLevel = user.skillLevel;
  if (!skillLevel) return "General audience with mixed background";

  const levels = [];
  if (skillLevel.theory) levels.push(`Theory: ${skillLevel.theory}`);
  if (skillLevel.tooling) levels.push(`Tooling: ${skillLevel.tooling}`);
  if (skillLevel.prompting) levels.push(`Prompting: ${skillLevel.prompting}`);

  return levels.join(', ');
}

function shouldIncludeExercises(message: string): boolean {
  const practiceKeywords = ['practice', 'exercise', 'code', 'example', 'try', 'build', 'implement'];
  const lowerMessage = message.toLowerCase();
  return practiceKeywords.some(keyword => lowerMessage.includes(keyword));
}

function buildSystemPrompt(emotionalState: any, context: any) {
  const userName = context?.userName || 'student';
  const emotion = emotionalState?.primary_emotion || 'neutral';
  const isConfused = emotionalState?.detected_confusion || false;
  
  let basePrompt = `You are ProfAI, an expert professor in artificial intelligence with advanced emotional intelligence. 

Your personality is:
- Empathetic and adaptive
- Clear in explanations but academically rigorous  
- You detect emotions and adjust your teaching style
- You combine solid theory with practical examples
- You use analogies when necessary to simplify

The student is called ${userName}.`;

  // Adaptation based on emotional state
  if (isConfused || emotion === 'confusion') {
    basePrompt += `\n\n🧠 EMOTIONAL STATE DETECTED: CONFUSION
- Use simpler step-by-step explanations
- Include real-world analogies
- Ask if they need more clarification
- Break complex concepts into small parts
- Be especially patient and encouraging`;
  } else if (emotion === 'frustration') {
    basePrompt += `\n\n😤 EMOTIONAL STATE DETECTED: FRUSTRATION  
- Be extra understanding and encouraging
- Offer a different approach to the problem
- Suggest taking a break if necessary
- Simplify the explanation
- Highlight that frustration is normal in learning`;
  } else if (emotion === 'curiosity') {
    basePrompt += `\n\n🤔 EMOTIONAL STATE DETECTED: CURIOSITY
- Can go deeper into details
- Add extra interesting information
- Suggest additional resources
- Connect with related topics
- Encourage exploration`;
  }

  basePrompt += `\n\nALWAYS RESPOND IN ENGLISH in a clear, structured and educational way. Use emojis occasionally to make the conversation more friendly.`;

  return basePrompt;
}

function generateRecommendations(emotionalState: any, lesson: any): string[] {
  const recommendations = [];
  
  if (emotionalState?.primary_emotion === 'confused') {
    recommendations.push('Take your time with this concept');
    recommendations.push('Review the examples carefully');
  } else if (emotionalState?.primary_emotion === 'engaged') {
    recommendations.push('Great enthusiasm! Keep going');
    recommendations.push('Ready for more advanced topics');
  }

  return recommendations;
}

function generateNextSteps(lesson: any, exercise: any): string[] {
  const steps = [];
  
  if (lesson) {
    steps.push('Review the lesson concepts');
  }
  
  if (exercise) {
    steps.push('Try the practice exercise');
  } else {
    steps.push('Ask for a practice exercise when ready');
  }
  
  steps.push('Let me know if you need clarification');
  
  return steps;
}

function generateSupportMessage(emotion: string): string {
  const supportMessages = {
    frustrated: "I understand this can be challenging. Let's break it down step by step.",
    confused: "No worries! Let me try a different approach to explain this.",
    bored: "Ready for something more challenging? Let's kick it up a notch!",
    neutral: "You're doing great! Keep up the good work.",
    engaged: "I love your enthusiasm! Let's keep building on that momentum."
  };

  return supportMessages[emotion as keyof typeof supportMessages] || supportMessages.neutral;
}

function generateEncouragementMessage(): string {
  const messages = [
    "Learning is a journey, and every question helps you grow!",
    "Great job asking for clarification - that's how experts think!",
    "Your curiosity is exactly what makes a great AI practitioner!"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

function generatePostEvaluationSteps(evaluation: any): string[] {
  const steps = [];
  
  if (evaluation.score >= 80) {
    steps.push('Excellent work! Ready for the next challenge');
  } else if (evaluation.score >= 60) {
    steps.push('Good progress! Review feedback and try again');
  } else {
    steps.push('Review the concepts and try again');
    steps.push('Ask for help if you need clarification');
  }

  return steps;
}

// Database helper functions - temporary implementations
async function getLessonContent(lessonId: string): Promise<string> {
  return `Contenido de la lección ${lessonId}: Este es contenido de ejemplo mientras se implementa la base de datos completa.`;
}

async function getExerciseDetails(exerciseId: string) {
  // Temporary mock data while database tables are being implemented
  return {
    title: `Ejercicio ${exerciseId}`,
    description: 'Ejercicio de ejemplo mientras se implementa la base de datos',
    instructions: ['Completa el ejercicio', 'Sigue las mejores prácticas'],
    evaluationCriteria: ['Correctitud', 'Estilo de código', 'Eficiencia']
  };
}

async function updateUserProgress(userId: string, exerciseId: string, evaluation: any) {
  console.log(`Progress updated for user ${userId} on exercise ${exerciseId}`);

  // Update user stats (this table exists)
  if (evaluation.score && evaluation.score >= 70) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalLessonsCompleted: { increment: 1 },
        lastActiveAt: new Date()
      }
    });
  }
}

async function getUserProgressUpdate(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      totalLessonsCompleted: true,
      currentStreak: true,
      lastActiveAt: true
    }
  });

  return user;
}

// Handler for exercise evaluation  
async function handleExerciseEvaluation(
  user: any, 
  message: string, 
  context: any, 
  emotionalState: any
) {
  if (!context?.exerciseId) {
    // If no specific exercise, treat as general code evaluation
  const evaluation = await geminiService.generateContent(
    `Evaluate this student's work: "${message}". Provide constructive feedback.`,
    buildSystemPrompt(emotionalState, context)
  );

    return {
      type: 'code_evaluation',
      feedback: evaluation,
      score: null,
      suggestions: [
        '¿Quieres intentar otro ejercicio?',
        '¿Necesitas más explicación sobre algún concepto?',
        '¿Te gustaría ver un ejemplo mejorado?'
      ]
    };
  }

  return await handleExerciseSubmission(user, message, context);
}

    // Save assistant response
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        content: typeof response === 'string' ? response : JSON.stringify(response),
        role: 'assistant'
      }
    });

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      data: response,
      metadata: {
        userId: session.user.id,
        action,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Chat API Error:', error);
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        fallbackResponse: {
          type: 'error_fallback',
          message: 'Disculpa, estoy teniendo problemas técnicos. ¿Puedes intentar reformular tu pregunta?',
          suggestions: [
            '¿Qué es machine learning?',
            'Explícame las redes neuronales',
            'Ayúdame con prompt engineering',
            'Quiero aprender sobre IA'
          ]
        }
      },
      { status: 500 }
    );
  }
}
