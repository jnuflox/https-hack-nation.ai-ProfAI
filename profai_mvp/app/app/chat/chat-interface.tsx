
'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Brain, 
  User, 
  Loader2, 
  AlertCircle,
  Lightbulb,
  Sparkles,
  Code,
  BookOpen,
  HelpCircle,
  Trophy,
  Video
} from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emotionalState?: {
    primary_emotion: string;
    confidence: number;
    detected_confusion?: boolean;
  };
  type?: 'learning_session' | 'help_response' | 'exercise_evaluation' | 'reformulation';
  lesson?: any;
  exercise?: any;
  recommendations?: string[];
}

export function ChatInterface() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId] = useState<string | null>(null);
  const [chatMode, setChatMode] = useState<'chat' | 'lesson' | 'exercise'>('chat');
  const [currentTopic] = useState<string>('');
  const [lessonContext, setLessonContext] = useState<{
    courseId?: string;
    lessonId?: string;
    prompt?: string;
    courseComplete?: boolean;
    consolidatedData?: any;
    video?: {
      url: string;
      title: string;
      duration?: number;
    };
  }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check URL parameters for lesson context
    const courseId = searchParams.get('course');
    const lessonId = searchParams.get('lesson');
    const autoload = searchParams.get('autoload');
    const courseComplete = searchParams.get('courseComplete');
    const consolidate = searchParams.get('consolidate');
    const videoUrl = searchParams.get('video');
    
    if (courseComplete && consolidate === 'true') {
      // Handle course completion scenario
      setLessonContext({ courseId: courseComplete, courseComplete: true });
      setChatMode('lesson');
      
      if (autoload === 'true') {
        loadConsolidatedCourse(courseComplete, lessonId || '');
      } else {
        initializeChat();
      }
    } else if (courseId && lessonId) {
      const context = { courseId, lessonId };
      
      // Add video if present in URL or load from API
      if (videoUrl) {
        loadLessonVideo(courseId, lessonId).then((videoData: any) => {
          setLessonContext(prev => ({ 
            ...prev, 
            ...context,
            video: videoData 
          }));
        });
      } else {
        setLessonContext(context);
      }
      setChatMode('lesson');
      
      if (autoload === 'true') {
        loadLessonPrompt(courseId, lessonId);
      } else {
        initializeChat();
      }
    } else {
      initializeChat();
    }
  }, [searchParams]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadLessonPrompt = async (courseId: string, lessonId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}/prompt`);
      if (response.ok) {
        const data = await response.json();
        setLessonContext(prev => ({ ...prev, prompt: data.data.prompt }));
        
        // Initialize chat with lesson-specific context
        initializeLessonChat(data.data);
      } else {
        toast.error('Error loading lesson prompt');
        initializeChat();
      }
    } catch (error) {
      console.error('Error loading lesson prompt:', error);
      toast.error('Error loading lesson context');
      initializeChat();
    }
  };

  const loadLessonVideo = async (courseId: string, lessonId: string): Promise<any> => {
    try {
      const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}/video`);
      if (response.ok) {
        const data = await response.json();
        if (data.data?.hasVideo) {
          return {
            url: data.data.videoUrl,
            title: data.data.videoTitle,
            duration: data.data.videoDuration
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error loading lesson video:', error);
      return null;
    }
  };

  const loadConsolidatedCourse = async (courseId: string, triggeredByLessonId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/consolidate`);
      if (response.ok) {
        const data = await response.json();
        setLessonContext(prev => ({ 
          ...prev, 
          consolidatedData: data.data,
          courseComplete: true,
          prompt: data.data.consolidatedPrompt 
        }));
        
        // Initialize chat with consolidated course context
        initializeConsolidatedChat(data.data, triggeredByLessonId);
      } else {
        toast.error('Error loading consolidated course content');
        initializeChat();
      }
    } catch (error) {
      console.error('Error loading consolidated course:', error);
      toast.error('Error loading consolidated content');
      initializeChat();
    }
  };

  const initializeLessonChat = (lessonData: any) => {
    const hasVideo = lessonContext.video && lessonContext.video.url;
    
    const welcomeMessage: Message = {
      id: 'lesson-welcome',
      role: 'assistant',
      content: `Perfect! I've loaded the specific context for your lesson. 🎯

I'm prepared with detailed information about this lesson, including:
• Specific learning objectives
• Contextualized content
• Available multimedia resources
• Practical examples

${hasVideo ? `🎥 **Educational video available**: ${lessonContext.video?.title}` : ''}
${lessonData.metadata?.hasCode ? '💻 This lesson includes code examples' : ''}
${lessonData.metadata?.hasQuiz ? '❓ This lesson includes an interactive quiz' : ''}

Which specific part of the lesson would you like us to start with?`,
      timestamp: new Date(),
      type: 'learning_session'
    };
    setMessages([welcomeMessage]);
  };

  const initializeConsolidatedChat = (consolidatedData: any, triggeredByLessonId: string) => {
    const welcomeMessage: Message = {
      id: 'course-complete-welcome',
      role: 'assistant',
      content: `🎉 AMAZING! You have completed the course "${consolidatedData.courseName}"

This is a special consolidation session where we'll review all your learning:

📚 **Consolidated Content:**
• ${consolidatedData.lessons.length} lessons completed
• ${consolidatedData.totalDuration} minutes of content mastered
• Concepts connected in an integral experience

🎬 **Educational Video Included:**
I've prepared a specialized educational video that reinforces all the course concepts.

🎯 **What shall we do now?**
I can help you:
• Review any concept from the course
• Connect all lessons in a coherent narrative  
• Propose practical projects with what you've learned
• Suggest next steps in your AI journey

What aspect of the course did you find most fascinating? Is there something specific you'd like to explore more deeply?

*[Educational video available in the side panel]*`,
      timestamp: new Date(),
      type: 'learning_session'
    };
    setMessages([welcomeMessage]);
  };

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${session?.user?.firstName || 'student'}! 👋 

I'm your personal AI professor with emotional intelligence. I'm here to help you learn and answer any questions you have.

I can:
• Explain AI concepts in an adaptive way
• Detect if you feel confused and adjust my explanations
• Help you with code and practical exercises
• Recommend personalized resources

What would you like me to help you with today?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const analyzeEmotionalState = (text: string) => {
    // Basic emotional analysis based on keywords
    const confusionKeywords = ["don't understand", 'confused', 'confusing', "don't get it", 'difficult', 'complicated'];
    const frustrationKeywords = ['frustrated', 'annoyed', 'angry', "doesn't work", 'error'];
    const curiosityKeywords = ['interesting', 'want to know', "I'd like", 'how', 'why', 'which'];
    
    const lowerText = text.toLowerCase();
    
    let primary_emotion = 'neutral';
    let confidence = 0.5;
    let detected_confusion = false;

    if (confusionKeywords.some(keyword => lowerText.includes(keyword))) {
      primary_emotion = 'confusion';
      confidence = 0.8;
      detected_confusion = true;
    } else if (frustrationKeywords.some(keyword => lowerText.includes(keyword))) {
      primary_emotion = 'frustration';
      confidence = 0.7;
    } else if (curiosityKeywords.some(keyword => lowerText.includes(keyword))) {
      primary_emotion = 'curiosity';
      confidence = 0.6;
    }

    return { primary_emotion, confidence, detected_confusion };
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      emotionalState: analyzeEmotionalState(input)
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversationId: currentConversationId,
          emotionalState: userMessage.emotionalState,
          action: 'enhanced_chat', // Always use enhanced chat
          context: {
            userName: session?.user?.firstName || 'student',
            previousMessages: messages.slice(-5), // últimos 5 mensajes para contexto
            ...(lessonContext.prompt && {
              lessonPrompt: lessonContext.prompt,
              lessonId: lessonContext.lessonId,
              courseId: lessonContext.courseId,
              isLessonMode: true
            }),
            chatMode,
            currentTopic
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      // Crear mensaje del asistente para ir actualizando
      const assistantMessageId = Date.now().toString() + '_assistant';
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      let buffer = '';
      let partialRead = '';
      
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        
        partialRead += decoder.decode(value, { stream: true });
        let lines = partialRead.split('\n');
        partialRead = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return;
            }
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.choices?.[0]?.delta?.content) {
                buffer += parsed.choices[0].delta.content;
                
                // Actualizar el mensaje del asistente con el contenido acumulado
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMessageId 
                    ? { ...msg, content: buffer }
                    : msg
                ));
              }
            } catch (parseError) {
              // Skip invalid JSON chunks
              console.warn('Invalid JSON chunk:', parseError);
            }
          }
        }
      }
      
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      toast.error('Failed to send message. Please try again.');
      
      // Mostrar mensaje de error
      const errorMessage: Message = {
        id: Date.now().toString() + '_error',
        role: 'assistant',
        content: 'Sorry, an error occurred. Could you try your question again?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getEmotionIcon = (emotion?: string) => {
    switch (emotion) {
      case 'confusion': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'frustration': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'curiosity': return <Lightbulb className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)]">
        <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
          {/* Chat Header */}
          <div className="border-b p-4 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    ProfAI - Your AI Professor
                    {chatMode === 'lesson' && lessonContext.courseComplete && (
                      <Badge variant="default" className="ml-2 bg-green-600">
                        <Trophy className="h-3 w-3 mr-1" />
                        Course Completed
                      </Badge>
                    )}
                    {chatMode === 'lesson' && !lessonContext.courseComplete && (
                      <Badge variant="secondary" className="ml-2">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Lesson Mode
                      </Badge>
                    )}
                  </h2>
                  <p className="text-sm text-gray-500 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    {chatMode === 'lesson' && lessonContext.courseComplete ? (
                      <>🎓 Consolidation session • Complete course content + Educational video</>
                    ) : chatMode === 'lesson' && lessonContext.courseId && lessonContext.lessonId ? (
                      <>Specific lesson context loaded • Personalized prompt active</>
                    ) : (
                      <>Ready to detect emotions and adapt explanations</>
                    )}
                  </p>
                </div>
              </div>
              
              {/* Course Context Info */}
              {chatMode === 'lesson' && lessonContext.courseComplete && lessonContext.consolidatedData && (
                <div className="text-right">
                  <div className="text-xs text-gray-600 mb-1">
                    🎓 {lessonContext.consolidatedData.courseName}
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    {lessonContext.consolidatedData.lessons.length} lessons • {lessonContext.consolidatedData.totalDuration} min
                  </div>
                  <div className="text-xs text-blue-600 flex items-center justify-end mt-1">
                    <Video className="h-3 w-3 mr-1" />
                    Educational video available
                  </div>
                </div>
              )}
              
              {/* Lesson Context Info */}
              {chatMode === 'lesson' && !lessonContext.courseComplete && lessonContext.courseId && (
                <div className="text-right">
                  <div className="text-xs text-gray-600 mb-1">
                    Course: {lessonContext.courseId.replace('course-', '').replace('-', ' ')}
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    Lesson: {lessonContext.lessonId?.replace('lesson-', '').replace('-', ' ')}
                  </div>
                  {lessonContext.video?.url && (
                    <div className="text-xs text-green-600 flex items-center justify-end">
                      <Video className="h-3 w-3 mr-1" />
                      Video available
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex space-x-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Brain className="h-5 w-5 text-purple-600" />
                    )}
                  </div>
                  
                  {/* Message Content */}
                  <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-4 rounded-lg max-w-full ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                    </div>
                    
                    <div className={`flex items-center mt-1 text-xs text-gray-500 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.emotionalState && getEmotionIcon(message.emotionalState.primary_emotion)}
                      <span className="ml-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.emotionalState?.detected_confusion && (
                        <span className="ml-2 text-yellow-600 text-xs">Confusion detected</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex space-x-3 max-w-3xl">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Brain className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block p-4 rounded-lg bg-gray-100">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                        <span className="text-sm text-gray-600">Prof is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Video Section for Lessons */}
          {chatMode === 'lesson' && lessonContext.video?.url && (
            <div className="border-t bg-gray-50 p-4">
              <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <Video className="h-5 w-5 mr-2 text-blue-600" />
                      Educational Video
                    </h3>
                    {lessonContext.video.duration && (
                      <span className="text-sm text-gray-500">
                        {Math.floor(lessonContext.video.duration / 60)} min
                      </span>
                    )}
                  </div>
                  
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      src={lessonContext.video.url}
                      title={lessonContext.video.title || 'Educational video'}
                      className="w-full h-full border-0"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                  
                  {lessonContext.video.title && (
                    <p className="mt-2 text-sm text-gray-600">
                      {lessonContext.video.title}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t p-4 bg-gray-50">
            {/* Quick Actions for Lesson Mode */}
            {chatMode === 'lesson' && lessonContext.prompt && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInput("Explain the main concept of this lesson")}
                    className="text-xs"
                  >
                    <BookOpen className="h-3 w-3 mr-1" />
                    Main concept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInput("Give me practical examples")}
                    className="text-xs"
                  >
                    <Lightbulb className="h-3 w-3 mr-1" />
                    Practical examples
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInput("I don't understand this part, can you simplify?")}
                    className="text-xs"
                  >
                    <HelpCircle className="h-3 w-3 mr-1" />
                    Simplify
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInput("Is there example code for this?")}
                    className="text-xs"
                  >
                    <Code className="h-3 w-3 mr-1" />
                    View code
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex space-x-3">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about AI... I can detect if you're confused 😊"
                className="flex-1 focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Quick suggestions */}
            <div className="flex items-center mt-2 space-x-2 text-xs text-gray-500">
              <Sparkles className="h-3 w-3" />
              <span>Try asking:</span>
              <button 
                onClick={() => setInput('What is machine learning?')}
                className="text-blue-600 hover:underline"
              >
                What is ML?
              </button>
              <span>•</span>
              <button 
                onClick={() => setInput("I don't understand neural networks")}
                className="text-blue-600 hover:underline"
              >
                Explain neural networks
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
