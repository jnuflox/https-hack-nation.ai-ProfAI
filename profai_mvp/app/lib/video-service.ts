/**
 * Enhanced Video Service for ProfAI
 * Manages YouTube video integration with educational content
 */

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface VideoRecommendation {
  videoId: string;
  title: string;
  description?: string;
  duration?: string;
  thumbnailUrl: string;
  channel?: string;
  relevanceScore?: number;
  embeddable?: boolean;
  educationalValue?: 'high' | 'medium' | 'low';
  difficulty?: Difficulty;
  language?: string;
  publishedAt?: string;
  viewCount?: number;
}

export interface VideoPlaylist {
  id: string;
  title: string;
  description: string;
  videos: VideoRecommendation[];
  topic: string;
  totalDuration?: number;
}

export interface VideoSearchCriteria {
  topic: string;
  difficulty?: Difficulty;
  language?: string;
  maxDuration?: number; // in minutes
  channel?: string;
  excludeChannels?: string[];
  educationalOnly?: boolean;
}

export class VideoService {
  private readonly youtubeApiKey: string | null = null;

  // Educational AI/ML YouTube channels that typically allow embedding
  private readonly trustedEducationalChannels = [
    {
      name: '3Blue1Brown',
      channelId: 'UCYO_jab_esuFRV4b17AJtAw',
      category: 'mathematics',
      quality: 'high',
      embedding: true
    },
    {
      name: 'Two Minute Papers',
      channelId: 'UCbfYPyITQ-7l4upoX8nvctg',
      category: 'ai-research',
      quality: 'high',
      embedding: true
    },
    {
      name: 'Fireship',
      channelId: 'UCsBjURrPoezykLs9EqgamOA',
      category: 'programming',
      quality: 'high',
      embedding: true
    },
    {
      name: 'Computerphile',
      channelId: 'UC9-y-6csu5WGm29I7JiwpnA',
      category: 'computer-science',
      quality: 'high',
      embedding: true
    },
    {
      name: 'Crash Course Computer Science',
      channelId: 'UCsx5g1cECGBhEhBAa8kSJEQ',
      category: 'cs-education',
      quality: 'high',
      embedding: true
    },
    {
      name: 'StatQuest with Josh Starmer',
      channelId: 'UCtYLUTtgS3k1Fg4y5tAhLbw',
      category: 'statistics',
      quality: 'high',
      embedding: true
    },
    {
      name: 'Sentdex',
      channelId: 'UCfzlCWGWYyIQ0aLC5w48gBQ',
      category: 'python-ml',
      quality: 'medium',
      embedding: true
    },
    {
      name: 'Code Bullet',
      channelId: 'UC0e3QhIYukixgh5VVpKHH9Q',
      category: 'ai-programming',
      quality: 'medium',
      embedding: true
    }
  ];

