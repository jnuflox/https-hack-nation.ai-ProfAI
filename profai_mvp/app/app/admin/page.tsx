'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings,
  TrendingUp,
  Users,
  Code2,
  BookOpen,
  Activity,
  BarChart3,
  Zap,
  RefreshCw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

import { CodePlayground } from '@/components/practice/code-playground';
import { CurriculumUpdates } from '@/components/curriculum/curriculum-updates';
import { CommunityIntegration } from '@/components/community/community-integration';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('practice');

  const stats = [
    {
      title: 'Usuarios Activos',
      value: '1,247',
      change: '+12%',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Ejercicios Completados',
      value: '8,543',
      change: '+23%',
      icon: Code2,
      trend: 'up'
    },
    {
      title: 'Actualizaciones Curriculares',
      value: '15',
      change: '+3 nuevas',
      icon: BookOpen,
      trend: 'up'
    },
    {
      title: 'Discusiones Comunitarias',
      value: '234',
      change: '+18%',
      icon: Users,
      trend: 'up'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              ProfAI Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Administra las nuevas funcionalidades de Practice + Feedback, Community Integration y Curriculum Updates
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-green-600">
              ● Sistema Operativo
            </Badge>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Actualizar Todo
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className={`text-sm ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    stat.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <stat.icon className={`h-6 w-6 ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              Practice + Feedback
            </TabsTrigger>
            <TabsTrigger value="curriculum" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Curriculum Updates
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Community Integration
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Practice + Feedback Loop */}
          <TabsContent value="practice" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Practice + Feedback Loop Demo
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Prueba el sistema de retroalimentación instantánea para estudiantes
                  </p>
                </CardHeader>
                <CardContent>
                  <CodePlayground
                    exerciseId="demo-exercise-1"
                    initialCode="// Escribe tu código aquí para probarlo\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log(fibonacci(10));"
                    language="javascript"
                    difficulty="intermediate"
                  />
                </CardContent>
              </Card>

              {/* Features Overview */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Funcionalidades Implementadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Feedback instantáneo en código</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Análisis de código en tiempo real</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Pistas contextuales adaptivas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Ejecución segura de código</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Sugerencias de mejora</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      Métricas de Uso
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Código analizado hoy:</span>
                      <Badge variant="secondary">1,234 snippets</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Feedback generado:</span>
                      <Badge variant="secondary">892 respuestas</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pistas solicitadas:</span>
                      <Badge variant="secondary">567 requests</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Satisfacción promedio:</span>
                      <Badge variant="default">4.7/5</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Curriculum Updates */}
          <TabsContent value="curriculum" className="space-y-6">
            <CurriculumUpdates />
          </TabsContent>

          {/* Community Integration */}
          <TabsContent value="community" className="space-y-6">
            <CommunityIntegration />
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Analytics General
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Practice Analytics */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Code2 className="h-4 w-4" />
                        Practice + Feedback
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Código ejecutado:</span>
                          <span className="font-medium">2,345</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Análisis realizados:</span>
                          <span className="font-medium">1,876</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Mejoras sugeridas:</span>
                          <span className="font-medium">3,421</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tiempo promedio:</span>
                          <span className="font-medium">0.8s</span>
                        </div>
                      </div>
                    </div>

                    {/* Curriculum Analytics */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Curriculum Updates
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Actualizaciones detectadas:</span>
                          <span className="font-medium">47</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Contenido actualizado:</span>
                          <span className="font-medium">23 lecciones</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Nuevas herramientas:</span>
                          <span className="font-medium">8</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Papers relevantes:</span>
                          <span className="font-medium">15</span>
                        </div>
                      </div>
                    </div>

                    {/* Community Analytics */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Community Integration
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Discusiones activas:</span>
                          <span className="font-medium">234</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Contenido compartido:</span>
                          <span className="font-medium">156</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Participantes únicos:</span>
                          <span className="font-medium">892</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Engagement rate:</span>
                          <span className="font-medium">73%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Estado del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Servicios</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">API Practice Feedback</span>
                          <Badge variant="default" className="text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Operacional
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Curriculum Updates</span>
                          <Badge variant="default" className="text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Operacional
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Community Integration</span>
                          <Badge variant="default" className="text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Operacional
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Hack-Nation Webhook</span>
                          <Badge variant="secondary" className="text-yellow-600">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Demo Mode
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Rendimiento</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Tiempo de respuesta API:</span>
                          <span className="font-medium">0.3s</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Disponibilidad:</span>
                          <span className="font-medium">99.9%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Requests por minuto:</span>
                          <span className="font-medium">1,247</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Error rate:</span>
                          <span className="font-medium">0.1%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
