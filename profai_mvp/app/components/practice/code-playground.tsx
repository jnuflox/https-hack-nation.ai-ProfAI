'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Lightbulb, 
  MessageSquare, 
  Share2, 
  Code, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface CodePlaygroundProps {
  exerciseId?: string;
  initialCode?: string;
  language?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export function CodePlayground({ 
  exerciseId, 
  initialCode = '', 
  language = 'javascript',
  difficulty = 'intermediate' 
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [explanation, setExplanation] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [hints, setHints] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [output, setOutput] = useState<any>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [code]);

  // Get instant feedback as user types
  const getInstantFeedback = async () => {
    if (!code.trim()) return;
    
    try {
      const response = await fetch('/api/practice-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_instant_feedback',
          code,
          explanation,
          language
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setFeedback(result.data);
      }
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  // Analyze code for patterns and best practices
  const analyzeCode = async () => {
    if (!code.trim()) {
      toast.error('Escribe algo de código primero');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/practice-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze_code',
          code,
          language
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setAnalysis(result.data);
        toast.success('¡Análisis de código completado!');
      }
    } catch (error) {
      toast.error('Error al analizar código');
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run code safely
  const runCode = async () => {
    if (!code.trim()) {
      toast.error('Escribe algo de código primero');
      return;
    }

    setIsRunning(true);
    try {
      const response = await fetch('/api/practice-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'run_code',
          code,
          language
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setOutput(result.data);
        toast.success('Código ejecutado');
      }
    } catch (error) {
      toast.error('Error al ejecutar código');
      console.error('Execution error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // Get contextual hints
  const getHints = async () => {
    try {
      const response = await fetch('/api/practice-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_hints',
          code,
          exerciseId,
          difficulty
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setHints(result.data);
      }
    } catch (error) {
      console.error('Hints error:', error);
    }
  };

  // Share to community
  const shareToComm = async () => {
    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'share_content',
          content: {
            title: `Mi solución para ${exerciseId || 'ejercicio de práctica'}`,
            code,
            explanation,
            language,
            type: 'code_solution'
          }
        })
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('¡Compartido en la comunidad Hack-Nation! 🚀');
      }
    } catch (error) {
      toast.error('Error al compartir');
      console.error('Share error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Interactive Code Editor
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{language}</Badge>
              <Badge variant={
                difficulty === 'beginner' ? 'default' : 
                difficulty === 'intermediate' ? 'secondary' : 
                'destructive'
              }>
                {difficulty}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Code Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Tu código:
            </label>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onBlur={getInstantFeedback}
              placeholder={`Escribe tu código en ${language} aquí...`}
              className="w-full min-h-[200px] p-4 font-mono text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>

          {/* Explanation Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Explica tu enfoque (opcional):
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explica tu razonamiento, qué problema resuelves y cómo..."
              className="w-full min-h-[80px] p-3 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={runCode} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Ejecutar
            </Button>
            
            <Button 
              onClick={analyzeCode} 
              disabled={isAnalyzing}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              Analizar
            </Button>
            
            <Button 
              onClick={getHints} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              Pistas
            </Button>
            
            <Button 
              onClick={shareToComm} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Compartir
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Tabs */}
      {(feedback || analysis || hints || output) && (
        <Tabs defaultValue="feedback" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="analysis">Análisis</TabsTrigger>
            <TabsTrigger value="hints">Pistas</TabsTrigger>
            <TabsTrigger value="output">Ejecución</TabsTrigger>
          </TabsList>
          
          <TabsContent value="feedback">
            {feedback && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Retroalimentación Instantánea
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      feedback.overall === 'excellent' ? 'default' :
                      feedback.overall === 'good' ? 'secondary' :
                      'destructive'
                    }>
                      {feedback.overall}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Puntuación: {feedback.score}/100
                    </span>
                  </div>
                  
                  {feedback.strengths.length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-2 font-medium text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        Fortalezas:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm ml-6">
                        {feedback.strengths.map((strength: string, index: number) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {feedback.improvements.length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-2 font-medium text-orange-700">
                        <AlertCircle className="h-4 w-4" />
                        Áreas de mejora:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm ml-6">
                        {feedback.improvements.map((improvement: string, index: number) => (
                          <li key={index}>{improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">{feedback.encouragement}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="analysis">
            {analysis && (
              <Card>
                <CardHeader>
                  <CardTitle>Análisis de Código</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium">Complejidad:</span>
                      <Badge className="ml-2">{analysis.complexity}</Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Legibilidad:</span>
                      <Badge className="ml-2">{analysis.readability}</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium">Puntuación:</span>
                    <span className="ml-2 text-lg font-bold text-blue-600">{analysis.score}/100</span>
                  </div>
                  
                  {analysis.suggestions.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Sugerencias:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {analysis.suggestions.map((suggestion: string, index: number) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="hints">
            {hints && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Pistas Contextuales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hints.immediate.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Pistas inmediatas:</h4>
                      <ul className="space-y-2">
                        {hints.immediate.map((hint: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span>💡</span>
                            <span>{hint}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {hints.conceptual.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Pistas conceptuales:</h4>
                      <ul className="space-y-2">
                        {hints.conceptual.map((hint: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span>🧠</span>
                            <span>{hint}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">
                      Próximo paso: {hints.nextStep}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="output">
            {output && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Resultado de Ejecución
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
                    <pre>{output.output}</pre>
                    {output.errors.length > 0 && (
                      <div className="text-red-400 mt-2">
                        {output.errors.join('\n')}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Tiempo: {output.executionTime}</span>
                    <span>Memoria: {output.memoryUsage}</span>
                  </div>
                  {output.message && (
                    <div className="mt-2 p-2 bg-yellow-50 rounded text-sm text-yellow-800">
                      {output.message}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
