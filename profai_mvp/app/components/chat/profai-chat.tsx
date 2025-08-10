'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AudioButton } from '@/components/ui/audio-controls';
import { VideoPlayer } from '@/components/video/video-player';
import { 
  Send, 
  Brain, 
  User, 
  Loader2, 
  AlertCircle,
  Lightbulb,
  Code,
  BookOpen,
  Sparkles,
  Heart,
  MessageSquare,
  Zap,
  Video
} from 'lucide-react';
import { toast } from 'sonner';

// Enhanced message interface with video and audio support
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: string;
  lesson?: any;
  exercise?: any;
  recommendations?: string[];
  emotionalState?: {
    primary_emotion: string;
    confidence: number;
    detected_confusion?: boolean;
  };
  video?: {
    videoId: string;
    title: string;
    thumbnailUrl: string;
    duration?: string;
    description?: string;
  };
  metadata?: {
    emotion?: string;
    confidence?: number;
    nextSteps?: string[];
    userName?: string;
    audioEnabled?: boolean;
    audioSupported?: boolean;
    hasVideo?: boolean;
    topicDetected?: string;
    suggestions?: string[];
    learningPath?: string[];
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
}

export function ProfAIChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeEmotionalState = (content: string): { primary_emotion: string; confidence: number; detected_confusion?: boolean } => {
    const frustrationWords = ['confused', "don't understand", 'difficult', 'complicated', 'help', 'problem', 'error', 'failure'];
    const curiosityWords = ['how', 'why', 'when', 'where', 'what', 'interesting', 'want to know', 'explain'];
    const excitementWords = ['great', 'incredible', 'fantastic', 'I like', 'perfect', 'excellent', 'wow'];
    const anxietyWords = ['nervous', 'worried', 'stress', 'anxiety', 'fear', 'insecure'];
    
    const contentLower = content.toLowerCase();
    let emotion = 'neutral';
    let confidence = 0.5;
    let detected_confusion = false;
    
    if (frustrationWords.some(word => contentLower.includes(word))) {
      emotion = 'frustration';
      confidence = 0.8;
      detected_confusion = true;
    } else if (anxietyWords.some(word => contentLower.includes(word))) {
      emotion = 'anxiety';
      confidence = 0.7;
    } else if (curiosityWords.some(word => contentLower.includes(word))) {
      emotion = 'curiosity';
      confidence = 0.7;
    } else if (excitementWords.some(word => contentLower.includes(word))) {
      emotion = 'excitement';
      confidence = 0.8;
    }
    
    if (contentLower.includes('?')) {
      if (emotion === 'neutral') {
        emotion = 'curiosity';
        confidence = 0.6;
      }
    }
    
    return { primary_emotion: emotion, confidence, detected_confusion };
  };

  const generateSuggestions = (messages: Message[]): string[] => {
    if (messages.length === 0) return [];
    
    const lastMessage = messages[messages.length - 1];
    const suggestionsSet: string[] = [];
    
    if (lastMessage.emotionalState?.primary_emotion === 'frustration') {
      suggestionsSet.push('Can you explain it in a simpler way?');
      suggestionsSet.push('Could you give a practical example?');
      suggestionsSet.push('Is there a video that can help me?');
    } else if (lastMessage.emotionalState?.primary_emotion === 'curiosity') {
      suggestionsSet.push('What else should I know about this?');
      suggestionsSet.push('What is the next step?');
      suggestionsSet.push('Do you have exercises to practice?');
    }
    
    if (lastMessage.content.toLowerCase().includes('code') || lastMessage.content.toLowerCase().includes('program')) {
      suggestionsSet.push('Can you show me the complete code?');
      suggestionsSet.push('How can I test it?');
    }
    
    return suggestionsSet.slice(0, 3);
  };

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${session?.user?.firstName || 'student'}! 👋 I'm ProfAI, your personal AI professor.

🧠 **Advanced Features Available:**
✨ **Intelligent emotional detection** - I adapt my responses according to your state
🎥 **Automatic educational videos** - I show you visual content when you need it
🔊 **Interactive audio** - Listen to explanations when you're frustrated
📚 **Contextual suggestions** - I guide you with intelligent questions

