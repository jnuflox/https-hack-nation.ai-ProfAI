// Utilities para manejo robusto de base de datos
import { prisma } from './db';

export interface DatabaseOperationOptions {
  maxRetries?: number;
  timeoutMs?: number;
  fallbackData?: any;
}

export async function withDatabaseTimeout<T>(
  operation: () => Promise<T>,
  options: DatabaseOperationOptions = {}
): Promise<T> {
  const { maxRetries = 2, timeoutMs = 10000, fallbackData } = options;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await Promise.race([
        operation(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Database operation timeout')), timeoutMs)
        )
      ]);
      
      return result;
    } catch (error: any) {
      console.error(`🗄️ Database attempt ${attempt}/${maxRetries} failed:`, error.message);
      
      if (attempt === maxRetries) {
        if (fallbackData !== undefined) {
          console.log('⚠️ Using fallback data after all retries failed');
          return fallbackData;
        }
        throw error;
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  throw new Error('Should not reach here');
}

export function createTempUser(data: {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
}) {
  return {
    id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email: data.email,
    name: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Usuario ProfAI',
    firstName: data.firstName || null,
    lastName: data.lastName || null,
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
    isTemporary: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await withDatabaseTimeout(() => prisma.$queryRaw`SELECT 1`, { timeoutMs: 5000 });
    return true;
  } catch (error) {
    console.error('🚨 Database health check failed:', error);
    return false;
  }
}
