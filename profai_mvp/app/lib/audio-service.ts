/**
 * Audio Service for ProfAI
 * Handles text-to-speech functionality using Web Speech API and optional external services
 */

interface VoiceOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  language?: string;
  voiceName?: string;
}

interface AudioResponse {
  success: boolean;
  audioUrl?: string;
  duration?: number;
  error?: string;
}

export class AudioService {
  private synthesis: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      this.initializeVoices();
    }
  }

  private async initializeVoices(): Promise<void> {
    if (!this.synthesis) return;

    // Load available voices
    const loadVoices = () => {
      this.voices = this.synthesis!.getVoices();
      this.isInitialized = true;
    };

    if (this.synthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      this.synthesis.onvoiceschanged = loadVoices;
    }
  }

  /**
   * Get available voices for the specified language
   */
  getAvailableVoices(language: string = 'en-US'): SpeechSynthesisVoice[] {
    return this.voices.filter(voice => 
      voice.lang.startsWith(language.substring(0, 2))
    );
  }

  /**
   * Get the best voice for English (ProfAI's default language)
   */
  getBestEnglishVoice(): SpeechSynthesisVoice | null {
    // Prefer specific English voices
    const englishVoices = this.getAvailableVoices('en');
    
    // Priority order for English voices
    const preferredNames = [
      'Google US English',
      'Microsoft Zira - English (United States)',
      'Microsoft David - English (United States)',
      'Alex',
      'Samantha',
      'Victoria'
    ];

    for (const preferred of preferredNames) {
      const voice = englishVoices.find(v => v.name.includes(preferred));
      if (voice) return voice;
    }

    // Fallback to any English voice
    return englishVoices[0] || null;
  }

  /**
   * Convert text to speech using Web Speech API
   */
  async speakText(
    text: string, 
    options: VoiceOptions = {}
  ): Promise<AudioResponse> {
    if (!this.synthesis) {
      return { success: false, error: 'Speech synthesis not supported' };
    }

    // Clean text for better speech
    const cleanText = this.cleanTextForSpeech(text);

    return new Promise((resolve) => {
      try {
        // Stop any current speech
        this.stopSpeaking();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        // Set voice options
        const voice = options.voiceName 
          ? this.voices.find(v => v.name === options.voiceName)
          : this.getBestEnglishVoice();

        if (voice) utterance.voice = voice;
        
        utterance.rate = options.rate || 0.9; // Slightly slower for education
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 0.8;
        utterance.lang = options.language || 'en-US';

        // Event handlers
        utterance.onstart = () => {
          this.currentUtterance = utterance;
        };

        utterance.onend = () => {
          this.currentUtterance = null;
          resolve({ 
            success: true, 
            duration: this.estimateDuration(cleanText) 
          });
        };

        utterance.onerror = (event) => {
          this.currentUtterance = null;
          resolve({ 
            success: false, 
            error: `Speech error: ${event.error}` 
          });
        };

        // Start speaking
        this.synthesis.speak(utterance);

      } catch (error) {
        resolve({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    });
  }

  /**
   * Stop current speech
   */
  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.currentUtterance = null;
    }
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return this.synthesis ? this.synthesis.speaking : false;
  }

  /**
   * Pause current speech
   */
  pauseSpeaking(): void {
    if (this.synthesis && this.synthesis.speaking) {
      this.synthesis.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resumeSpeaking(): void {
    if (this.synthesis && this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  /**
   * Clean text for better speech synthesis
   */
  private cleanTextForSpeech(text: string): string {
    return text
      // Remove markdown formatting
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1')     // Italic
      .replace(/`(.*?)`/g, '$1')       // Code
      .replace(/#{1,6}\s*(.*)/g, '$1') // Headers
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
      // Remove emojis (basic)
      .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
      // Clean up extra spaces and breaks
      .replace(/\n\s*\n/g, '. ')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Estimate speech duration in seconds
   */
  private estimateDuration(text: string): number {
    // Average speaking rate: ~150 words per minute for educational content
    const wordsPerMinute = 130; // Slower for AI education
    const wordCount = text.split(/\s+/).length;
    return Math.ceil((wordCount / wordsPerMinute) * 60);
  }

  /**
   * Generate audio using external TTS service (fallback/enhancement)
   */
  async generateAudioWithExternalService(
    text: string,
    voice: string = 'es-ES-Standard-A'
  ): Promise<AudioResponse> {
    // This would integrate with services like Google Cloud TTS, Azure Cognitive Services, etc.
    // For now, we'll return a placeholder
    
    try {
      // Placeholder for external TTS integration
      // Could integrate with Google Cloud TTS, Azure, AWS Polly, etc.
      
      return { 
        success: false, 
        error: 'External TTS service not configured' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'External TTS error' 
      };
    }
  }

  /**
   * Check if audio features are supported
   */
  isSupported(): boolean {
    return this.synthesis !== null;
  }

  /**
   * Get debug information about audio capabilities
   */
  getDebugInfo(): any {
    return {
      isSupported: this.isSupported(),
      isInitialized: this.isInitialized,
      voicesCount: this.voices.length,
      currentlySpeaking: this.isSpeaking(),
      availableEnglishVoices: this.getAvailableVoices('en').map(v => ({
        name: v.name,
        lang: v.lang,
        default: v.default
      }))
    };
  }
}

// Create singleton instance
export const audioService = new AudioService();

// Audio-enhanced response interface
export interface AudioEnhancedResponse {
  text: string;
  audio?: {
    enabled: boolean;
    duration?: number;
    voice?: string;
    isPlaying?: boolean;
  };
  suggestions?: string[];
  metadata?: any;
}
