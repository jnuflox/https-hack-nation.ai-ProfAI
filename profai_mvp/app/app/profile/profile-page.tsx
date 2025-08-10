
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Brain, 
  Save,
  Eye,
  Headphones,
  Hand,
  Zap,
  Settings,
  BarChart3,
  Trophy,
  Target,
  Clock,
  Heart,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  learningStyle: {
    visual: number;
    auditory: number;
    kinesthetic: number;
  };
  skillLevel: {
    theory: string;
    tooling: string;
    prompting: string;
  };
  emotionBaseline: {
    confusion_threshold: number;
    frustration_threshold: number;
    engagement_baseline: number;
  };
  preferences: {
    preferred_format: string;
    language: string;
    pace: string;
    difficulty_preference: string;
  };
  totalLessonsCompleted: number;
  currentStreak: number;
}

export function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        toast.success('Perfil actualizado correctamente');
      } else {
        throw new Error('Error al guardar');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Error al guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const updateProfile = (section: string, field: string, value: any) => {
    if (!profile) return;
    
    setProfile(prev => {
      if (!prev) return null;
      const sectionData = prev[section as keyof UserProfile] as Record<string, any>;
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: value
        }
      };
    });
  };

  const updateDirectField = (field: keyof UserProfile, value: any) => {
    if (!profile) return;
    
    setProfile(prev => ({
      ...prev!,
      [field]: value
    }));
  };

  const getLearningStyleDescription = (style: string) => {
    switch (style) {
      case 'visual': 
        return 'Aprende mejor viendo diagramas, gráficos e imágenes';
      case 'auditory': 
        return 'Aprende mejor escuchando explicaciones y discusiones';
      case 'kinesthetic': 
        return 'Aprende mejor haciendo y experimentando';
      default: 
        return '';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar perfil</h2>
          <Button onClick={fetchProfile} variant="outline">
            Intentar de nuevo
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-blue-100 text-lg mb-4">{profile.email}</p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4" />
                  <span>{profile.totalLessonsCompleted} lecciones completadas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>{profile.currentStreak} días de racha</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'personal', name: 'Datos Personales', icon: User },
            { id: 'learning', name: 'Estilo de Aprendizaje', icon: Brain },
            { id: 'preferences', name: 'Preferencias', icon: Settings },
            { id: 'emotions', name: 'Config. Emocional', icon: Heart }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            {activeTab === 'personal' && (
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>
                    Actualiza tu información básica de perfil
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName || ''}
                        onChange={(e) => updateDirectField('firstName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName || ''}
                        onChange={(e) => updateDirectField('lastName', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">El email no se puede modificar</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Learning Style */}
            {activeTab === 'learning' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="mr-2 h-5 w-5 text-blue-600" />
                      Estilo de Aprendizaje
                    </CardTitle>
                    <CardDescription>
                      ProfAI usa esta información para personalizar tus lecciones
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Visual */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-5 w-5 text-blue-600" />
                        <Label>Visual ({Math.round(profile.learningStyle.visual * 100)}%)</Label>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${profile.learningStyle.visual * 100}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        {getLearningStyleDescription('visual')}
                      </p>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={profile.learningStyle.visual}
                        onChange={(e) => updateProfile('learningStyle', 'visual', parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* Auditory */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Headphones className="h-5 w-5 text-green-600" />
                        <Label>Auditivo ({Math.round(profile.learningStyle.auditory * 100)}%)</Label>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${profile.learningStyle.auditory * 100}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        {getLearningStyleDescription('auditory')}
                      </p>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={profile.learningStyle.auditory}
                        onChange={(e) => updateProfile('learningStyle', 'auditory', parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* Kinesthetic */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Hand className="h-5 w-5 text-purple-600" />
                        <Label>Kinestésico ({Math.round(profile.learningStyle.kinesthetic * 100)}%)</Label>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${profile.learningStyle.kinesthetic * 100}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        {getLearningStyleDescription('kinesthetic')}
                      </p>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={profile.learningStyle.kinesthetic}
                        onChange={(e) => updateProfile('learningStyle', 'kinesthetic', parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Nivel de Experiencia</CardTitle>
                    <CardDescription>
                      Define tu nivel actual en diferentes áreas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Teoría</Label>
                        <Select 
                          value={profile.skillLevel.theory} 
                          onValueChange={(value) => updateProfile('skillLevel', 'theory', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Principiante</SelectItem>
                            <SelectItem value="intermediate">Intermedio</SelectItem>
                            <SelectItem value="advanced">Avanzado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Herramientas</Label>
                        <Select 
                          value={profile.skillLevel.tooling} 
                          onValueChange={(value) => updateProfile('skillLevel', 'tooling', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Principiante</SelectItem>
                            <SelectItem value="intermediate">Intermedio</SelectItem>
                            <SelectItem value="advanced">Avanzado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Prompt Engineering</Label>
                        <Select 
                          value={profile.skillLevel.prompting} 
                          onValueChange={(value) => updateProfile('skillLevel', 'prompting', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Principiante</SelectItem>
                            <SelectItem value="intermediate">Intermedio</SelectItem>
                            <SelectItem value="advanced">Avanzado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Preferences */}
            {activeTab === 'preferences' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5 text-gray-600" />
                    Preferencias de Aprendizaje
                  </CardTitle>
                  <CardDescription>
                    Personaliza cómo ProfAI te presenta el contenido
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Formato Preferido</Label>
                      <Select 
                        value={profile.preferences.preferred_format} 
                        onValueChange={(value) => updateProfile('preferences', 'preferred_format', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="theory">Solo Teoría</SelectItem>
                          <SelectItem value="tooling">Solo Práctica</SelectItem>
                          <SelectItem value="hybrid">Híbrido (Recomendado)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Ritmo de Aprendizaje</Label>
                      <Select 
                        value={profile.preferences.pace} 
                        onValueChange={(value) => updateProfile('preferences', 'pace', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slow">Lento y detallado</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="fast">Rápido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Ajuste de Dificultad</Label>
                      <Select 
                        value={profile.preferences.difficulty_preference} 
                        onValueChange={(value) => updateProfile('preferences', 'difficulty_preference', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fija</SelectItem>
                          <SelectItem value="adaptive">Adaptativa (Recomendado)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Idioma</Label>
                      <Select 
                        value={profile.preferences.language} 
                        onValueChange={(value) => updateProfile('preferences', 'language', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Emotional Settings */}
            {activeTab === 'emotions' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="mr-2 h-5 w-5 text-red-600" />
                    Configuración Emocional
                  </CardTitle>
                  <CardDescription>
                    Ajusta la sensibilidad de ProfAI para detectar tus emociones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Umbral de Confusión ({Math.round(profile.emotionBaseline.confusion_threshold * 100)}%)</Label>
                    <p className="text-sm text-gray-600">
                      Qué tan sensible debe ser el sistema para detectar confusión
                    </p>
                    <input
                      type="range"
                      min="0.3"
                      max="0.9"
                      step="0.1"
                      value={profile.emotionBaseline.confusion_threshold}
                      onChange={(e) => updateProfile('emotionBaseline', 'confusion_threshold', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>Menos sensible</span>
                      <span>Más sensible</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Umbral de Frustración ({Math.round(profile.emotionBaseline.frustration_threshold * 100)}%)</Label>
                    <p className="text-sm text-gray-600">
                      Cuándo debe el sistema intervenir por frustración
                    </p>
                    <input
                      type="range"
                      min="0.3"
                      max="0.9"
                      step="0.1"
                      value={profile.emotionBaseline.frustration_threshold}
                      onChange={(e) => updateProfile('emotionBaseline', 'frustration_threshold', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>Menos sensible</span>
                      <span>Más sensible</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Línea Base de Engagement ({Math.round(profile.emotionBaseline.engagement_baseline * 100)}%)</Label>
                    <p className="text-sm text-gray-600">
                      Nivel mínimo de interés para continuar con contenido avanzado
                    </p>
                    <input
                      type="range"
                      min="0.2"
                      max="0.8"
                      step="0.1"
                      value={profile.emotionBaseline.engagement_baseline}
                      onChange={(e) => updateProfile('emotionBaseline', 'engagement_baseline', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>Menos exigente</span>
                      <span>Más exigente</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Save Button */}
            <Card>
              <CardContent className="p-4">
                <Button 
                  onClick={saveProfile}
                  disabled={saving}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* AI Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-purple-600" />
                  Tu Perfil de IA
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900">Estilo Dominante:</p>
                  <p className="text-blue-700">
                    {profile.learningStyle.visual > profile.learningStyle.auditory && 
                     profile.learningStyle.visual > profile.learningStyle.kinesthetic ? 'Visual' :
                     profile.learningStyle.auditory > profile.learningStyle.kinesthetic ? 'Auditivo' : 'Kinestésico'}
                  </p>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="font-medium text-purple-900">Formato Óptimo:</p>
                  <p className="text-purple-700">
                    {profile.preferences.preferred_format === 'hybrid' ? 'Teoría + Práctica' : 
                     profile.preferences.preferred_format === 'theory' ? 'Solo Teoría' : 'Solo Práctica'}
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-900">Sensibilidad Emocional:</p>
                  <p className="text-green-700">
                    {profile.emotionBaseline.confusion_threshold > 0.7 ? 'Alta' : 
                     profile.emotionBaseline.confusion_threshold > 0.5 ? 'Media' : 'Baja'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Learning Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-green-600" />
                  Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Lecciones:</span>
                  <span className="font-medium">{profile.totalLessonsCompleted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Racha actual:</span>
                  <span className="font-medium">{profile.currentStreak} días</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Nivel promedio:</span>
                  <span className="font-medium">
                    {profile.skillLevel.theory === 'advanced' || 
                     profile.skillLevel.tooling === 'advanced' || 
                     profile.skillLevel.prompting === 'advanced' ? 'Avanzado' :
                     profile.skillLevel.theory === 'intermediate' || 
                     profile.skillLevel.tooling === 'intermediate' || 
                     profile.skillLevel.prompting === 'intermediate' ? 'Intermedio' : 'Principiante'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