**What would you like to start with?**`,
      timestamp: new Date(),
      metadata: {
        userName: session?.user?.firstName || 'student',
        audioEnabled: true,
        audioSupported: true,
        suggestions: [
          'What is Machine Learning?',
          'I want to learn Deep Learning',
          'Show me a code example'
        ]
      }
    };
    
    setMessages([welcomeMessage]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const extractTopic = (text: string) => {
    const topics = ['machine learning', 'deep learning', 'neural networks', 'ai', 'nlp', 'computer vision', 'python', 'tensorflow'];
    return topics.find(topic => text.toLowerCase().includes(topic)) || '';
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
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          conversationId,
          action: 'enhanced_chat',
          context: {
            currentTopic: extractTopic(currentInput),
            userName: session?.user?.firstName || 'student',
            emotionalState: userMessage.emotionalState?.primary_emotion,
            previousMessages: messages.slice(-5)
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      if (data.success) {
        setConversationId(data.conversationId);
        
        const assistantMessage: Message = {
          id: Date.now().toString() + '_assistant',
          role: 'assistant',
          content: data.data.message || data.data.text || data.data.content || 'Sorry, I could not generate an appropriate response.',
          timestamp: new Date(),
          type: data.data.type,
          lesson: data.data.lesson,
          exercise: data.data.exercise,
          recommendations: data.data.recommendations,
          video: data.data.video,
          metadata: {
            ...data.data.metadata,
            audioEnabled: data.data.metadata?.audioEnabled || false,
            audioSupported: data.data.metadata?.audioSupported || false,
            hasVideo: !!data.data.video,
            topicDetected: data.data.metadata?.topicDetected,
            suggestions: data.data.suggestions || data.data.followUpQuestions
          }
        };

        setMessages(prev => [...prev, assistantMessage]);
        
        const newSuggestions = generateSuggestions([...messages, assistantMessage]);
        setSuggestions(newSuggestions);

      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: Date.now().toString() + '_error',
        role: 'assistant',
        content: 'Sorry, I had a problem processing your message. Could you try rephrasing it?',
        timestamp: new Date(),
        metadata: { emotion: 'apologetic', confidence: 1.0 }
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Chat error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const getEmotionIcon = (emotion?: string) => {
    switch (emotion) {
      case 'confused': 
      case 'frustration': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'frustrated': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'engaged':
      case 'curiosity': return <Lightbulb className="h-4 w-4 text-green-500" />;
      case 'excitement': return <Sparkles className="h-4 w-4 text-purple-500" />;
      case 'anxiety': return <Heart className="h-4 w-4 text-red-400" />;
      default: return null;
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-gray-400';
    if (confidence >= 0.8) return 'text-green-500';
    if (confidence >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Enhanced Header */}
        <div className="flex-shrink-0 border-b bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  ProfAI Enhanced
                </h1>
                <p className="text-sm text-gray-600">Your AI professor with advanced features</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <Video className="h-3 w-3 mr-1" />
                Video
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Heart className="h-3 w-3 mr-1" />
                Emotions
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <MessageSquare className="h-3 w-3 mr-1" />
                Audio
              </Badge>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white ml-2' 
                    : 'bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white mr-2'
                }`}>
                  {message.role === 'user' ? <User className="h-4 w-4" /> : <Brain className="h-4 w-4" />}
                </div>
                
                <Card className={`${message.role === 'user' ? 'bg-gradient-to-r from-blue-50 to-purple-50' : 'bg-white'} shadow-sm`}>
                  <CardContent className="p-4">
                    {/* Emotional State Indicator */}
                    {message.emotionalState && (
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                        <div className="flex items-center space-x-2">
                          {getEmotionIcon(message.emotionalState.primary_emotion)}
                          <span className="text-xs text-gray-500 capitalize">
                            {message.emotionalState.primary_emotion}
                          </span>
                        </div>
                        <span className={`text-xs ${getConfidenceColor(message.emotionalState.confidence)}`}>
                          {Math.round(message.emotionalState.confidence * 100)}%
                        </span>
                      </div>
                    )}

                    <div className="prose prose-sm max-w-none">
                      {message.content.split('\n').map((line, index) => (
                        <p key={`${message.id}-line-${index}`} className="mb-2 last:mb-0">{line}</p>
                      ))}
                    </div>

                    {/* Video Content */}
                    {message.video && (
                      <div className="mt-4">
                        <VideoPlayer
                          video={message.video}
                        />
                      </div>
                    )}

                    {/* Audio Controls */}
                    {message.role === 'assistant' && message.metadata?.audioSupported && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <AudioButton
                          text={message.content}
                          className="w-full"
                        />
                      </div>
                    )}

                    {/* Lesson Content */}
                    {message.lesson && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <BookOpen className="h-4 w-4 text-blue-600 mr-2" />
                          <span className="font-medium text-blue-800">Lesson</span>
                        </div>
                        <p className="text-sm text-blue-700">{message.lesson.title}</p>
                      </div>
                    )}

                    {/* Exercise Content */}
                    {message.exercise && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Code className="h-4 w-4 text-green-600 mr-2" />
                          <span className="font-medium text-green-800">Exercise</span>
                        </div>
                        <p className="text-sm text-green-700">{message.exercise.description}</p>
                      </div>
                    )}

                    {/* Recommendations */}
                    {message.recommendations && message.recommendations.length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center mb-2">
                          <Lightbulb className="h-4 w-4 text-yellow-600 mr-2" />
                          <span className="font-medium text-yellow-800">Recommendations</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1">
                          {message.recommendations.map((rec, index) => (
                            <li key={`${message.id}-rec-${index}`} className="text-sm text-gray-600">{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Metadata Suggestions */}
                    {message.metadata?.suggestions && message.metadata.suggestions.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.metadata.suggestions.map((suggestion, index) => (
                            <Button
                              key={`${message.id}-sug-${index}`}
                              variant="outline"
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.metadata?.hasVideo && (
                        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                          <Video className="h-3 w-3 mr-1" />
                          Video
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white flex items-center justify-center">
                  <Brain className="h-4 w-4" />
                </div>
                <Card className="bg-white shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                      <span className="text-sm text-gray-600">ProfAI is thinking...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Quick Actions */}
        {suggestions.length > 0 && (
          <div className="flex-shrink-0 px-4 py-2 border-t bg-gray-50">
            <div className="flex items-center space-x-2 overflow-x-auto">
              <Zap className="h-4 w-4 text-purple-600 flex-shrink-0" />
              {suggestions.map((suggestion, index) => (
                <Button
                  key={`suggestion-${index}-${suggestion.slice(0, 10)}`}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap text-xs h-8 bg-white hover:bg-purple-50 border-purple-200"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex-shrink-0 border-t p-4 bg-white">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Write your question about AI..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
