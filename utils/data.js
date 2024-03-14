//user info
const randomUsers = [
  { username: "Elena", email: "elena@example.com" },
  { username: "Marco", email: "marco@example.net" },
  { username: "Julia", email: "julia@example.org" },
  { username: "Liam", email: "liam@example.com" },
  { username: "Sophia", email: "sophia@example.net" },
];

// Thoughts
const randomThoughts = [
  "Sometimes the most productive thing you can do is relax.",
  "In a world where you can be anything, be kind.",
  "Dreams don't work unless you do.",
  "Every moment is a fresh beginning.",
  "Change the world by being yourself.",
  "Simplicity is the ultimate sophistication.",
  "Whatever you do, do it well.",
  "What we think, we become.",
  "All limitations are self-imposed.",
  "Tough times never last but tough people do.",
];

// Reactions
const randomReactions = [
  "Loved this!",
  "So true!",
  "This made my day.",
  "I needed to hear this.",
  "Absolutely agree!",
  "Inspirational.",
  "This is hilarious 😂",
  "Mind blown 🤯",
  "Couldn't agree more.",
  "This is everything.",
];

// Get a random item from an array
const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Function to generate random thoughts
const getRandomThoughts = (int) => {
  const results = [];
  for (let i = 0; i < int; i++) {
    results.push(getRandomArrItem(randomThoughts));
  }
  return results;
};

// Function to generate random reactions
const getRandomReactions = (int) => {
  const results = [];
  for (let i = 0; i < int; i++) {
    results.push(getRandomArrItem(randomReactions));
  }
  return results;
};

const getRandomUser = (int) => {
  const results = [];
  for (let i = 0; i < int; i++) {
    results.push(getRandomArrItem(randomUsers));
  }
  return results
};

// Export the functions for use in seed.js
module.exports = {
  getRandomThoughts,
  getRandomReactions,
  getRandomUser,
};
