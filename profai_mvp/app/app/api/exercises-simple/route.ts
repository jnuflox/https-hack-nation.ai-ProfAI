/**
 * Simplified Exercises API Route for ProfAI MVP
 * Focuses on demo functionality without database dependencies
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { geminiService } from '@/lib/gemini';
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
    const topic = searchParams.get('topic') || 'AI concepts';
    const difficulty = (searchParams.get('difficulty') as 'beginner' | 'intermediate' | 'advanced') || 'intermediate';
    const exerciseType = (searchParams.get('type') as 'coding' | 'conceptual' | 'analysis') || 'coding';

    console.log('🏋️ Generating exercise for user:', session.user.id);

    // For MVP, always return mock data with enhanced features
    const mockExercise = {
      ...mockData.exercises[0],
      id: 'exercise-' + Date.now(),
      metadata: {
        generated: true,
        timestamp: new Date().toISOString(),
        difficulty,
        exerciseType,
        isDemoMode: true,
        topic
      }
    };

    return NextResponse.json({
      success: true,
      data: mockExercise
    });

  } catch (error) {
    console.error('Exercise API error:', error);
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { exerciseId, submission, action = 'submit' } = body;

    if (action === 'submit') {
      return await handleSubmission(session.user.id, exerciseId, submission);
    } else if (action === 'generate') {
      return await handleGeneration(body);
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Exercise API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function handleSubmission(userId: string, exerciseId: string, submission: any) {
  if (!exerciseId || !submission) {
    return NextResponse.json(
      { error: 'Exercise ID and submission are required' },
      { status: 400 }
    );
  }

  console.log('🏃‍♂️ Processing submission for user:', userId);

  // Always return mock evaluation for MVP
  const mockEvaluation = generateMockEvaluation(submission);
  
  return NextResponse.json({
    success: true,
    data: {
      submissionId: 'submission-' + Date.now(),
      evaluation: mockEvaluation,
      progressUpdate: mockEvaluation.score >= 70,
      nextSteps: generateNextSteps(mockEvaluation),
      encouragement: generateEncouragement(mockEvaluation.score),
      isDemoMode: true,
      instantFeedback: generateInstantFeedback(submission)
    }
  });
}

async function handleGeneration(params: any) {
  const { topic, difficulty = 'intermediate', exerciseType = 'coding' } = params;

  if (!topic) {
    return NextResponse.json(
      { error: 'Topic is required' },
      { status: 400 }
    );
  }

  // Generate mock exercise based on parameters
  const exercise = {
    id: 'generated-' + Date.now(),
    title: `${exerciseType} Exercise: ${topic}`,
    description: `Practice ${topic} concepts with this ${difficulty} level exercise`,
    instructions: [
      `Understand the ${topic} concept`,
      `Implement your solution`,
      `Test your approach`
    ],
    starterCode: exerciseType === 'coding' ? `// Your ${topic} implementation here\n` : null,
    hints: [
      `Break down the ${topic} problem into smaller parts`,
      `Consider edge cases`,
      `Test with simple examples first`
    ],
    metadata: {
      generated: true,
      timestamp: new Date().toISOString(),
      difficulty,
      exerciseType,
      topic
    }
  };

  return NextResponse.json({
    success: true,
    data: exercise
  });
}

// PATCH endpoint for instant feedback (Practice + Feedback Loop)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, code, explanation, exerciseId } = body;

    console.log('🔄 PATCH request - Action:', action);

    switch (action) {
      case 'instant_feedback': {
        const instantFeedback = generateInstantFeedback({ code, explanation });
        return NextResponse.json({
          success: true,
          data: {
            feedback: instantFeedback,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'get_hint': {
        const hints = await getContextualHints(exerciseId, { code, explanation });
        return NextResponse.json({
          success: true,
          data: {
            hints,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'share_to_community': {
        const mockShare = {
          shareId: `share-${Date.now()}`,
          message: "Content shared to Hack-Nation community!",
          shareUrl: "https://profai.dev/demo-share",
          isDemoMode: true
        };
        
        return NextResponse.json({
          success: true,
          data: mockShare
        });
      }

      case 'create_discussion': {
        const discussion = createDiscussion({
          title: `Discussion: Exercise ${exerciseId}`,
          description: explanation || "Let's discuss this exercise!",
          tags: ['exercise', 'ai-learning']
        }, session.user.id);
        
        return NextResponse.json({
          success: true,
          data: discussion
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('PATCH endpoint error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper functions
function generateMockEvaluation(submission: any) {
  const hasCode = submission.code && submission.code.length > 10;
  const hasExplanation = submission.explanation && submission.explanation.length > 20;
  const hasAnswers = submission.answers && Object.keys(submission.answers).length > 0;
  
  let score = 60; // Base score
  
  if (hasCode) score += 20;
  if (hasExplanation) score += 15;
  if (hasAnswers) score += 5;
  
  const feedback = [];
  
  if (hasCode) {
    feedback.push("✅ Great job on the code implementation!");
  } else {
    feedback.push("💡 Try adding some code to demonstrate your understanding.");
  }
  
  if (hasExplanation) {
    feedback.push("✅ Excellent explanation of your approach.");
  } else {
    feedback.push("💡 Adding an explanation would help demonstrate your thought process.");
  }
  
  return {
    score: Math.min(score, 100),
    feedback: feedback.join(' '),
    strengths: hasCode ? ['Code implementation', 'Problem solving'] : ['Effort', 'Engagement'],
    improvements: !hasCode ? ['Code practice', 'Implementation skills'] : ['Code optimization', 'Documentation'],
    timestamp: new Date().toISOString()
  };
}

function generateInstantFeedback(submission: any) {
  const feedback = {
    suggestions: [] as string[],
    hints: [] as string[],
    codeAnalysis: null as any,
    encouragement: [] as string[]
  };
  
  if (submission.code) {
    const code = submission.code.toLowerCase();
    
    if (code.includes('function') || code.includes('def ') || code.includes('=>')) {
      feedback.suggestions.push("📝 Great use of functions! Consider adding comments to explain your logic.");
    }
    
    if (code.includes('for') || code.includes('while') || code.includes('map')) {
      feedback.suggestions.push("🔄 Good use of loops/iteration! Think about edge cases.");
    }
    
    feedback.codeAnalysis = {
      lines: code.split('\n').length,
      hasComments: code.includes('//') || code.includes('#'),
      complexity: code.split(/[;{}]/).length > 10 ? 'high' : 'medium'
    };
  }
  
  if (submission.explanation) {
    feedback.encouragement.push("💬 Your explanation shows clear thinking!");
  }
  
  feedback.hints = [
    "💡 Try breaking down complex problems into smaller steps",
    "🔍 Test your solution with different inputs",
    "📚 Don't hesitate to look up documentation when needed"
  ];
  
  return feedback;
}

async function getContextualHints(exerciseId: string, submission: any) {
  const mockHints = [
    "💡 Try breaking your problem into smaller, manageable pieces",
    "🔍 Consider edge cases - what happens with empty inputs?",
    "📝 Add comments to explain your reasoning",
    "🧪 Test your solution step by step",
    "💪 Remember: every expert was once a beginner!"
  ];

  return {
    hints: mockHints.slice(0, 3),
    contextual: true,
    source: 'demo',
    timestamp: new Date().toISOString()
  };
}

function createDiscussion(topic: any, userId: string) {
  return {
    id: `discussion-${Date.now()}`,
    topic: topic.title,
    description: topic.description,
    createdBy: userId,
    participants: [userId],
    messages: [
      {
        id: `msg-${Date.now()}`,
        userId,
        content: `Started a discussion about: ${topic.title}`,
        timestamp: new Date().toISOString(),
        type: 'system'
      }
    ],
    tags: topic.tags || [],
    status: 'active',
    votes: { up: 0, down: 0 },
    createdAt: new Date().toISOString()
  };
}

function generateNextSteps(evaluation: any): string[] {
  const steps = [];
  
  if (evaluation.score >= 90) {
    steps.push('Outstanding work! Ready for advanced challenges');
    steps.push('Consider exploring related topics in depth');
  } else if (evaluation.score >= 70) {
    steps.push('Great job! You\'ve mastered this concept');
    steps.push('Ready to move on to the next topic');
  } else if (evaluation.score >= 50) {
    steps.push('Good progress! Review the feedback and try again');
    steps.push('Focus on the areas mentioned for improvement');
  } else {
    steps.push('Take some time to review the lesson material');
    steps.push('Ask for help if you need clarification');
    steps.push('Practice makes perfect - don\'t give up!');
  }

  return steps;
}

function generateEncouragement(score: number): string {
  if (score >= 90) {
    return "Exceptional work! You're mastering these concepts brilliantly. 🌟";
  } else if (score >= 70) {
    return "Great job! You've successfully completed this exercise. Keep up the excellent work! 🎉";
  } else if (score >= 50) {
    return "You're on the right track! With a bit more practice, you'll nail this. 💪";
  } else {
    return "Learning takes time and practice. Every attempt makes you stronger. Keep going! 🚀";
  }
}
