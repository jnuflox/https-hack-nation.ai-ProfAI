'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  BookOpen, 
  Wrench, 
  FlaskConical,
  RefreshCw,
  Star,
  Calendar,
  ExternalLink,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface CurriculumUpdatesProps {
  className?: string;
}

export function CurriculumUpdates({ className }: CurriculumUpdatesProps) {
  const [updates, setUpdates] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/curriculum-updates?category=${selectedCategory}`);
      const result = await response.json();
      
      if (result.success) {
        setUpdates(result.data);
        setLastUpdated(new Date());
        
        if (result.isDemoMode) {
          toast.info('Mostrando datos de demostración de actualizaciones del currículum');
        } else {
          toast.success('Actualizaciones del currículum cargadas');
        }
      }
    } catch (error) {
      toast.error('Error al cargar actualizaciones');
      console.error('Updates fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/curriculum-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'trigger_update' })
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('Actualización del currículum iniciada');
        await fetchUpdates();
      }
    } catch (error) {
      toast.error('Error al activar actualización');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !updates) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando actualizaciones del currículum...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Actualizaciones del Currículum
          </CardTitle>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-xs text-gray-500">
                Actualizado: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <Button 
              onClick={triggerUpdate} 
              disabled={isLoading}
              size="sm"
              variant="outline"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {updates && (
          <Tabs defaultValue="trends" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="trends">Tendencias</TabsTrigger>
              <TabsTrigger value="tools">Herramientas</TabsTrigger>
              <TabsTrigger value="research">Investigación</TabsTrigger>
              <TabsTrigger value="courses">Cursos</TabsTrigger>
            </TabsList>

            <TabsContent value="trends" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Últimas Tendencias en IA</h3>
                <Badge variant="secondary">
                  {updates.trends?.length || 0} actualizaciones
                </Badge>
              </div>
              
              {updates.trends?.map((trend: any, index: number) => (
                <Card key={trend.id || index} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-lg">{trend.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          trend.importance === 'critical' ? 'destructive' :
                          trend.importance === 'high' ? 'default' :
                          'secondary'
                        }>
                          {trend.importance}
                        </Badge>
                        {trend.growthRate && (
                          <Badge variant="outline" className="text-green-600">
                            {trend.growthRate}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {trend.description}
                    </p>
                    
                    {trend.keywords && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {trend.keywords.map((keyword: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {trend.suggestedCurriculumChanges && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <h5 className="font-medium text-sm mb-2">Cambios sugeridos al currículum:</h5>
                        <ul className="text-xs space-y-1">
                          {trend.suggestedCurriculumChanges.map((change: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <ChevronRight className="h-3 w-3 mt-0.5 text-blue-600" />
                              {change}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                      <span>Fuentes: {trend.sources?.join(', ')}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(trend.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="tools" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Nuevas Herramientas</h3>
                <Badge variant="secondary">
                  {updates.tools?.length || 0} herramientas
                </Badge>
              </div>
              
              {updates.tools?.map((tool: any, index: number) => (
                <Card key={tool.id || index} className="border-l-4 border-l-green-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-lg flex items-center gap-2">
                          <Wrench className="h-4 w-4" />
                          {tool.name}
                        </h4>
                        <p className="text-sm text-gray-500">{tool.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {tool.stars && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {tool.stars.toLocaleString()}
                          </Badge>
                        )}
                        <Badge variant={
                          tool.trend === 'rising' ? 'default' : 'secondary'
                        }>
                          {tool.trend}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {tool.description}
                    </p>
                    
                    {tool.curriculumIntegration && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <h5 className="font-medium text-sm mb-2">Integración al currículum:</h5>
                        <div className="text-xs space-y-2">
                          <p><strong>Lecciones sugeridas:</strong> {tool.curriculumIntegration.suggestedLessons?.join(', ')}</p>
                          <p><strong>Dificultad:</strong> {tool.curriculumIntegration.difficulty}</p>
                          <p><strong>Prerequisitos:</strong> {tool.curriculumIntegration.prerequisites?.join(', ')}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-xs text-gray-500">
                        Relevante para: {tool.relevantFor?.join(', ')}
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={tool.documentation} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Docs
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="research" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Última Investigación</h3>
                <Badge variant="secondary">
                  {updates.research?.length || 0} papers
                </Badge>
              </div>
              
              {updates.research?.map((paper: any, index: number) => (
                <Card key={paper.id || index} className="border-l-4 border-l-purple-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-lg flex items-center gap-2">
                        <FlaskConical className="h-4 w-4" />
                        {paper.title}
                      </h4>
                      <Badge variant="outline">
                        Score: {paper.relevanceScore}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-2">
                      Por {paper.authors?.join(', ')} • {paper.source}
                    </p>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {paper.abstract}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {paper.keywords?.map((keyword: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    
                    {paper.curriculumRelevance && (
                      <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                        <h5 className="font-medium text-sm mb-2">Relevancia curricular:</h5>
                        <div className="text-xs space-y-1">
                          <p><strong>Temas:</strong> {paper.curriculumRelevance.topics?.join(', ')}</p>
                          <p><strong>Integración:</strong> {paper.curriculumRelevance.suggestedIntegration}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                      <span>{paper.citations} citaciones</span>
                      <span>{new Date(paper.publishedDate).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="courses" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Actualizaciones de Cursos</h3>
                <Badge variant="secondary">
                  {updates.courses?.length || 0} actualizaciones
                </Badge>
              </div>
              
              {updates.courses?.map((update: any, index: number) => (
                <Card key={update.id || index} className="border-l-4 border-l-orange-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-lg flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        {update.courseId}
                      </h4>
                      <Badge variant={
                        update.priority === 'high' ? 'destructive' :
                        update.priority === 'medium' ? 'default' :
                        'secondary'
                      }>
                        {update.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {update.description}
                    </p>
                    
                    {update.changes && (
                      <div className="mb-3">
                        <h5 className="font-medium text-sm mb-2">Cambios:</h5>
                        <ul className="text-sm space-y-1">
                          {update.changes.map((change: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <ChevronRight className="h-3 w-3 mt-0.5 text-orange-600" />
                              {change}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm"><strong>Impacto estimado:</strong> {update.estimatedImpact}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
