'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { 
  CheckCircle, 
  Circle, 
  Play, 
  Clock, 
  Code,
  HelpCircle,
  ChevronRight,
  Trophy,
  Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import '../../styles/progress-roadmap.css';

interface Lesson {
  id: string;
  title: string;
  description: string;
  estimatedDuration: number;
  difficultyLevel: number;
  hasVideoContent: boolean;
  hasCodeExamples: boolean;
  hasQuiz: boolean;
  isCompleted: boolean;
  progress: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  imageUrl: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

interface ProgressRoadmapProps {
  course: Course;
  lessons: Lesson[];
  onLessonClick: (lessonId: string) => void;
}

const StarRating = ({ courseId }: { courseId: string }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star key={`star-${courseId}-${i}`} className="h-5 w-5 fill-current text-yellow-200" />
    );
  }
  return <>{stars}</>;
};

export function ProgressRoadmap({ course, lessons, onLessonClick }: Readonly<ProgressRoadmapProps>) {
  const router = useRouter();
  
  // Handle lesson click - navigate to individual lesson page
  const handleLessonClick = (lessonId: string) => {
    router.push(`/courses/${course.id}/lessons/${lessonId}`);
  };
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'text-green-600 bg-green-100';
      case 2: return 'text-blue-600 bg-blue-100';
      case 3: return 'text-yellow-600 bg-yellow-100';
      case 4: return 'text-orange-600 bg-orange-100';
      case 5: return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Básico';
      case 2: return 'Intermedio';
      case 3: return 'Avanzado';
      case 4: return 'Experto';
      case 5: return 'Master';
      default: return 'Intermedio';
    }
  };

  const getNextLesson = () => {
    return lessons.find(lesson => !lesson.isCompleted) || lessons[0];
  };

  const getNodeColor = (lesson: Lesson, isActive: boolean) => {
    if (lesson.isCompleted) return "border-green-500 bg-green-500";
    if (isActive) return "border-blue-500 bg-blue-500 animate-pulse";
    return "border-gray-300";
  };

  const getCardColor = (lesson: Lesson, isActive: boolean) => {
    if (lesson.isCompleted) return "border-green-200 bg-green-50/50";
    if (isActive) return "border-blue-300 bg-blue-50/50 ring-2 ring-blue-100";
    return "border-gray-200";
  };

  const getProgressClass = () => {
    const percentage = Math.max(0, Math.min(100, (currentLessonIndex / Math.max(1, lessons.length - 1)) * 100));
    const rounded = Math.round(percentage / 10) * 10;
    return `progress-${rounded}`;
  };

  const nextLesson = getNextLesson();
  const currentLessonIndex = lessons.findIndex(lesson => lesson.id === nextLesson?.id) || 0;

  return (
    <div className="space-y-8">
      {/* Course Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
              <p className="text-blue-100 mb-4">{course.description}</p>
              <div className="flex items-center gap-4 text-sm text-blue-100">
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white`}>
                  {course.category}
                </span>
                <span>Nivel {course.difficulty}</span>
                <span>{course.completedLessons}/{course.totalLessons} lessons</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold mb-1">{course.progress}%</div>
              <div className="text-blue-100 text-sm">Completed</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ProgressBar 
            progress={course.progress} 
            color="blue" 
            size="lg" 
            className="mb-4"
          />
          {nextLesson && (
            <Button 
              onClick={() => router.push(`/courses/${course.id}/lessons/${nextLesson.id}`)}
              className="bg-white text-blue-600 hover:bg-blue-50"
              size="lg"
            >
              <Play className="mr-2 h-4 w-4" />
              {course.progress > 0 ? 'Continue Lesson' : 'Start Course'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Roadmap */}
      <div className="relative">
        {/* Progress Line */}
        <div className="roadmap-progress-line">
          <div className={cn("roadmap-progress-fill progress-line-fill", getProgressClass())} />
        </div>

        {/* Lessons */}
        <div className="space-y-6">
          {lessons.map((lesson, index) => {
            const isActive = nextLesson?.id === lesson.id;
            const isAccessible = lesson.isCompleted || isActive || 
              (index === 0) || 
              (index > 0 && lessons[index - 1].isCompleted);

            return (
              <div key={lesson.id} className="relative">
                {/* Connection Node */}
                <div 
                  className={cn(
                    "absolute left-6 w-4 h-4 rounded-full border-4 bg-white z-10 transition-colors",
                    getNodeColor(lesson, isActive)
                  )}
                />

                {/* Lesson Card */}
                <div className="ml-16">
                  <Card 
                    className={cn(
                      "transition-all duration-200 hover:shadow-lg cursor-pointer",
                      getCardColor(lesson, isActive),
                      !isAccessible && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => isAccessible && handleLessonClick(lesson.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {lesson.isCompleted ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : isActive ? (
                              <Play className="h-5 w-5 text-blue-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-400" />
                            )}
                            <CardTitle className="text-lg">{lesson.title}</CardTitle>
                            {isActive && (
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                Siguiente
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{lesson.description}</p>
                        </div>
                        
                        {isAccessible && (
                          <ChevronRight className="h-5 w-5 text-gray-400 ml-2" />
                        )}
                      </div>

                      {/* Lesson Metadata */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDuration(lesson.estimatedDuration)}
                        </div>
                        
                        <span 
                          className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            getDifficultyColor(lesson.difficultyLevel)
                          )}
                        >
                          {getDifficultyText(lesson.difficultyLevel)}
                        </span>

                        <div className="flex items-center gap-2">
                          {lesson.hasVideoContent && (
                            <div className="flex items-center gap-1 text-red-600">
                              <Play className="h-3 w-3" />
                              <span className="text-xs">Video</span>
                            </div>
                          )}
                          {lesson.hasCodeExamples && (
                            <div className="flex items-center gap-1 text-green-600">
                              <Code className="h-3 w-3" />
                              <span className="text-xs">Código</span>
                            </div>
                          )}
                          {lesson.hasQuiz && (
                            <div className="flex items-center gap-1 text-purple-600">
                              <HelpCircle className="h-3 w-3" />
                              <span className="text-xs">Quiz</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar for Active Lesson */}
                      {lesson.progress > 0 && lesson.progress < 100 && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Progreso</span>
                            <span>{lesson.progress}%</span>
                          </div>
                          <ProgressBar 
                            progress={lesson.progress} 
                            color="blue" 
                            size="sm"
                          />
                        </div>
                      )}
                    </CardHeader>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion Badge */}
        {course.progress === 100 && (
          <div className="text-center mt-8">
            <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none inline-block">
              <CardContent className="p-6">
                <Trophy className="h-12 w-12 mx-auto mb-3" />
                <h3 className="text-xl font-bold mb-2">¡Curso Completado!</h3>
                <p className="text-yellow-100">
                  Felicitaciones por completar {course.title}
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <StarRating courseId={course.id} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
