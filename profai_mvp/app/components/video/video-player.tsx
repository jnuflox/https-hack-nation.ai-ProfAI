'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, ExternalLink, Clock, Eye, Minimize, Maximize, RotateCcw } from 'lucide-react';

interface VideoPlayerProps {
  video?: {
    videoId: string;
    title: string;
    thumbnailUrl?: string;
    duration?: string;
    description?: string;
  };
  onVideoComplete?: () => void;
  onVideoStart?: () => void;
  autoplay?: boolean;
  className?: string;
}

export function VideoPlayer({ 
  video, 
  onVideoComplete, 
  onVideoStart,
  autoplay = false,
  className = ""
}: Readonly<VideoPlayerProps>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Safe access to video properties with defaults
  const safeTitle = video?.title || 'Video sin título';
  const safeDescription = video?.description || '';
  const safeDuration = video?.duration || '';
  const safeVideoId = video?.videoId || '';
  
  const thumbnailUrl = video?.thumbnailUrl || `https://i.ytimg.com/vi/${safeVideoId}/hqdefault.jpg`;
  const youtubeUrl = `https://youtube.com/watch?v=${safeVideoId}`;
  
  // Enhanced embed URL with educational parameters
  const embedUrl = `https://youtube.com/embed/${safeVideoId}?` + new URLSearchParams({
    rel: '0',                    // Don't show related videos
    modestbranding: '1',         // Minimal YouTube branding
    fs: '1',                     // Allow fullscreen
    cc_load_policy: '1',         // Show captions when available
    iv_load_policy: '3',         // Hide annotations
    playsinline: '1',            // Play inline on mobile
    enablejsapi: '1',            // Enable JS API for events
    origin: typeof window !== 'undefined' ? window.location.origin : '',
    ...(autoplay && { autoplay: '1' })
  }).toString();

  useEffect(() => {
    if (autoplay && !isExpanded && safeVideoId) {
      setIsExpanded(true);
    }
  }, [autoplay, isExpanded, safeVideoId]);

  useEffect(() => {
    // Listen for YouTube API events if needed
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;
      
      if (event.data && typeof event.data === 'string') {
        try {
          const data = JSON.parse(event.data);
          if (data.event === 'video-progress') {
            // Handle video progress events
          } else if (data.event === 'video-ended') {
            onVideoComplete?.();
          } else if (data.event === 'video-started') {
            onVideoStart?.();
          }
        } catch (e) {
          // Ignore non-JSON messages - this is expected for some iframe messages
          console.debug('Non-JSON message received from iframe:', e);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onVideoComplete, onVideoStart]);
  
  // Safety check: return early if video is undefined or missing essential data
  if (!video?.videoId) {
    return (
      <Card className={`overflow-hidden border-2 border-gray-200 ${className}`}>
        <CardContent className="p-4 text-center">
          <div className="text-gray-500 mb-2">
            <Play className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="font-medium">Video no disponible</p>
            <p className="text-sm text-gray-400 mt-1">No se proporcionaron datos del video</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handlePlayClick = () => {
    setIsLoading(true);
    setIsExpanded(true);
    onVideoStart?.();
    
    // Simulate loading delay
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleMinimize = () => {
    setIsExpanded(false);
    setIsFullscreen(false);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleRestart = () => {
    if (iframeRef.current) {
      // Reload iframe to restart video
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }
      }, 100);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="225" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy="0.3em" font-family="system-ui" font-size="14" fill="#6b7280">
          Video no disponible
        </text>
      </svg>
    `)}`;
  };

  if (hasError && !isExpanded) {
    return (
      <Card className={`overflow-hidden border-2 border-red-100 ${className}`}>
        <CardContent className="p-4 text-center">
          <div className="text-red-600 mb-2">
            <Play className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="font-medium">Video no disponible</p>
            <p className="text-sm text-gray-600 mt-1">{safeTitle}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(youtubeUrl, '_blank')}
            className="flex items-center space-x-1 mx-auto"
          >
            <ExternalLink className="h-3 w-3" />
            <span>Ver en YouTube</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''} ${className}`}>
      {!isExpanded ? (
        // Thumbnail view with enhanced UI
        <Card className="overflow-hidden border-2 border-purple-100 hover:border-purple-300 transition-all duration-200 hover:shadow-lg">
          <CardContent className="p-0">
            <div className="relative group">
              <img 
                src={thumbnailUrl}
                alt={safeTitle}
                className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  onClick={handlePlayClick}
                  disabled={isLoading}
                  className="bg-white/90 hover:bg-white text-gray-900 rounded-full w-16 h-16 flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </Button>
              </div>
              
              {/* Enhanced badges */}
              <div className="absolute top-2 left-2">
                <Badge className="bg-purple-600 text-white shadow-sm">
                  <Eye className="h-3 w-3 mr-1" />
                  Educativo
                </Badge>
              </div>
              
              {safeDuration && (
                <Badge className="absolute bottom-2 right-2 bg-black/80 text-white border-0 shadow-sm">
                  <Clock className="h-3 w-3 mr-1" />
                  {safeDuration}
                </Badge>
              )}
            </div>
            
            <div className="p-4 bg-gradient-to-b from-white to-purple-50/20">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-5">
                {safeTitle}
              </h3>
              {safeDescription && (
                <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-4">
                  {safeDescription}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handlePlayClick}
                  disabled={isLoading}
                  className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Play className="h-3 w-3" />
                  <span>Ver Aquí</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(youtubeUrl, '_blank')}
                  className="flex items-center space-x-1 text-gray-600 hover:text-purple-600"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>YouTube</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Enhanced video player with controls
        <Card className={`overflow-hidden border-2 border-purple-200 ${isFullscreen ? 'h-full' : ''}`}>
          <CardContent className="p-0">
            {/* Player controls bar */}
            <div className="bg-gray-900 text-white p-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className="bg-purple-600 text-white border-0">
                  <Play className="h-3 w-3 mr-1" />
                  En reproducción
                </Badge>
                <span className="text-sm font-medium truncate max-w-xs">
                  {safeTitle}
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRestart}
                  className="text-white hover:bg-white/10 h-8 w-8 p-0"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFullscreen}
                  className="text-white hover:bg-white/10 h-8 w-8 p-0"
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMinimize}
                  className="text-white hover:bg-white/10 h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Video iframe */}
            <div className={`${isFullscreen ? 'h-full' : 'aspect-video'} w-full bg-black`}>
              <iframe
                ref={iframeRef}
                src={embedUrl}
                title={safeTitle}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => setIsLoading(false)}
                onError={() => setHasError(true)}
              />
            </div>
            
            {/* Video info footer */}
            {!isFullscreen && (
              <div className="p-4 bg-gray-50 border-t">
                <div className="flex items-start justify-between">
                  <div className="flex-1 mr-4">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      {safeTitle}
                    </h4>
                    {safeDescription && (
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {safeDescription}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(youtubeUrl, '_blank')}
                      className="flex items-center space-x-1 text-xs"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Abrir</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Export default
export default VideoPlayer;