  // Curated educational videos by topic
  private readonly curatedVideoDatabase: Record<string, VideoRecommendation[]> = {
    'machine-learning': [
      {
        videoId: 'ukzFI9rgwfU',
        title: 'Machine Learning Explained',
        description: 'A comprehensive introduction to machine learning concepts',
        thumbnailUrl: 'https://i.ytimg.com/vi/ukzFI9rgwfU/hqdefault.jpg',
        channel: 'Zach Star',
        educationalValue: 'high',
        difficulty: 'beginner',
        embeddable: true,
        language: 'en'
      },
      {
        videoId: 'aircAruvnKk',
        title: 'But what is a Neural Network?',
        description: '3Blue1Brown\'s excellent visual explanation of neural networks',
        thumbnailUrl: 'https://i.ytimg.com/vi/aircAruvnKk/hqdefault.jpg',
        channel: '3Blue1Brown',
        educationalValue: 'high',
        difficulty: 'beginner',
        embeddable: true,
        language: 'en'
      }
    ],
    'neural-networks': [
      {
        videoId: 'aircAruvnKk',
        title: 'But what is a Neural Network?',
        description: 'Visual and intuitive explanation of neural networks',
        thumbnailUrl: 'https://i.ytimg.com/vi/aircAruvnKk/hqdefault.jpg',
        channel: '3Blue1Brown',
        educationalValue: 'high',
        difficulty: 'beginner',
        embeddable: true,
        language: 'en'
      },
      {
        videoId: 'IHZwWFHWa-w',
        title: 'Neural Networks Explained',
        description: 'Comprehensive neural network tutorial',
        thumbnailUrl: 'https://i.ytimg.com/vi/IHZwWFHWa-w/hqdefault.jpg',
        channel: 'Zach Star',
        educationalValue: 'high',
        difficulty: 'intermediate',
        embeddable: true,
        language: 'en'
      }
    ],
    'deep-learning': [
      {
        videoId: 'R9OHn5ZF4Uo',
        title: 'Deep Learning in 5 Minutes',
        description: 'Quick introduction to deep learning concepts',
        thumbnailUrl: 'https://i.ytimg.com/vi/R9OHn5ZF4Uo/hqdefault.jpg',
        channel: 'Siraj Raval',
        educationalValue: 'high',
        difficulty: 'beginner',
        embeddable: true,
        language: 'en'
      }
    ],
    'transformers': [
      {
        videoId: 'kCc8FmEb1nY',
        title: 'Attention is All You Need (Transformer) - Model explanation',
        description: 'Deep dive into transformer architecture',
        thumbnailUrl: 'https://i.ytimg.com/vi/kCc8FmEb1nY/hqdefault.jpg',
        channel: 'The A.I. Hacker - Michael Phi',
        educationalValue: 'high',
        difficulty: 'advanced',
        embeddable: true,
        language: 'en'
      }
    ],
    'prompt-engineering': [
      {
        videoId: 'dOxUroR57xs',
        title: 'Prompt Engineering Guide',
        description: 'Complete guide to effective prompt engineering',
        thumbnailUrl: 'https://i.ytimg.com/vi/dOxUroR57xs/hqdefault.jpg',
        channel: 'AI Explained',
        educationalValue: 'high',
        difficulty: 'intermediate',
        embeddable: true,
        language: 'en'
      }
    ],
    'computer-vision': [
      {
        videoId: 'SPuwxIyRpFI',
        title: 'Computer Vision Explained',
        description: 'Introduction to computer vision and image processing',
        thumbnailUrl: 'https://i.ytimg.com/vi/SPuwxIyRpFI/hqdefault.jpg',
        channel: 'Computerphile',
        educationalValue: 'high',
        difficulty: 'intermediate',
        embeddable: true,
        language: 'en'
      }
    ],
    'nlp': [
      {
        videoId: 'CMrHM8a3hqw',
        title: 'Natural Language Processing Explained',
        description: 'Comprehensive introduction to NLP concepts',
        thumbnailUrl: 'https://i.ytimg.com/vi/CMrHM8a3hqw/hqdefault.jpg',
        channel: 'Computerphile',
        educationalValue: 'high',
        difficulty: 'intermediate',
        embeddable: true,
        language: 'en'
      }
    ]
  };

  constructor(youtubeApiKey?: string) {
    this.youtubeApiKey = youtubeApiKey || process.env.YOUTUBE_API_KEY || null;
  }

