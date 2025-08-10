/**
 * Enhanced Gemini Service for ProfAI
 * Provides AI tutoring capabilities with Google's Gemini API
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Response interfaces
interface ChatResponse {
  message: string;
  followUpQuestions?: string[];
  relatedTopics?: string[];
  needsClarification?: boolean;
  emotionalTone?: 'supportive' | 'encouraging' | 'challenging' | 'neutral';
}

interface LessonResponse {
  title: string;
  objectives: string[];
  content: string;
  codeExample?: string;
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  nextSteps: string[];
}

interface ExerciseResponse {
  title: string;
  description: string;
  instructions: string[];
  starterCode?: string;
  expectedOutput?: string;
  evaluationCriteria: string[];
  hints: string[];
}

interface EvaluationResponse {
  score: number;
  feedback: {
    strengths: string[];
    improvements: string[];
    specificComments: string[];
  };
  suggestions: string[];
  nextLevel: boolean;
}

type GeminiResponse = LessonResponse | ExerciseResponse | EvaluationResponse | ChatResponse | string;

class GeminiService {
  private genAI: GoogleGenerativeAI | null;
  private model: any;
  private isInitialized: boolean;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn("⚠️ GEMINI_API_KEY not found - using mock responses");
      this.genAI = null;
      this.model = null;
      this.isInitialized = false;
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: process.env.GEMINI_MODEL || "gemini-2.0-flash-exp"
      });
      this.isInitialized = true;
      console.log("✅ Gemini service initialized");
    } catch (error) {
      console.error("❌ Gemini initialization failed:", error);
      this.genAI = null;
      this.model = null;
      this.isInitialized = false;
    }
  }

  async generateContent(prompt: string, systemInstruction?: string): Promise<string> {
    if (!this.isInitialized || !this.model) {
      return `Mock response to: "${prompt}"`;
    }

    try {
      const fullPrompt = systemInstruction 
        ? `${systemInstruction}\n\nUser: ${prompt}`
        : prompt;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('❌ Gemini API error:', error);
      return `Error generating response: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  async generateChatResponse(userMessage: string, context?: any): Promise<ChatResponse> {
    const systemInstruction = `You are ProfAI, an expert AI/ML professor. Provide educational, engaging responses adapted to the user's needs.`;

    try {
      const response = await this.generateContent(userMessage, systemInstruction);

      return {
        message: response,
        followUpQuestions: [
          "Would you like to explore this topic further?",
          "Do you have questions about any specific part?",
          "What would you like to learn next?"
        ],
        relatedTopics: ["Machine Learning", "Neural Networks", "Deep Learning", "AI Ethics"],
        needsClarification: false,
        emotionalTone: 'neutral'
      };
    } catch (error) {
      return {
        message: "I'm having trouble connecting right now, but I'm here to help with AI/ML education. What topic interests you?",
        followUpQuestions: ["What area of AI interests you most?"],
        emotionalTone: 'supportive'
      };
    }
  }

  async generateLesson(
    topic: string,
    difficulty: string = 'intermediate',
    learningStyle: string = 'hybrid'
  ): Promise<LessonResponse> {
    const prompt = `Generate a comprehensive lesson on "${topic}" at ${difficulty} level with ${learningStyle} approach.`;
    
    try {
      const response = await this.generateContent(prompt);
      
      return {
        title: `Understanding ${topic}`,
        objectives: [
          `Learn fundamentals of ${topic}`,
          `Understand practical applications`,
          `Apply concepts in real scenarios`
        ],
        content: response,
        codeExample: learningStyle !== 'theory' ? `# ${topic} example\nprint("Learning ${topic}")` : undefined,
        quiz: {
          question: `What is the key concept in ${topic}?`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: 0,
          explanation: "This demonstrates understanding of core concepts."
        },
        nextSteps: [
          "Practice with exercises",
          "Explore advanced topics",
          "Try real-world applications"
        ]
      };
    } catch (error) {
      return {
        title: `Introduction to ${topic}`,
        objectives: [`Learn about ${topic}`],
        content: `This lesson covers ${topic}. ${error}`,
        quiz: {
          question: `What is ${topic}?`,
          options: ["A", "B", "C", "D"],
          correctAnswer: 0,
          explanation: "Basic understanding check."
        },
        nextSteps: ["Continue learning"]
      };
    }
  }

  async generateExercise(topic: string, difficulty: string = 'intermediate'): Promise<ExerciseResponse> {
    return {
      title: `${topic} Exercise`,
      description: `Practice exercise for ${topic} at ${difficulty} level`,
      instructions: [
        "Read the problem carefully",
        "Plan your approach",
        "Implement your solution",
        "Test your results"
      ],
      starterCode: `# ${topic} exercise\n# Your code here\npass`,
      expectedOutput: "Successful completion of exercise requirements",
      evaluationCriteria: [
        "Correctness of solution",
        "Code quality",
        "Understanding demonstrated"
      ],
      hints: [
        "Break the problem into steps",
        "Test with simple examples",
        "Ask for help if needed"
      ]
    };
  }

  async evaluateSubmission(exercise: any, submission: any): Promise<EvaluationResponse> {
    return {
      score: 75,
      feedback: {
        strengths: ["Good understanding of concepts"],
        improvements: ["Could add more detail"],
        specificComments: ["Shows solid grasp of fundamentals"]
      },
      suggestions: [
        "Practice more exercises",
        "Try advanced challenges",
        "Review key concepts"
      ],
      nextLevel: false
    };
  }
}

// Create singleton instance
const geminiService = new GeminiService();

export { geminiService };
export type { GeminiResponse, ChatResponse, LessonResponse, ExerciseResponse, EvaluationResponse };
