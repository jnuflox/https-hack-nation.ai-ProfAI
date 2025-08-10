'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  Mic,
  Settings,
  Headphones
} from 'lucide-react';
import { audioService, type AudioEnhancedResponse } from '@/lib/audio-service';
import { toast } from 'sonner';

interface AudioControlsProps {
  text: string;
  onAudioStart?: () => void;
  onAudioEnd?: () => void;
  onAudioError?: (error: string) => void;
  className?: string;
  autoplay?: boolean;
  compact?: boolean;
}

export function AudioControls({
  text,
  onAudioStart,
  onAudioEnd,
  onAudioError,
  className = '',
  autoplay = false,
  compact = false
}: AudioControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [rate, setRate] = useState([90]); // 90% speed for education
  const [isAudioSupported, setIsAudioSupported] = useState(false);
  const [currentDuration, setCurrentDuration] = useState<number | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');

  useEffect(() => {
    // Check if audio is supported
    const supported = audioService.isSupported();
    setIsAudioSupported(supported);

    if (supported) {
      // Load available voices
      setTimeout(() => {
        const voices = audioService.getAvailableVoices('en');
        setAvailableVoices(voices);
        
        // Set default voice
        const bestVoice = audioService.getBestEnglishVoice();
        if (bestVoice) {
          setSelectedVoice(bestVoice.name);
        }
      }, 100);
    }

    // Autoplay if requested
    if (autoplay && supported && text.trim()) {
      handlePlay();
    }
  }, [autoplay, text]);

  const handlePlay = async () => {
    if (!text.trim()) {
      toast.error('No text to play');
      return;
    }

    try {
      setIsPlaying(true);
      setIsPaused(false);
      onAudioStart?.();

      const result = await audioService.speakText(text, {
        volume: volume[0] / 100,
        rate: rate[0] / 100,
        voiceName: selectedVoice
      });

      if (result.success) {
        setCurrentDuration(result.duration || null);
        toast.success('Audio reproducido exitosamente');
      } else {
        throw new Error(result.error || 'Error desconocido');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al reproducir audio';
      onAudioError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsPlaying(false);
      setIsPaused(false);
      onAudioEnd?.();
    }
  };

  const handlePause = () => {
    if (isPlaying) {
      audioService.pauseSpeaking();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (isPaused) {
      audioService.resumeSpeaking();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    audioService.stopSpeaking();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentDuration(null);
    onAudioEnd?.();
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
  };

  const handleRateChange = (newRate: number[]) => {
    setRate(newRate);
  };

  const toggleMute = () => {
    if (volume[0] > 0) {
      setVolume([0]);
    } else {
      setVolume([80]);
    }
  };

  if (!isAudioSupported) {
    return (
      <Card className={`${className} border-orange-200 bg-orange-50`}>
        <CardContent className="p-3">
          <div className="flex items-center space-x-2 text-orange-700">
            <VolumeX className="h-4 w-4" />
            <span className="text-sm">Audio not supported in this browser</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button
          onClick={isPlaying ? (isPaused ? handleResume : handlePause) : handlePlay}
          disabled={!text.trim()}
          size="sm"
          variant="outline"
          className="flex items-center space-x-1"
        >
          {isPlaying ? (
            isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />
          ) : (
            <Headphones className="h-3 w-3" />
          )}
          <span className="text-xs">
            {isPlaying ? (isPaused ? 'Resume' : 'Pause') : 'Listen'}
          </span>
        </Button>

        {isPlaying && (
          <Button
            onClick={handleStop}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <Square className="h-3 w-3" />
          </Button>
        )}

        <Button
          onClick={toggleMute}
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
        >
          {volume[0] > 0 ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
        </Button>
      </div>
    );
  }

  return (
    <Card className={`${className} border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Headphones className="h-5 w-5 text-purple-600" />
            <h4 className="font-medium text-gray-900">Audio Control</h4>
            {isPlaying && (
              <Badge className="bg-green-100 text-green-700 border-green-200">
                Playing
              </Badge>
            )}
            {currentDuration && (
              <Badge variant="outline" className="text-xs">
                ~{Math.ceil(currentDuration / 60)}min
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {availableVoices.length > 0 && (
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="text-xs border rounded px-2 py-1 bg-white"
                disabled={isPlaying}
              >
                {availableVoices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name.split(' - ')[0]}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Main controls */}
        <div className="flex items-center space-x-2 mb-3">
          <Button
            onClick={isPlaying ? (isPaused ? handleResume : handlePause) : handlePlay}
            disabled={!text.trim()}
            className="flex items-center space-x-2"
            variant={isPlaying ? "secondary" : "default"}
          >
            {isPlaying ? (
              isPaused ? (
                <>
                  <Play className="h-4 w-4" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4" />
                  <span>Pause</span>
                </>
              )
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Play</span>
              </>
            )}
          </Button>

          {isPlaying && (
            <Button
              onClick={handleStop}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Square className="h-4 w-4" />
              <span>Stop</span>
            </Button>
          )}

          <Button
            onClick={handlePlay}
            variant="ghost"
            disabled={!text.trim() || isPlaying}
            className="flex items-center space-x-1"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Volume and Speed controls */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Button
              onClick={toggleMute}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              {volume[0] > 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Volumen</span>
                <span className="text-xs font-medium">{volume[0]}%</span>
              </div>
              <Slider
                value={volume}
                onValueChange={handleVolumeChange}
                max={100}
                step={5}
                className="w-full"
                disabled={isPlaying}
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Mic className="h-4 w-4 text-gray-400" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Speed</span>
                <span className="text-xs font-medium">{rate[0]}%</span>
              </div>
              <Slider
                value={rate}
                onValueChange={handleRateChange}
                min={50}
                max={150}
                step={10}
                className="w-full"
                disabled={isPlaying}
              />
            </div>
          </div>
        </div>

        {/* Audio status */}
        <div className="mt-3 pt-3 border-t border-purple-100">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>
              {text.split(' ').length} words • {availableVoices.length} voices available
            </span>
            <span className="flex items-center space-x-1">
              <Settings className="h-3 w-3" />
              <span>ProfAI Audio</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Simplified audio button for inline use
export function AudioButton({ 
  text, 
  className = "",
  onStart,
  onEnd,
  onError
}: {
  text: string;
  className?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = async () => {
    if (!audioService.isSupported()) {
      onError?.('Audio not supported');
      return;
    }

    try {
      setIsPlaying(true);
      onStart?.();
      
      const result = await audioService.speakText(text, {
        rate: 0.9,
        volume: 0.8
      });

      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Error de audio');
    } finally {
      setIsPlaying(false);
      onEnd?.();
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isPlaying || !text.trim()}
      variant="ghost"
      size="sm"
      className={`h-8 w-8 p-0 hover:bg-purple-100 ${className}`}
      title="Listen to response"
    >
      {isPlaying ? (
        <div className="animate-pulse">
          <Volume2 className="h-4 w-4 text-purple-600" />
        </div>
      ) : (
        <Headphones className="h-4 w-4 text-gray-500" />
      )}
    </Button>
  );
}
