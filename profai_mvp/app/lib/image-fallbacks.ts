// Image fallback utility for handling failed image loads
// This provides stable placeholder images when Unsplash images fail

export const FALLBACK_IMAGES = {
  'machine-learning': '/images/courses/ml-fallback.svg',
  'prompt-engineering': '/images/courses/prompt-fallback.svg',
  'deep-learning': '/images/courses/dl-fallback.svg',
  'nlp': '/images/courses/nlp-fallback.svg',
  'ai-ethics': '/images/courses/ethics-fallback.svg',
  'default': '/images/courses/default-fallback.svg'
};

export const STABLE_UNSPLASH_IMAGES = {
  'machine-learning': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop&crop=center&auto=format&q=75',
  'prompt-engineering': 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=400&h=200&fit=crop&crop=center&auto=format&q=75',
  'deep-learning': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop&crop=center&auto=format&q=75',
  'nlp': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop&crop=center&auto=format&q=75',
  'ai-ethics': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop&crop=center&auto=format&q=75',
  'default': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=200&fit=crop&crop=center&auto=format&q=75'
};

// Create SVG placeholder
export function createPlaceholderSVG(text: string, width = 400, height = 200): string {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad1)"/>
      <text x="50%" y="50%" text-anchor="middle" dy="0.3em" 
            font-family="system-ui, -apple-system, sans-serif" 
            font-size="16" font-weight="600" fill="white">
        ${text}
      </text>
    </svg>
  `)}`;
}

// Get image URL with fallback handling
export function getImageWithFallback(courseId: string, categoryHint?: string): string {
  const categoryMap: { [key: string]: keyof typeof STABLE_UNSPLASH_IMAGES } = {
    'course-ml-fundamentals': 'machine-learning',
    'course-prompt-engineering': 'prompt-engineering', 
    'course-deep-learning': 'deep-learning',
    'course-nlp-basics': 'nlp',
    'course-ai-ethics': 'ai-ethics'
  };

  const category = categoryMap[courseId] || categoryHint || 'default';
  return STABLE_UNSPLASH_IMAGES[category] || STABLE_UNSPLASH_IMAGES.default;
}

// Image error handler
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement>, fallbackText: string) {
  const img = event.currentTarget;
  const placeholder = createPlaceholderSVG(fallbackText);
  img.src = placeholder;
  img.onerror = null; // Prevent infinite loop
}
