/**
 * Educational Videos Database for ProfAI
 * Curated collection of high-quality AI/ML educational videos
 */

export interface EducationalVideo {
  videoId: string;
  title: string;
  description: string;
  duration: string;
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  channel: string;
  keywords: string[];
}

export const educationalVideosDB: EducationalVideo[] = [
  // Machine Learning Basics
  {
    videoId: "aircAruvnKk",
    title: "But what is a neural network? | Deep learning, chapter 1",
    description: "Una explicación visual increíble de qué son las redes neuronales y cómo funcionan",
    duration: "19:13",
    topics: ["neural networks", "deep learning", "machine learning"],
    difficulty: "beginner",
    channel: "3Blue1Brown",
    keywords: ["redes neuronales", "neural", "network", "perceptron", "deep learning"]
  },
  {
    videoId: "IHZwWFHWa-w",
    title: "Gradient descent, how neural networks learn | Deep learning, chapter 2",
    description: "Cómo aprenden las redes neuronales usando gradient descent explicado visualmente",
    duration: "21:01",
    topics: ["gradient descent", "backpropagation", "learning"],
    difficulty: "intermediate",
    channel: "3Blue1Brown",
    keywords: ["gradient descent", "backpropagation", "aprendizaje", "optimización"]
  },
  {
    videoId: "Ilg3gGewQ5U",
    title: "What is backpropagation really doing? | Deep learning, chapter 3",
    description: "Una explicación intuitiva de backpropagation y cómo realmente funcionan las redes neuronales",
    duration: "13:54",
    topics: ["backpropagation", "neural networks", "learning"],
    difficulty: "intermediate",
    channel: "3Blue1Brown",
    keywords: ["backpropagation", "propagación", "gradiente", "derivadas"]
  },

  // Python and ML
  {
    videoId: "7eh4d6sabA0",
    title: "Python Machine Learning Tutorial (Data Science)",
    description: "Tutorial completo de Machine Learning con Python, perfecto para principiantes",
    duration: "11:54",
    topics: ["python", "machine learning", "scikit-learn"],
    difficulty: "beginner",
    channel: "Programming with Mosh",
    keywords: ["python", "sklearn", "scikit-learn", "pandas", "numpy", "tutorial"]
  },

  // AI Concepts
  {
    videoId: "ok2s1vD9zi0",
    title: "What is Artificial Intelligence? In 5 minutes",
    description: "Introducción clara y concisa a la inteligencia artificial y sus aplicaciones",
    duration: "5:19",
    topics: ["artificial intelligence", "AI basics", "overview"],
    difficulty: "beginner",
    channel: "AI Explained",
    keywords: ["inteligencia artificial", "AI", "IA", "conceptos básicos", "introducción"]
  },

  // Prompt Engineering
  {
    videoId: "_VjQlb8UV8E",
    title: "Prompt Engineering: The Career of the Future",
    description: "Guía completa sobre prompt engineering y cómo dominar esta habilidad",
    duration: "22:45",
    topics: ["prompt engineering", "AI", "language models"],
    difficulty: "intermediate",
    channel: "All About AI",
    keywords: ["prompt", "engineering", "GPT", "language models", "prompts"]
  },

  // Computer Vision
  {
    videoId: "WxjuSnNQ244",
    title: "Computer Vision Tutorial - Image Recognition with Python",
    description: "Tutorial práctico de visión por computadora con Python y OpenCV",
    duration: "45:32",
    topics: ["computer vision", "image recognition", "python", "opencv"],
    difficulty: "intermediate",
    channel: "Tech With Tim",
    keywords: ["computer vision", "visión", "imagen", "opencv", "reconocimiento"]
  },

  // NLP
  {
    videoId: "CMrHM8a3hqw",
    title: "Natural Language Processing In 10 Minutes",
    description: "Introducción rápida y efectiva al procesamiento de lenguaje natural",
    duration: "10:32",
    topics: ["nlp", "natural language processing", "text analysis"],
    difficulty: "beginner",
    channel: "Simplilearn",
    keywords: ["nlp", "procesamiento", "lenguaje", "texto", "natural"]
  },

  // TensorFlow
  {
    videoId: "tPYj3fFJGjk",
    title: "TensorFlow 2.0 Complete Course - Python Neural Networks for Beginners Tutorial",
    description: "Curso completo de TensorFlow 2.0 desde cero hasta redes neuronales avanzadas",
    duration: "6:52:07",
    topics: ["tensorflow", "deep learning", "python", "neural networks"],
    difficulty: "intermediate",
    channel: "freeCodeCamp.org",
    keywords: ["tensorflow", "keras", "deep learning", "neural networks"]
  }
];

/**
 * Find the best educational video based on user input and context
 */
export function findBestVideo(
  userInput: string, 
  context?: { 
    currentTopic?: string;
    difficulty?: string;
    emotionalState?: string;
  }
): EducationalVideo | null {
  const input = userInput.toLowerCase();
  const topic = context?.currentTopic?.toLowerCase() || '';
  
  // Score each video based on relevance
  const scored = educationalVideosDB.map(video => {
    let score = 0;
    
    // Check keywords in user input
    video.keywords.forEach(keyword => {
      if (input.includes(keyword.toLowerCase())) {
        score += 3;
      }
    });
    
    // Check topics
    video.topics.forEach(videoTopic => {
      if (input.includes(videoTopic.toLowerCase()) || topic.includes(videoTopic.toLowerCase())) {
        score += 2;
      }
    });
    
    // Difficulty matching (prefer easier when confused/frustrated)
    if (context?.emotionalState === 'confused' || context?.emotionalState === 'frustrated') {
      if (video.difficulty === 'beginner') score += 1;
    } else if (context?.emotionalState === 'engaged') {
      if (video.difficulty === 'intermediate' || video.difficulty === 'advanced') score += 1;
    }
    
    // Title relevance
    if (video.title.toLowerCase().includes(input.substring(0, 20))) {
      score += 1;
    }
    
    return { video, score };
  });
  
  // Sort by score and return the best match
  scored.sort((a, b) => b.score - a.score);
  
  return scored[0]?.score > 0 ? scored[0].video : null;
}

/**
 * Get videos by topic
 */
export function getVideosByTopic(topic: string): EducationalVideo[] {
  return educationalVideosDB.filter(video => 
    video.topics.some(t => t.toLowerCase().includes(topic.toLowerCase())) ||
    video.keywords.some(k => k.toLowerCase().includes(topic.toLowerCase()))
  );
}

/**
 * Get random educational video for general learning
 */
export function getRandomEducationalVideo(): EducationalVideo {
  const beginnerVideos = educationalVideosDB.filter(v => v.difficulty === 'beginner');
  return beginnerVideos[Math.floor(Math.random() * beginnerVideos.length)];
}

export default {
  educationalVideosDB,
  findBestVideo,
  getVideosByTopic,
  getRandomEducationalVideo
};
