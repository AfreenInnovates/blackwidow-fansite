import api from './api';
import { HomeContent, TriviaQuestion, GalleryImage, Game, ForumPost, FanArt } from './models';

// Description: Get home page content
// Endpoint: GET /api/content/home
// Request: {}
// Response: HomeContent
export const getHomeContent = async (): Promise<HomeContent> => {
  try {
    const data = await api.get('/api/content/home');
    return data;
  } catch (error) {
    console.error('Error fetching home content:', error);
    // Return mock data as fallback
    return {
      hero: {
        title: "Welcome to Black Widow Fan Club",
        description: "Join us in celebrating the legacy of Natasha Romanoff",
        image: "/images/hero.jpg"
      },
      sections: [
        {
          title: "The Ultimate Spy",
          content: "From the Red Room to the Avengers, follow Natasha's journey.",
          image: "/images/section1.jpg"
        },
        {
          title: "More Than a Hero",
          content: "Discover the sacrifices and choices that made Black Widow legendary.",
          image: "/images/section2.jpg"
        }
      ]
    };
  }
};

// Description: Get trivia questions
// Endpoint: GET /api/content/trivia
// Request: {}
// Response: { questions: TriviaQuestion[] }
export const getTriviaQuestions = async (): Promise<{ questions: TriviaQuestion[] }> => {
  try {
    const data = await api.get('/api/content/trivia');
    return data;
  } catch (error) {
    console.error('Error fetching trivia questions:', error);
    return {
      questions: [
        {
          id: "1",
          question: "What is Black Widow's real name?",
          options: ["Natalie Rushman", "Natasha Romanoff", "Yelena Belova", "Nancy Roberts"],
          correctAnswer: 1
        },
        {
          id: "2",
          question: "Where was Black Widow trained?",
          options: ["The Red Room", "SHIELD Academy", "Hydra Base", "Xavier's School"],
          correctAnswer: 0
        }
      ]
    };
  }
};

// Description: Get gallery images
// Endpoint: GET /api/content/gallery
// Request: {}
// Response: { images: GalleryImage[] }
export const getGalleryImages = async (): Promise<{ images: GalleryImage[] }> => {
  try {
    const data = await api.get('/api/content/gallery');
    return data;
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return {
      images: [
        {
          id: "1",
          url: "/images/gallery/1.jpg",
          title: "Iron Man 2 Debut",
          description: "Black Widow's first MCU appearance"
        },
        {
          id: "2",
          url: "/images/gallery/2.jpg",
          title: "Vormir Sacrifice",
          description: "The ultimate sacrifice for the Soul Stone"
        }
      ]
    };
  }
};

// Description: Get available games
// Endpoint: GET /api/content/games
// Request: {}
// Response: { games: Game[] }
export const getGames = async (): Promise<{ games: Game[] }> => {
  try {
    const data = await api.get('/api/content/games');
    return data;
  } catch (error) {
    console.error('Error fetching games:', error);
    return {
      games: [
        {
          id: "stealth",
          title: "Stealth Mission",
          description: "Navigate through enemy territory like a master spy!"
        },
        {
          id: "reflex",
          title: "Spy Reflexes",
          description: "Test your reaction speed like a trained spy!"
        }
      ]
    };
  }
};

// Description: Get forum posts
// Endpoint: GET /api/community/posts
// Request: {}
// Response: { posts: ForumPost[] }
export const getForumPosts = async (): Promise<{ posts: ForumPost[] }> => {
  try {
    const data = await api.get('/api/community/posts');
    return data;
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    return {
      posts: [
        {
          id: 1,
          author: "BlackWidowFan",
          avatar: "/images/avatars/1.jpg",
          content: "Just rewatched the Budapest scene for the 100th time! 🕷️",
          likes: 42,
          replies: 15
        },
        {
          id: 2,
          author: "MarvelExpert",
          avatar: "/images/avatars/2.jpg",
          content: "What's your favorite Black Widow fight scene?",
          likes: 38,
          replies: 24
        }
      ]
    };
  }
};

// Description: Get fan art
// Endpoint: GET /api/community/fan-art
// Request: {}
// Response: { artworks: FanArt[] }
export const getFanArt = async (): Promise<{ artworks: FanArt[] }> => {
  try {
    const data = await api.get('/api/community/fan-art');
    return data;
  } catch (error) {
    console.error('Error fetching fan art:', error);
    return {
      artworks: [
        {
          id: 1,
          author: "ArtistSupreme",
          image: "/images/fan-art/1.jpg",
          title: "Black Widow in Action",
          likes: 156
        },
        {
          id: 2,
          author: "CreativeSpirit",
          image: "/images/fan-art/2.jpg",
          title: "Natasha's Legacy",
          likes: 203
        }
      ]
    };
  }
};