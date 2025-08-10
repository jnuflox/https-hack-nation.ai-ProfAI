/**
 * Enhanced ProfAI Gemini Service with Chat Integration
 * Integrates with existing ProfAI infrastructure while adding advanced chat capabilities
 */

import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai";
import { videoService, type VideoRecommendation } from './video-service';
import { audioService } from './audio-service';

// Types for the enhanced system
export interface Message {
  id?: string;
  text: string;
  sender: MessageSender;
  timestamp?: Date;
  metadata?: any;
}

export enum MessageSender {
  USER = 'user',
  AI = 'ai'
}

export interface OnboardingData {
  learningGoals: string[];
  elearningExperience: 'beginner' | 'intermediate' | 'advanced';
  learningMethods: string[];
  aiUsage: string;
  aiUnderstanding: string;
  themeId?: string;
}

export interface RoadmapItem {
  id?: string;
  title: string;
  description: string;
  completed?: boolean;
  order?: number;
}

export interface Video {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  duration?: string;
  description?: string;
}

export interface ChatResponse {
  text: string;
  video: Video | null;
  suggestions?: string[];
  metadata?: {
    emotion?: string;
    confidence?: number;
    nextSteps?: string[];
    userName?: string;
    audioEnabled?: boolean;
    audioSupported?: boolean;
    hasVideo?: boolean;
    topicDetected?: string;
    enhancedFeatures?: boolean;
    [key: string]: any; // Allow additional properties
  };
  audio?: {
    enabled: boolean;
    duration?: number;
    voice?: string;
    autoplay?: boolean;
  };
}

class EnhancedGeminiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    
    if (!apiKey) {
      console.error("GEMINI_API_KEY or API_KEY environment variable not set.");
      throw new Error("API key is required");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp"
    });
  }

  /**
   * Generate initial lesson content based on onboarding data and selected topic
   */
  async generateInitialLesson(
    onboardingData: OnboardingData | null, 
    lessonTopic: string | null
  ): Promise<string> {
    let prompt: string;

    if (lessonTopic) {
      prompt = `You are ProfAI, an MIT-style AI professor. The student has selected a topic from their personalized roadmap: "${lessonTopic}".

      Start a conversation about this specific topic. Ask them what they'd like to know about it, or if they'd prefer a general overview. 
      
      Keep it welcoming, concise, and use markdown for formatting. Your response should be 2-3 sentences max.`;
    } else if (onboardingData?.themeId) {
      const selectedTheme = onboardingData.themeId;
      prompt = `You are ProfAI, an MIT-style AI professor. You are greeting a student who has just completed their detailed onboarding.
      
      - Their primary goal is: ${onboardingData.learningGoals[0]}
      - They are starting with the theme: ${selectedTheme}
      - Their experience level: ${onboardingData.elearningExperience}
      - Preferred learning methods: ${onboardingData.learningMethods.join(', ')}
      
      Welcome them back to the chat interface. Let them know their personalized plan is ready on the home page and that here, they can ask any question to start their first lesson. 
      
      Keep it short (2-3 sentences), welcoming, and encouraging. Use markdown for formatting.`;
    } else {
      prompt = "Welcome back! Let's continue our lesson. What would you like to discuss today?";
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating initial lesson:", error);
      return "Hello! I'm ProfAI, your personal AI tutor. I'm here to help you learn. Where would you like to start today?";
    }
  }

  /**
   * Generate video playlist based on roadmap items
   */
  async generateVideoPlaylist(roadmap: RoadmapItem[]): Promise<Video[]> {
    const roadmapTitles = roadmap.map(item => item.title).join(', ');
    const prompt = `Based on the following AI learning topics, find one highly relevant, educational YouTube video for each topic from a reputable source. 
    
    **IMPORTANT**: The videos must be publicly available and allow embedding on other websites.

    Topics: "${roadmapTitles}"

    Prioritize videos from channels that usually allow embedding, like:
    - Tech educators (3Blue1Brown, Fireship, TwoMinutePapers)
    - Official company channels (Google AI, OpenAI, DeepMind)
    - Educational channels (Crash Course, Khan Academy)
    
    Avoid university lectures which often restrict embedding.

    Return ONLY a valid JSON array of objects. Each object must have "videoId" and "title" properties. 
    Do not include the full YouTube URL, only the video ID from the URL.
    
    Format:
    [
        { "videoId": "G2fqAlgmoPo", "title": "What is Generative AI?" },
        { "videoId": "iR2O2GPbB0E", "title": "What are Large Language Models?" }
    ]`;

    try {
      const config: GenerationConfig = {
        temperature: 0.3,
        maxOutputTokens: 2048,
      };

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: config,
      });

      const response = await result.response;
      let jsonString = response.text();

      // Clean up the response to extract pure JSON
      jsonString = this.cleanJsonResponse(jsonString);

      const parsedVideos: { videoId: string, title: string }[] = JSON.parse(jsonString);

      return parsedVideos.map(video => ({
        ...video,
        thumbnailUrl: `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`
      }));

    } catch (error) {
      console.error("Error generating video playlist:", error);
      return this.getFallbackVideos(roadmap);
    }
  }

  /**
   * Generate personalized learning roadmap
   */
  async generateRoadmap(
    onboardingData: OnboardingData, 
    themeName: string
  ): Promise<Omit<RoadmapItem, 'id' | 'completed'>[]> {
    const prompt = `You are an expert curriculum designer for AI education. Create a personalized 5-step learning roadmap for the topic "${themeName}".

    Student Profile:
    - Learning Goals: ${onboardingData.learningGoals.join(', ')}
    - Experience Level: ${onboardingData.elearningExperience}
    - Preferred Learning Methods: ${onboardingData.learningMethods.join(', ')}
    - Current AI Usage: ${onboardingData.aiUsage}
    - AI Understanding: "${onboardingData.aiUnderstanding}"

    Requirements:
    - Create exactly 5 learning modules
    - Tailor complexity to their experience level
    - Match their preferred learning methods
    - Align with their stated goals
    - Progress logically from basics to advanced

    Return ONLY a valid JSON array of objects with "title" and "description" properties.
    
    Example format:
    [
      {
        "title": "AI Fundamentals",
        "description": "Start with core concepts and terminology you'll use throughout your AI journey."
      }
    ]`;

    try {
      const config: GenerationConfig = {
        temperature: 0.7,
        maxOutputTokens: 1500,
      };

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: config,
      });

      const response = await result.response;
      let jsonString = this.cleanJsonResponse(response.text());

      const roadmapItems = JSON.parse(jsonString);
      return Array.isArray(roadmapItems) ? roadmapItems : this.getFallbackRoadmap(themeName);

    } catch (error) {
      console.error("Error generating roadmap:", error);
      return this.getFallbackRoadmap(themeName);
    }
  }

  /**
   * Enhanced chat analysis and response with video and audio integration
   */
  async analyzeAndRespond(
    history: Message[], 
    userInput: string,
    context?: {
      currentTopic?: string;
      userProfile?: any;
      emotionalState?: string;
      userName?: string;
      lessonPrompt?: string;
      lessonId?: string;
      courseId?: string;
      isLessonMode?: boolean;
    }
  ): Promise<ChatResponse> {
    try {
      const conversationHistory = this.formatHistory(history);
      const detectedEmotion = this.detectEmotionalState(userInput, history);
      const currentEmotion = context?.emotionalState || detectedEmotion;
      const detectedTopic = this.detectTopicFromInput(userInput);
      
      let basePrompt = `You are ProfAI, an MIT-style AI professor specializing in AI education. Your teaching style is adaptive, encouraging, and visual.

      **Context:**`;
      
      if (context?.currentTopic) {
        basePrompt += `\nCurrent Topic: ${context.currentTopic}`;
      }
      if (context?.userName) {
        basePrompt += `\nStudent Name: ${context.userName}`;
      }
      if (currentEmotion) {
        basePrompt += `\nStudent Emotional State: ${currentEmotion}`;
      }
      if (context?.userProfile) {
        basePrompt += `\nUser Profile: ${JSON.stringify(context.userProfile)}`;
      }

      // Add lesson-specific context if available
      if (context?.isLessonMode && context?.lessonPrompt) {
        basePrompt += `
      
      **LESSON CONTEXT - VERY IMPORTANT:**
      You are now operating in LESSON MODE for Course: ${context.courseId}, Lesson: ${context.lessonId}
      
      SPECIFIC LESSON PROMPT TO FOLLOW:
      ${context.lessonPrompt}
      
      **CRITICAL INSTRUCTIONS:**
      - Follow the specific lesson prompt above carefully
      - Use the lesson context, examples, and guidelines provided
      - Adapt your teaching style to the lesson's objectives
      - Reference lesson-specific content when appropriate
      - If the lesson mentions video/code/quiz resources, reference them naturally`;
      }

      const prompt = `${basePrompt}

      **Conversation History:**
      ${conversationHistory}

      **Student's Latest Message:** "${userInput}"

      **Your Tasks:**
      1. ${context?.isLessonMode ? 'FIRST: Apply the specific lesson prompt and context above' : 'Analyze the student\'s comprehension and emotional state'}
      2. Detect the main AI/ML topic being discussed (${detectedTopic || 'general AI'})
      3. Determine if a YouTube video would help explain the concept
      4. Create an audio-friendly response (avoid complex formatting)
      5. Craft an adaptive response (2-4 sentences):
         - If struggling: be encouraging and simplify
         - If confident: provide challenges
         - If confused: break down concepts
         - If engaged: maintain momentum

      6. **Video Format**: If you recommend a video, append this EXACT format at the end:
         @@VIDEO_INFO@@{"videoId": "VIDEO_ID", "title": "VIDEO_TITLE"}

      **Examples:**

      *With Video:*
      Great question about neural networks! The learning process is called backpropagation. This video explains it visually, which should help clarify the concept.
      @@VIDEO_INFO@@{"videoId": "Ilg3gGewQ5U", "title": "What is backpropagation?"}

      *Without Video:*
      Perfect understanding! You've grasped the core concept of machine learning. Ready for the next challenge?

      **Audio Guidelines:**
      - Keep responses conversational and natural for text-to-speech
      - Avoid complex markdown formatting in speech portions
      - Use clear, educational language
      - Include emotional support when needed

      Generate your response now:`;

      const config: GenerationConfig = {
        temperature: 0.8,
        maxOutputTokens: 1000,
      };

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: config,
      });

      const response = await result.response;
      const parsedResponse = this.parseVideoResponse(response.text(), { 
        emotionalState: currentEmotion,
        confidence: this.calculateConfidence(userInput, history),
        userName: context?.userName,
        currentTopic: context?.currentTopic,
        detectedTopic
      });

      // Add intelligent suggestions based on context
      parsedResponse.suggestions = this.generateContextualSuggestions(
        userInput, 
        parsedResponse.text, 
        currentEmotion,
        context?.currentTopic || detectedTopic || undefined
      );

      // Enhanced audio integration
      parsedResponse.audio = {
        enabled: audioService.isSupported(),
        autoplay: currentEmotion === 'frustrated' || currentEmotion === 'confused', // Auto-play for struggling students
        voice: 'spanish-educational'
      };

      // Enhanced metadata
      parsedResponse.metadata = {
        ...parsedResponse.metadata,
        audioEnabled: parsedResponse.audio.enabled,
        audioSupported: audioService.isSupported(),
        hasVideo: !!parsedResponse.video,
        topicDetected: detectedTopic || undefined,
        enhancedFeatures: true
      };

      return parsedResponse;

    } catch (error) {
      console.error("Error in AI response generation:", error);
      return this.getFallbackResponse(userInput, context?.emotionalState);
    }
  }

  /**
   * Generate theme description for dashboard
   */
  async generateThemeDescription(themeName: string): Promise<string> {
    const prompt = `Generate a concise, engaging description for the AI learning theme "${themeName}". 
    
    Requirements:
    - 2-3 sentences maximum
    - Highlight what students will learn
    - Use encouraging, professional tone
    - Focus on practical outcomes
    
    Example: "Master the fundamentals of machine learning through hands-on projects and real-world examples. You'll learn to build, train, and deploy your first ML models while understanding the theory that makes them work."`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error("Error generating theme description:", error);
      return `Explore the exciting world of ${themeName} with hands-on learning and practical applications.`;
    }
  }

  /**
   * Generate lesson content for specific topics
   */
  async generateLessonContent(themeName: string, lessonTitle: string): Promise<string> {
    const prompt = `You are ProfAI, an expert AI tutor. Generate content for a micro-learning lesson.
    
    Theme: "${themeName}"
    Lesson: "${lessonTitle}"

    Requirements:
    - Clear, beginner-friendly explanations
    - Use practical examples and analogies
    - Include 3-4 paragraphs of content
    - End with a thought-provoking question
    - Use markdown formatting for readability
    - Keep it conversational and engaging

    Structure:
    1. Brief introduction to the concept
    2. Core explanation with examples
    3. Real-world applications
    4. Understanding check question`;

    try {
      const config: GenerationConfig = {
        temperature: 0.7,
        maxOutputTokens: 1500,
      };

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: config,
      });

      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating lesson content:", error);
      return `# ${lessonTitle}\n\nLo siento, no pude generar el contenido de esta lección en este momento. Por favor, intenta de nuevo más tarde.`;
    }
  }

  // Helper methods
  private formatHistory(messages: Message[]): string {
    return messages
      .slice(-10) // Keep last 10 messages for context
      .map(m => `${m.sender === MessageSender.USER ? 'Estudiante' : 'ProfAI'}: ${m.text}`)
      .join('\n');
  }

  private detectEmotionalState(userInput: string, history: Message[]): string {
    const input = userInput.toLowerCase();
    
    // Frustrated indicators
    if (input.includes('no entiendo') || input.includes('confundido') || 
        input.includes('difícil') || input.includes('no comprendo') ||
        input.includes('frustrado') || input.includes('no funciona')) {
      return 'frustrated';
    }
    
    // Confused indicators
    if (input.includes('¿qué es') || input.includes('explica') || 
        input.includes('cómo') || input.includes('por qué') ||
        input.includes('no sé') || input.includes('ayuda')) {
      return 'confused';
    }
    
    // Engaged indicators
    if (input.includes('genial') || input.includes('interesante') || 
        input.includes('más') || input.includes('avanzado') ||
        input.includes('siguiente') || input.includes('profundizar')) {
      return 'engaged';
    }
    
    // Excited indicators
    if (input.includes('wow') || input.includes('increíble') || 
        input.includes('fascinante') || input.includes('!')) {
      return 'excited';
    }
    
    return 'neutral';
  }

  private calculateConfidence(userInput: string, history: Message[]): number {
    let confidence = 0.5; // Base confidence
    
    // Increase confidence based on conversation length
    confidence += Math.min(history.length * 0.05, 0.3);
    
    // Increase confidence for specific questions
    if (userInput.includes('?') || userInput.includes('qué') || userInput.includes('cómo')) {
      confidence += 0.2;
    }
    
    // Decrease confidence for vague inputs
    if (userInput.length < 10) {
      confidence -= 0.2;
    }
    
    return Math.max(0.1, Math.min(1.0, confidence));
  }

  private detectTopicFromInput(userInput: string): string | null {
    const input = userInput.toLowerCase();
    
    // Define topic detection patterns
    const topicPatterns: Record<string, string[]> = {
      'machine-learning': ['machine learning', 'aprendizaje automático', 'ml', 'algoritmos', 'predicción'],
      'neural-networks': ['redes neuronales', 'neural network', 'perceptrón', 'neuronas', 'backpropagation'],
      'deep-learning': ['deep learning', 'aprendizaje profundo', 'rnn', 'cnn', 'lstm', 'transformer'],
      'transformers': ['transformer', 'attention', 'bert', 'gpt', 'llm'],
      'prompt-engineering': ['prompt', 'prompting', 'few-shot', 'zero-shot', 'chain of thought'],
      'computer-vision': ['visión', 'computer vision', 'imagen', 'opencv', 'cnn', 'clasificación'],
      'nlp': ['nlp', 'procesamiento de lenguaje', 'texto', 'tokenización', 'embeddings']
    };

    // Find matching topic
    for (const [topic, patterns] of Object.entries(topicPatterns)) {
      if (patterns.some(pattern => input.includes(pattern))) {
        return topic;
      }
    }

    return null;
  }

  private generateContextualSuggestions(
    userInput: string, 
    response: string, 
    emotion: string,
    currentTopic?: string
  ): string[] {
    const suggestions = [];
    
    // Base suggestions based on emotion
    switch (emotion) {
      case 'confused':
        suggestions.push('¿Puedes explicar eso más simple?');
        suggestions.push('Dame un ejemplo práctico');
        suggestions.push('¿Qué conceptos necesito saber primero?');
        break;
      case 'frustrated':
        suggestions.push('Empecemos con lo básico');
        suggestions.push('Déjame intentar un enfoque diferente');
        suggestions.push('¿Qué parte específica es la más difícil?');
        break;
      case 'engaged':
        suggestions.push('¿Qué más puedo aprender sobre esto?');
        suggestions.push('Dame un ejemplo más avanzado');
        suggestions.push('¿Cómo se aplica esto en la práctica?');
        break;
      default:
        suggestions.push('¿Puedes dar más detalles?');
        suggestions.push('Muéstrame un ejemplo');
        suggestions.push('¿Cuál es el siguiente paso?');
    }
    
    // Topic-specific suggestions
    if (currentTopic) {
      if (currentTopic.includes('machine learning')) {
        suggestions.push('¿Cómo entreno un modelo?');
        suggestions.push('¿Qué algoritmos debo usar?');
      } else if (currentTopic.includes('neural network')) {
        suggestions.push('¿Cómo funciona backpropagation?');
        suggestions.push('¿Qué es una función de activación?');
      } else if (currentTopic.includes('prompt engineering')) {
        suggestions.push('Dame ejemplos de prompts efectivos');
        suggestions.push('¿Cómo mejoro mis prompts?');
      }
    }
    
    return suggestions.slice(0, 3); // Return max 3 suggestions
  }

  private getFallbackResponse(userInput: string, emotionalState?: string): ChatResponse {
    const fallbackMessages = {
      frustrated: "Entiendo que esto puede ser frustrante. Vamos paso a paso - ¿qué parte específica te está costando más?",
      confused: "No hay problema, la IA puede ser compleja. ¿Podrías decirme qué concepto te gustaría que explique más claramente?",
      engaged: "¡Me encanta tu entusiasmo! Aunque tuve un problema técnico, sigamos aprendiendo - ¿qué tema te interesa más?",
      default: "Disculpa, tuve un problema procesando eso. ¿Podrías reformular tu pregunta de otra manera?"
    };
    
    const message = fallbackMessages[emotionalState as keyof typeof fallbackMessages] || fallbackMessages.default;
    
    return {
      text: message,
      video: null,
      suggestions: [
        '¿Qué es machine learning?',
        'Explica las redes neuronales',
        'Dame un ejemplo práctico'
      ],
      metadata: {
        emotion: emotionalState || 'neutral',
        confidence: 0.3,
        nextSteps: ['Reformula tu pregunta', 'Intenta con un tema específico']
      }
    };
  }

  private cleanJsonResponse(jsonString: string): string {
    // Remove markdown code blocks
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.substring(7);
    }
    if (jsonString.startsWith('```')) {
      jsonString = jsonString.substring(3);
    }
    if (jsonString.endsWith('```')) {
      jsonString = jsonString.substring(0, jsonString.length - 3);
    }
    
    jsonString = jsonString.trim();

    // Find JSON array boundaries
    const startIndex = jsonString.indexOf('[');
    const endIndex = jsonString.lastIndexOf(']');
    
    if (startIndex === -1 || endIndex === -1) {
      throw new Error("No JSON array found in response");
    }
    
    return jsonString.substring(startIndex, endIndex + 1);
  }

  private parseVideoResponse(rawText: string, context?: any): ChatResponse {
    const videoMarker = '@@VIDEO_INFO@@';
    let video: Video | null = null;
    let text = rawText;

    if (rawText.includes(videoMarker)) {
      const parts = rawText.split(videoMarker);
      text = parts[0].trim();
      
      try {
        const videoData = JSON.parse(parts[1]);
        
        // Try to get better video from our service if we have topic context
        const detectedTopic = context?.detectedTopic;
        if (detectedTopic) {
          const betterVideo = videoService.findBestVideoForTopic(
            detectedTopic,
            context?.userProfile?.learningLevel || 'beginner',
            'en'
          );
          
          if (betterVideo) {
            video = {
              videoId: betterVideo.videoId,
              title: betterVideo.title,
              thumbnailUrl: betterVideo.thumbnailUrl,
              duration: betterVideo.duration,
              description: betterVideo.description || `Video educativo sobre ${detectedTopic}`
            };
          }
        }
        
        // Fallback to Gemini's recommendation if no better video found
        if (!video) {
          video = {
            videoId: videoData.videoId,
            title: videoData.title,
            thumbnailUrl: `https://i.ytimg.com/vi/${videoData.videoId}/hqdefault.jpg`,
            description: `Video recomendado sobre ${context?.currentTopic || 'el tema'}`
          };
        }
      } catch (e) {
        console.error("Failed to parse video JSON:", e);
        
        // Try to find a relevant video based on context anyway
        const detectedTopic = context?.detectedTopic || context?.currentTopic;
        if (detectedTopic) {
          const fallbackVideo = videoService.findBestVideoForTopic(detectedTopic);
          if (fallbackVideo) {
            video = {
              videoId: fallbackVideo.videoId,
              title: fallbackVideo.title,
              thumbnailUrl: fallbackVideo.thumbnailUrl,
              duration: fallbackVideo.duration,
              description: fallbackVideo.description
            };
          }
        }
      }
    } else {
      // No video marker found, but check if we should recommend one based on topic
      const detectedTopic = context?.detectedTopic;
      if (detectedTopic && (
        context?.emotionalState === 'confused' || 
        context?.emotionalState === 'frustrated' ||
        text.toLowerCase().includes('no entiendo') ||
        text.toLowerCase().includes('visual')
      )) {
        const recommendedVideo = videoService.findBestVideoForTopic(detectedTopic);
        if (recommendedVideo) {
          video = {
            videoId: recommendedVideo.videoId,
            title: recommendedVideo.title,
            thumbnailUrl: recommendedVideo.thumbnailUrl,
            duration: recommendedVideo.duration,
            description: recommendedVideo.description
          };
          
          // Add a note about the video recommendation
          text += `\n\nTe recomiendo este video que puede ayudarte a entender mejor el concepto:`;
        }
      }
    }

    // Clean up the text response for better audio synthesis
    const audioFriendlyText = this.prepareTextForAudio(text);

    return {
      text: audioFriendlyText,
      video,
      metadata: {
        emotion: context?.emotionalState || 'neutral',
        confidence: context?.confidence || (video ? 0.8 : 0.6),
        nextSteps: video ? 
          ['Ve el video recomendado', 'Haz preguntas de seguimiento', 'Prueba con un ejercicio'] : 
          ['Continúa la discusión', 'Pide más ejemplos', 'Solicita ejercicios prácticos'],
        userName: context?.userName
      }
    };
  }

  private prepareTextForAudio(text: string): string {
    return text
      // Clean up for better audio synthesis
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic formatting
      .replace(/`(.*?)`/g, '$1')       // Remove code formatting
      .replace(/#{1,6}\s*(.*)/g, '$1') // Remove headers
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
      // Keep the original text intact but add pauses for readability
      .replace(/\. /g, '. ')
      .replace(/\? /g, '? ')
      .replace(/! /g, '! ')
      .trim();
  }

  private getFallbackVideos(roadmap: RoadmapItem[]): Video[] {
    const fallbacks = [
      { videoId: "ukzFI9rgwfU", title: "Machine Learning Explained" },
      { videoId: "aircAruvnKk", title: "Neural Networks Introduction" },
      { videoId: "IHZwWFHWa-w", title: "AI vs Machine Learning" },
      { videoId: "R9OHn5ZF4Uo", title: "Deep Learning Basics" },
      { videoId: "TJldO5M5tbo", title: "AI Ethics Overview" }
    ];

    return fallbacks
      .slice(0, Math.min(roadmap.length, 5))
      .map(video => ({
        ...video,
        thumbnailUrl: `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`
      }));
  }

  private getFallbackRoadmap(themeName: string): RoadmapItem[] {
    return [
      { 
        title: "Introducción a la IA", 
        description: "Aprende los conceptos básicos y terminología de la inteligencia artificial." 
      },
      { 
        title: "Tipos de IA", 
        description: "Explora las diferentes categorías como IA estrecha y IA general." 
      },
      { 
        title: "Machine Learning Básico", 
        description: "Entiende cómo las máquinas aprenden de los datos." 
      },
      { 
        title: "Redes Neuronales", 
        description: "Un vistazo a la estructura del 'cerebro' de la IA." 
      },
      { 
        title: "Ética en IA", 
        description: "Discute las importantes implicaciones sociales de la IA." 
      }
    ];
  }
}

// Create singleton instance
export const enhancedGeminiService = new EnhancedGeminiService();

// Export for compatibility with existing code
export {
  enhancedGeminiService as geminiService,
  EnhancedGeminiService
};