  /**
   * Find the most relevant video for a given topic and user context
   */
  findBestVideoForTopic(
    topic: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
    language: string = 'en'
  ): VideoRecommendation | null {
    
    const normalizedTopic = this.normalizeTopic(topic);
    
    // First, try exact match in curated database
    let videos = this.curatedVideoDatabase[normalizedTopic] || [];
    
    // If no exact match, try fuzzy matching
    if (videos.length === 0) {
      videos = this.findVideosByFuzzyMatch(topic);
    }
    
    // Filter by criteria
    const filteredVideos = videos.filter(video => {
      const difficultyMatch = !video.difficulty || 
        this.isDifficultyMatch(video.difficulty, difficulty);
      const languageMatch = !video.language || video.language === language || language === 'any';
      const embeddable = video.embeddable !== false;
      
      return difficultyMatch && languageMatch && embeddable;
    });

    // Sort by relevance and educational value
    const videosCopy = [...filteredVideos];
    const sortedVideos = videosCopy.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a, topic, difficulty);
      const bScore = this.calculateRelevanceScore(b, topic, difficulty);
      return bScore - aScore;
    });

    return sortedVideos[0] || null;
  }

  /**
   * Get multiple video recommendations for a topic (internal implementation)
   */
  getVideoRecommendationsInternal(
    topic: string,
    count: number = 3,
    criteria?: Partial<VideoSearchCriteria>
  ): VideoRecommendation[] {
    const normalizedTopic = this.normalizeTopic(topic);
    let videos = this.curatedVideoDatabase[normalizedTopic] || [];
    
    // Add fuzzy matches
    videos = [...videos, ...this.findVideosByFuzzyMatch(topic)];
    
    // Remove duplicates
    videos = videos.filter((video, index, self) => 
      index === self.findIndex(v => v.videoId === video.videoId)
    );

    // Apply criteria filters
    if (criteria) {
      videos = this.applySearchCriteria(videos, criteria);
    }

    // Sort and limit
    const videosCopy = [...videos];
    const sortedVideos = videosCopy.sort((a, b) => 
      this.calculateRelevanceScore(b, topic, criteria?.difficulty) - 
      this.calculateRelevanceScore(a, topic, criteria?.difficulty)
    );
    
    return sortedVideos.slice(0, count);
  }

  /**
   * Get video recommendations using search criteria object
   */
  async getVideoRecommendationsByCriteria(criteria: VideoSearchCriteria): Promise<VideoRecommendation[]> {
    const topic = criteria.topic;
    const count = 3; // Default count
    
    // Use the existing method with the criteria as third parameter
    return Promise.resolve(this.getVideoRecommendationsInternal(topic, count, criteria));
  }

  /**
   * Get multiple video recommendations for a topic
   */
  getVideoRecommendations(
    topic: string,
    count: number = 3,
    criteria?: Partial<VideoSearchCriteria>
  ): VideoRecommendation[] {
    return this.getVideoRecommendationsInternal(topic, count, criteria);
  }

  /**
   * Create a learning playlist for a topic
   */
  createLearningPlaylist(
    topic: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
  ): VideoPlaylist {
    
    const videos = this.getVideoRecommendations(topic, 5, {
      difficulty,
      educationalOnly: true
    });

    return {
      id: `playlist_${topic}_${difficulty}_${Date.now()}`,
      title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} - ${difficulty} level`,
      description: `Curated learning playlist for ${topic} at ${difficulty} level`,
      videos,
      topic,
      totalDuration: videos.reduce((total, video) => {
        const duration = this.parseDuration(video.duration || '0:00');
        return total + duration;
      }, 0)
    };
  }

  /**
   * Check if a video is embeddable (placeholder for real API check)
   */
  async checkEmbeddable(videoId: string): Promise<boolean> {
    // This would require YouTube API to check oembed endpoint
    // For now, return true for curated videos
    
    const allVideos = Object.values(this.curatedVideoDatabase).flat();
    const video = allVideos.find(v => v.videoId === videoId);
    
    return video?.embeddable !== false;
  }

  /**
   * Get video metadata from YouTube API (if available)
   */
  async getVideoMetadata(videoId: string): Promise<VideoRecommendation | null> {
    if (!this.youtubeApiKey) {
      // Fallback to curated data
      const allVideos = Object.values(this.curatedVideoDatabase).flat();
      return allVideos.find(v => v.videoId === videoId) || null;
    }

    try {
      // YouTube API call would go here
      // For now, return curated data
      const allVideos = Object.values(this.curatedVideoDatabase).flat();
      return allVideos.find(v => v.videoId === videoId) || null;
    } catch (error) {
      console.error('Error fetching video metadata:', error);
      return null;
    }
  }

  /**
   * Generate video embed URL
   */
  getEmbedUrl(videoId: string, options?: {
    autoplay?: boolean;
    start?: number;
    end?: number;
    modestbranding?: boolean;
  }): string {
    const baseUrl = `https://www.youtube.com/embed/${videoId}`;
    const params = new URLSearchParams();
    
    if (options?.autoplay) params.set('autoplay', '1');
    if (options?.start) params.set('start', options.start.toString());
    if (options?.end) params.set('end', options.end.toString());
    if (options?.modestbranding !== false) params.set('modestbranding', '1');
    
    // Educational-friendly defaults
    params.set('rel', '0'); // Don't show related videos
    params.set('fs', '1'); // Allow fullscreen
    params.set('cc_load_policy', '1'); // Show captions when available
    
    return `${baseUrl}?${params.toString()}`;
  }

  // Private helper methods
  private normalizeTopic(topic: string): string {
    return topic.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  }

  private findVideosByFuzzyMatch(topic: string): VideoRecommendation[] {
    const topicLower = topic.toLowerCase();
    const matches: VideoRecommendation[] = [];

    for (const [key, videos] of Object.entries(this.curatedVideoDatabase)) {
      if (key.includes(topicLower) || topicLower.includes(key.replace('-', ' '))) {
        matches.push(...videos);
      }
    }

    return matches;
  }

  private calculateRelevanceScore(
    video: VideoRecommendation, 
    topic: string, 
    difficulty?: string
  ): number {
    let score = 0;

    // Educational value weight
    if (video.educationalValue === 'high') score += 3;
    else if (video.educationalValue === 'medium') score += 2;
    else score += 1;

    // Difficulty match
    if (difficulty && video.difficulty === difficulty) score += 2;

    // Embeddable preference
    if (video.embeddable) score += 1;

    // Trusted channel bonus
    if (this.isTrustedChannel(video.channel)) score += 2;

    // Title relevance (simple keyword matching)
    const titleLower = video.title.toLowerCase();
    const topicLower = topic.toLowerCase();
    if (titleLower.includes(topicLower)) score += 2;

    return score;
  }

  private isDifficultyMatch(
    videoDifficulty: string, 
    requestedDifficulty: string
  ): boolean {
    const levels = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
    const videoLevel = levels[videoDifficulty as keyof typeof levels] || 2;
    const requestedLevel = levels[requestedDifficulty as keyof typeof levels] || 2;
    
    // Allow videos one level up or down
    return Math.abs(videoLevel - requestedLevel) <= 1;
  }

  private applySearchCriteria(
    videos: VideoRecommendation[], 
    criteria: Partial<VideoSearchCriteria>
  ): VideoRecommendation[] {
    return videos.filter(video => {
      if (criteria.difficulty && !this.isDifficultyMatch(video.difficulty || 'intermediate', criteria.difficulty)) {
        return false;
      }
      
      if (criteria.language && video.language && video.language !== criteria.language) {
        return false;
      }
      
      if (criteria.educationalOnly && video.educationalValue === 'low') {
        return false;
      }
      
      if (criteria.excludeChannels && video.channel && criteria.excludeChannels.includes(video.channel)) {
        return false;
      }
      
      return true;
    });
  }

  private isTrustedChannel(channelName?: string): boolean {
    if (!channelName) return false;
    return this.trustedEducationalChannels.some(
      channel => channel.name === channelName
    );
  }

  private parseDuration(duration: string): number {
    // Parse duration string like "5:30" to seconds
    const parts = duration.split(':').reverse();
    let seconds = 0;
    
    parts.forEach((part, index) => {
      seconds += parseInt(part) * Math.pow(60, index);
    });
    
    return seconds;
  }
}

// Create singleton instance
export const videoService = new VideoService();
