
// Tipos específicos para ProfAI
export interface LearningProfile {
  visual: number;
  auditory: number;
  kinesthetic: number;
}

export interface SkillLevel {
  theory: 'beginner' | 'intermediate' | 'advanced';
  tooling: 'beginner' | 'intermediate' | 'advanced'; 
  prompting: 'beginner' | 'intermediate' | 'advanced';
}

export interface EmotionBaseline {
  confusion_threshold: number;
  frustration_threshold: number;
  engagement_baseline: number;
}

export interface UserPreferences {
  preferred_format: 'theory' | 'tooling' | 'hybrid';
  language: string;
  pace: 'slow' | 'normal' | 'fast';
  difficulty_preference: 'fixed' | 'adaptive';
}

export interface LessonContent {
  version: string;
  specialization: 'theory' | 'tooling' | 'hybrid';
  delivery_format: string;
  sections: LessonSection[];
  quiz?: Quiz;
  practice_exercise?: PracticeExercise;
}

export interface LessonSection {
  title: string;
  theory_explanation?: string;
  code_demo?: CodeDemo;
  visual_aids?: string[];
  examples?: string[];
  duration?: number;
  emotion_adaptations?: EmotionAdaptations;
}

export interface CodeDemo {
  language: string;
  code: string;
  explanation_points?: string[];
}

export interface Quiz {
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

export interface PracticeExercise {
  title: string;
  starter_code: string;
  hints_progressive: string[];
  solution_walkthrough_video?: string;
}

export interface EmotionAdaptations {
  confusion_detected?: {
    action: string;
    content: string;
  };
  frustration_detected?: {
    action: string;
    content: string;
  };
  engagement_high?: {
    action: string;
    content: string;
  };
}

export interface EmotionalState {
  primary_emotion: string;
  confidence: number;
  detected_confusion?: boolean;
  secondary_emotions?: Record<string, number>;
}

export interface ConversationContext {
  lesson_id?: string;
  topic?: string;
  emotional_state?: string;
  adaptation_count?: number;
}

// Extending NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      firstName?: string | null;
      lastName?: string | null;
    }
  }

  interface User {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  }
}
