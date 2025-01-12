export interface HomeContent {
  hero: {
    title: string;
    description: string;
    image: string;
  };
  sections: Array<{
    title: string;
    content: string;
    image?: string;
  }>;
}

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
}

export interface ForumPost {
  id: number;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  replies: number;
}

export interface FanArt {
  id: number;
  author: string;
  image: string;
  title: string;
  likes: number;
}