const express = require('express');
const router = express.Router();

router.get('/home', (req, res) => {
  res.json({
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
  });
});

router.get('/trivia', (req, res) => {
  res.json({
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
  });
});

router.get('/gallery', (req, res) => {
  res.json({
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
  });
});

router.get('/games', (req, res) => {
  res.json({
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
      },
      {
        id: "memory",
        title: "Memory Mission",
        description: "Put your memory to the test with spy gadgets!"
      },
      {
        id: "target",
        title: "Target Practice",
        description: "Sharpen your aim like a master assassin!"
      }
    ]
  });
});

module.exports = router;