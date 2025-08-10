/**
 * Practice + Feedback Loop API for ProfAI
 * Handles instant code feedback, hints, and interactive learning
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { geminiService } from '@/lib/gemini';
import { isDemoUser } from '@/lib/mock-data';

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
    const { action, code, language, explanation, exerciseId, difficulty } = body;

    console.log('💻 Practice feedback action:', action);

    switch (action) {
      case 'analyze_code': {
        const codeAnalysis = await analyzeCode(code, language, session.user.id);
        return NextResponse.json({
          success: true,
          data: codeAnalysis
        });
      }

      case 'get_instant_feedback': {
        const feedback = await getInstantFeedback(code, explanation, language);
        return NextResponse.json({
          success: true,
          data: feedback
        });
      }

      case 'suggest_improvements': {
        const suggestions = await suggestImprovements(code, language, difficulty);
        return NextResponse.json({
          success: true,
          data: suggestions
        });
      }

      case 'check_syntax': {
        const syntaxCheck = await checkSyntax(code, language);
        return NextResponse.json({
          success: true,
          data: syntaxCheck
        });
      }

      case 'run_code': {
        const executionResult = await runCodeSafely(code, language);
        return NextResponse.json({
          success: true,
          data: executionResult
        });
      }

      case 'get_hints': {
        const hints = await getContextualHints(exerciseId, code, difficulty);
        return NextResponse.json({
          success: true,
          data: hints
        });
      }

      case 'explain_concept': {
        const conceptExplanation = await explainConcept(body.concept, difficulty);
        return NextResponse.json({
          success: true,
          data: conceptExplanation
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Practice feedback API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process feedback request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Analyze code for patterns, complexity, and best practices
async function analyzeCode(code: string, language: string, userId: string) {
  if (isDemoUser(userId)) {
    return getMockCodeAnalysis(code, language);
  }

  try {
    // Use Gemini for code analysis with timeout
    const analysisPrompt = `Analyze this ${language} code and provide insights:

\`\`\`${language}
${code}
\`\`\`

Provide analysis in JSON format:
{
  "complexity": "low|medium|high",
  "readability": "excellent|good|fair|poor",
  "bestPractices": ["practice1", "practice2"],
  "issues": ["issue1", "issue2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "patterns": ["pattern1", "pattern2"],
  "score": 85
}`;

    const analysis = await Promise.race([
      geminiService.generateContent(
        analysisPrompt, 
        "You are a code review expert. Provide constructive, educational feedback.",
        { temperature: 0.3 }
      ),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Analysis timeout')), 10000)
      )
    ]);

    return JSON.parse(analysis as string);

  } catch (error) {
    console.error('Code analysis error:', error);
    return getMockCodeAnalysis(code, language);
  }
}

// Get instant feedback on code/explanation
async function getInstantFeedback(code: string, explanation: string, language: string) {
  const feedback = {
    overall: 'good' as 'excellent' | 'good' | 'needs_improvement',
    score: 75,
    strengths: [] as string[],
    improvements: [] as string[],
    suggestions: [] as string[],
    nextSteps: [] as string[],
    encouragement: ''
  };

  // Basic code analysis
  if (code) {
    const codeLength = code.length;
    const lines = code.split('\n').length;
    
    if (codeLength > 50) {
      feedback.strengths.push('Good code length showing effort');
    }
    
    if (code.includes('function') || code.includes('def') || code.includes('=>')) {
      feedback.strengths.push('Uses functions/methods appropriately');
    }
    
    if (code.includes('//') || code.includes('#') || code.includes('"""')) {
      feedback.strengths.push('Includes comments/documentation');
    }
    
    if (lines > 20) {
      feedback.improvements.push('Consider breaking into smaller functions');
    }
    
    // Language-specific feedback
    if (language === 'python') {
      if (!code.includes('def ')) {
        feedback.suggestions.push('Consider using functions to organize your code');
      }
    } else if (language === 'javascript') {
      if (!code.includes('const') && !code.includes('let')) {
        feedback.suggestions.push('Use const/let instead of var for better code');
      }
    }
  }

  // Explanation analysis
  if (explanation) {
    if (explanation.length > 50) {
      feedback.strengths.push('Provides clear explanation of approach');
      feedback.score += 10;
    }
    
    if (explanation.toLowerCase().includes('because') || explanation.toLowerCase().includes('reason')) {
      feedback.strengths.push('Shows reasoning behind decisions');
      feedback.score += 5;
    }
  }

  // Generate encouragement based on score
  if (feedback.score >= 80) {
    feedback.encouragement = "Excellent work! You're showing great understanding! 🌟";
    feedback.overall = 'excellent';
  } else if (feedback.score >= 70) {
    feedback.encouragement = "Great job! You're on the right track! 🎉";
    feedback.overall = 'good';
  } else {
    feedback.encouragement = "Good effort! Keep practicing and you'll improve! 💪";
    feedback.overall = 'needs_improvement';
  }

  // Next steps
  feedback.nextSteps = [
    'Try implementing additional features',
    'Consider edge cases and error handling',
    'Add more comments to explain complex logic'
  ] as string[];

  return feedback;
}

// Suggest code improvements
async function suggestImprovements(code: string, language: string, difficulty: string) {
  const suggestions = {
    priority: 'medium' as 'low' | 'medium' | 'high',
    categories: {
      performance: [] as string[],
      readability: [] as string[],
      security: [] as string[],
      bestPractices: [] as string[]
    },
    examples: [] as string[],
    resources: [] as string[]
  };

  // Basic suggestions based on code patterns
  if (language === 'python') {
    if (code.includes('for i in range(len(')) {
      suggestions.categories.bestPractices.push('Use "for item in list" instead of range(len())');
      suggestions.examples.push('Use: for item in my_list instead of for i in range(len(my_list))');
    }
    
    if (!code.includes('try:')) {
      suggestions.categories.security.push('Consider adding error handling with try/except');
    }
    
    suggestions.resources = [
      'Python Best Practices Guide',
      'PEP 8 Style Guide',
      'Python Performance Tips'
    ] as string[];
  } else if (language === 'javascript') {
    if (code.includes('var ')) {
      suggestions.categories.bestPractices.push('Use const/let instead of var');
      suggestions.examples.push('Use: const myVar = value or let myVar = value');
    }
    
    if (code.includes('== ')) {
      suggestions.categories.bestPractices.push('Use === for strict equality');
    }
    
    suggestions.resources = [
      'JavaScript Best Practices',
      'ES6+ Features Guide',
      'MDN JavaScript Documentation'
    ] as string[];
  }

  // Difficulty-based suggestions
  if (difficulty === 'beginner') {
    suggestions.categories.readability.push('Add more comments explaining your logic');
    suggestions.categories.readability.push('Use descriptive variable names');
  } else if (difficulty === 'advanced') {
    suggestions.categories.performance.push('Consider algorithmic complexity');
    suggestions.categories.security.push('Validate inputs and handle edge cases');
  }

  return suggestions;
}

// Check code syntax
async function checkSyntax(code: string, language: string) {
  // Mock syntax checking - in production, this would use language-specific parsers
  const result = {
    valid: true,
    errors: [] as string[],
    warnings: [] as string[],
    suggestions: [] as string[]
  };

  // Basic syntax checks
  if (language === 'python') {
    const indentationRegex = /^[ ]*\S/gm;
    const matches = code.match(indentationRegex);
    if (matches && matches.some(match => match.startsWith('  ') === false && match !== match.trim())) {
      result.warnings.push('Check indentation - Python requires consistent indentation');
    }
  } else if (language === 'javascript') {
    const openBraces = (code.match(/{/g) || []).length;
    const closeBraces = (code.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      result.valid = false;
      result.errors.push('Mismatched braces - check your { and } brackets');
    }
  }

  return result;
}

// Safely run code in sandboxed environment (mock implementation)
async function runCodeSafely(code: string, language: string) {
  // Mock implementation - in production, this would use Docker containers or cloud sandboxing
  return {
    status: 'demo_mode',
    output: 'Code execution is available in demo mode.\n\nYour code would run here with proper output.',
    errors: [],
    executionTime: '0.05s',
    memoryUsage: '2.3MB',
    message: 'Upgrade to full version for live code execution',
    supportedLanguages: ['python', 'javascript', 'java', 'cpp']
  };
}

// Get contextual hints based on exercise and current progress
async function getContextualHints(exerciseId: string, code: string, difficulty: string) {
  const hints = {
    immediate: [] as string[],
    conceptual: [] as string[],
    debugging: [] as string[],
    nextStep: ''
  };

  // Analyze code to provide contextual hints
  if (!code || code.trim().length === 0) {
    hints.immediate.push('💡 Start by defining the main function or class');
    hints.immediate.push('📝 Think about what inputs your solution needs');
    hints.conceptual.push('Break down the problem into smaller steps');
  } else {
    if (!code.includes('function') && !code.includes('def')) {
      hints.immediate.push('🔧 Consider organizing your code into functions');
    }
    
    if (code.length < 50) {
      hints.immediate.push('📈 Try expanding your solution with more details');
    }
    
    hints.debugging.push('🐛 Test your code with simple examples first');
    hints.debugging.push('👀 Check your variable names and syntax');
  }

  // Difficulty-based hints
  if (difficulty === 'beginner') {
    hints.conceptual.push('🎯 Focus on getting the basic functionality working first');
    hints.conceptual.push('📚 Don\'t worry about optimization yet');
  } else if (difficulty === 'advanced') {
    hints.conceptual.push('⚡ Consider the time and space complexity');
    hints.conceptual.push('🔒 Think about edge cases and error handling');
  }

  hints.nextStep = hints.immediate[0] || 'Keep coding and experimenting!';

  return hints;
}

// Explain concepts on demand
async function explainConcept(concept: string, difficulty: string) {
  const explanations = {
    'loops': {
      beginner: 'Loops allow you to repeat code multiple times. Like a for loop that counts from 1 to 10.',
      intermediate: 'Loops are control structures that repeat code blocks. Choose for loops for known iterations, while loops for conditions.',
      advanced: 'Loops have different time complexities. Nested loops are O(n²), which may require optimization for large datasets.'
    },
    'functions': {
      beginner: 'Functions are like mini-programs that do specific tasks. They help organize your code.',
      intermediate: 'Functions encapsulate logic and promote code reuse. They can take parameters and return values.',
      advanced: 'Functions support closures, higher-order operations, and can be optimized for performance and memory usage.'
    },
    'variables': {
      beginner: 'Variables store information that you can use later, like storing your name in a variable.',
      intermediate: 'Variables have different types (strings, numbers, arrays) and scope (local vs global).',
      advanced: 'Consider variable mutability, memory allocation, and performance implications in your choice of data structures.'
    }
  };

  const explanation = explanations[concept.toLowerCase() as keyof typeof explanations]?.[difficulty as keyof typeof explanations['loops']] || 
    `${concept} is an important programming concept. Try searching for tutorials or documentation for more details.`;

  return {
    concept,
    difficulty,
    explanation,
    examples: [`// Example of ${concept} usage`, '// (code example would go here)'] as string[],
    relatedConcepts: ['functions', 'loops', 'variables'].filter(c => c !== concept.toLowerCase()),
    resources: [
      `Learn more about ${concept}`,
      `${concept} best practices`,
      `Advanced ${concept} techniques`
    ] as string[]
  };
}

// Mock code analysis for demo users
function getMockCodeAnalysis(code: string, language: string) {
  const lines = code.split('\n').length;
  const hasComments = code.includes('//') || code.includes('#') || code.includes('"""');
  const hasFunctions = code.includes('function') || code.includes('def') || code.includes('=>');
  
  let score = 70;
  if (hasComments) score += 10;
  if (hasFunctions) score += 15;
  if (lines > 10) score += 5;
  
  return {
    complexity: lines > 30 ? 'high' : lines > 15 ? 'medium' : 'low',
    readability: hasComments ? 'good' : 'fair',
    bestPractices: hasFunctions ? ['Uses functions', 'Structured code'] : ['Consider using functions'],
    issues: !hasComments ? ['Missing comments'] : [],
    suggestions: [
      'Add more descriptive variable names',
      'Consider error handling',
      'Add unit tests'
    ],
    patterns: hasFunctions ? ['Functional programming'] : ['Procedural programming'],
    score: Math.min(score, 100)
  };
}
