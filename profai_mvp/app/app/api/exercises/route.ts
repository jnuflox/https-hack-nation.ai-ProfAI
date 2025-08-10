/**
 * Exercises API Route for ProfAI
 * Handles exercise generation and evaluation using Enhanced Gemini service
 */

import { NextRequest, NextResponse } from 'next/server';
// DESARROLLO: Imports comentados para testing sin autenticación
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
import { enhancedGeminiService } from '@/lib/enhanced-gemini';
import { mockData, isDemoUser } from '@/lib/mock-data';

export const dynamic = "force-dynamic";

interface ExerciseRequest {
  topic: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  type?: 'coding' | 'conceptual' | 'analysis' | 'practical';
  learningObjectives?: string[];
  context?: any;
}

interface ExerciseEvaluationRequest {
  exerciseId: string;
  studentAnswer: string;
  expectedAnswer?: string;
  rubric?: any;
}

export async function GET(request: NextRequest) {
  try {
    // DESARROLLO: Autenticación deshabilitada para testing
    // const session = await getServerSession(authOptions);
    const session = {
      user: { id: 'demo_user_dev', email: 'dev@profai.com', name: 'Usuario Desarrollo' }
    };
    
    // DESARROLLO: Verificación de autenticación comentada para testing
    // if (!session?.user?.id) {
    //   return NextResponse.json(
    //     { error: 'Authentication required' },
    //     { status: 401 }
    //   );
    // }

    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic') || 'Programming fundamentals';
    const difficulty = (searchParams.get('difficulty') as 'beginner' | 'intermediate' | 'advanced') || 'intermediate';
    const exerciseType = (searchParams.get('type') as 'coding' | 'conceptual' | 'analysis' | 'practical') || 'coding';
    const courseId = searchParams.get('courseId');

    console.log('🏋️ Generating exercise for user:', session.user.id, 'topic:', topic);

    // Check if this is a demo user or generate with AI
    if (isDemoUser(session.user.id)) {
      const mockExercise = generateEnhancedMockExercise(topic, difficulty, exerciseType);
      
      return NextResponse.json({
        success: true,
        data: mockExercise,
        demo: true
      });
    }

    // For authenticated users, generate with AI
    const aiExercise = await generateExerciseWithAI({
      topic,
      difficulty,
      type: exerciseType,
      context: { courseId, userId: session.user.id }
    });

    return NextResponse.json({
      success: true,
      data: aiExercise,
      generated: true
    });

  } catch (error) {
    console.error('Exercise GET API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate exercise',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // DESARROLLO: Autenticación deshabilitada para testing
    // const session = await getServerSession(authOptions);
    const session = {
      user: { id: 'demo_user_dev', email: 'dev@profai.com', name: 'Usuario Desarrollo' }
    };
    
    // DESARROLLO: Verificación de autenticación comentada para testing
    // if (!session?.user?.id) {
    //   return NextResponse.json(
    //     { error: 'Authentication required' },
    //     { status: 401 }
    //   );
    // }

    const body = await request.json();
    const action = body.action || 'generate';

    console.log('🏋️ Exercise POST request:', action, 'for user:', session.user.id);

    switch (action) {
      case 'generate':
        return await handleGenerateExercise(body, session.user.id);
      
      case 'evaluate':
        return await handleEvaluateExercise(body, session.user.id);
      
      case 'submit':
        return await handleSubmitExercise(body, session.user.id);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Exercise POST API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process exercise request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper functions

async function generateExerciseWithAI(params: ExerciseRequest): Promise<any> {
  try {
    const prompt = `
Generate a comprehensive ${params.type || 'coding'} exercise for the topic: "${params.topic}"

Requirements:
- Difficulty level: ${params.difficulty || 'intermediate'}
- Exercise type: ${params.type || 'coding'}
- Include clear instructions
- Provide starter code or framework (if coding exercise)
- Include expected learning outcomes
- Add evaluation criteria
- Make it engaging and educational

Format the response as a structured exercise with:
1. Title
2. Description
3. Instructions
4. Starter code/template (if applicable)
5. Expected outcomes
6. Evaluation criteria
7. Hints (optional)

Make it practical and hands-on.
`;

    const response = await enhancedGeminiService.analyzeAndRespond(
      [{ text: prompt, sender: 'user' as any, timestamp: new Date() }],
      'user',
      {
        currentTopic: params.topic,
        emotionalState: 'neutral'
      }
    );

    const exercise = {
      id: `ai_exercise_${Date.now()}`,
      title: `${params.topic} - ${params.type} Exercise`,
      description: response.text || 'AI-generated exercise',
      topic: params.topic,
      difficulty: params.difficulty,
      type: params.type,
      content: response.text || '',
      metadata: {
        generated: true,
        aiGenerated: true,
        timestamp: new Date().toISOString(),
        model: 'gemini-2.0-flash-exp',
        hasAudio: response.audio?.enabled || false,
        hasVideo: !!response.video,
        enhancedFeatures: true
      },
      audio: response.audio,
      video: response.video,
      suggestions: response.suggestions || []
    };

    return exercise;

  } catch (error) {
    console.error('AI exercise generation failed:', error);
    
    // Fallback to template exercise
    return generateTemplateExercise(params.topic, params.difficulty, params.type);
  }
}

async function handleGenerateExercise(body: ExerciseRequest, userId: string): Promise<NextResponse> {
  try {
    // Check if demo user
    if (isDemoUser(userId)) {
      const mockExercise = generateEnhancedMockExercise(
        body.topic, 
        body.difficulty || 'intermediate', 
        body.type || 'coding'
      );
      
      return NextResponse.json({
        success: true,
        data: mockExercise,
        demo: true
      });
    }

    const exercise = await generateExerciseWithAI(body);
    
    return NextResponse.json({
      success: true,
      data: exercise
    });

  } catch (error) {
    console.error('Generate exercise error:', error);
    return NextResponse.json(
      { error: 'Failed to generate exercise' },
      { status: 500 }
    );
  }
}

async function handleEvaluateExercise(body: ExerciseEvaluationRequest, userId: string): Promise<NextResponse> {
  try {
    const { exerciseId, studentAnswer, expectedAnswer } = body;

    if (!studentAnswer) {
      return NextResponse.json(
        { error: 'Student answer is required' },
        { status: 400 }
      );
    }

    const evaluationPrompt = `
Evaluate this student's answer to the exercise.

Exercise ID: ${exerciseId}
Student Answer: ${studentAnswer}
${expectedAnswer ? `Expected Answer: ${expectedAnswer}` : ''}

Provide:
1. Score (0-100)
2. Detailed feedback
3. Areas for improvement
4. Positive aspects
5. Next steps for learning

Be encouraging but constructive in your feedback.
`;

    const response = await enhancedGeminiService.analyzeAndRespond(
      [{ text: evaluationPrompt, sender: 'user' as any, timestamp: new Date() }],
      'user',
      {
        currentTopic: 'exercise_evaluation',
        emotionalState: 'neutral'
      }
    );

    const evaluation = {
      exerciseId,
      studentAnswer,
      feedback: response.text || 'Evaluation completed',
      timestamp: new Date().toISOString(),
      metadata: {
        evaluatedBy: 'ai',
        model: 'gemini-2.0-flash-exp',
        hasAudio: response.audio?.enabled || false,
        enhancedFeatures: true
      },
      audio: response.audio,
      suggestions: response.suggestions || []
    };

    return NextResponse.json({
      success: true,
      data: evaluation
    });

  } catch (error) {
    console.error('Exercise evaluation error:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate exercise' },
      { status: 500 }
    );
  }
}

async function handleSubmitExercise(body: any, userId: string): Promise<NextResponse> {
  try {
    // For demo users, just return success
    if (isDemoUser(userId)) {
      return NextResponse.json({
        success: true,
        data: {
          submitted: true,
          timestamp: new Date().toISOString(),
          demo: true
        }
      });
    }

    // For real users, you could save to database here
    // This is a placeholder for future implementation
    
    return NextResponse.json({
      success: true,
      data: {
        submitted: true,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Submit exercise error:', error);
    return NextResponse.json(
      { error: 'Failed to submit exercise' },
      { status: 500 }
    );
  }
}

function generateEnhancedMockExercise(topic: string, difficulty: string, type: string) {
  const baseExercise = mockData.exercises[0];
  
  return {
    ...baseExercise,
    id: `mock_exercise_${Date.now()}`,
    title: `${topic} - ${type} Exercise`,
    topic,
    difficulty,
    type,
    description: `Enhanced ${type} exercise for ${topic} at ${difficulty} level`,
    metadata: {
      topic,
      difficulty,
      type,
      isDemoMode: true,
      enhanced: true,
      timestamp: new Date().toISOString()
    },
    audio: {
      enabled: true,
      voice: 'spanish-educational',
      autoplay: false
    },
    video: {
      available: true,
      topic: topic.toLowerCase().replace(/\s+/g, '-')
    },
    suggestions: [
      `Tell me more about ${topic}`,
      'I need help with this exercise',
      'Can you explain this concept?',
      'Show me a similar example'
    ]
  };
}

function generateTemplateExercise(topic: string, difficulty?: string, type?: string) {
  return {
    id: `template_exercise_${Date.now()}`,
    title: `${topic} Exercise`,
    description: `Practice exercise for ${topic}`,
    topic,
    difficulty: difficulty || 'intermediate',
    type: type || 'coding',
    content: `This is a template exercise for ${topic}. Please implement the solution based on the requirements.`,
    instructions: [
      'Read the problem statement carefully',
      'Plan your approach',
      'Implement the solution',
      'Test your solution'
    ],
    metadata: {
      generated: true,
      template: true,
      timestamp: new Date().toISOString()
    }
  };
}