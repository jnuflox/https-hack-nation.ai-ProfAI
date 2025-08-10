export interface OnboardingData {
  learningGoals: string[];
  elearningExperience: 'Beginner' | 'Intermediate' | 'Advanced' | null;
  learningMethods: string[];
  aiUsage: 'Never' | 'Occasionally' | 'Frequently' | null;
  aiUnderstanding: string;
  themeId: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}
