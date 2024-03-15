//importing necessary modules 
const connection = require("../config/connection");
const { User, Thought } = require("../models");
const { getRandomUser, getRandomThoughts, getRandomReactions } = require("./data");

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("connected");

  // Drop existing Users and Thoughts collections if they exist
  const collections = await connection.db.listCollections().toArray();
  const collectionNames = collections.map(col => col.name);
  if (collectionNames.includes('users')) await connection.db.dropCollection('users');
  if (collectionNames.includes('thoughts')) await connection.db.dropCollection('thoughts');

  // Create random users
  const userInfo = getRandomUser(5); 
  
  // Insert Users into the User collection
  const users = await User.insertMany(userInfo);

  // Map over inserted users to create thoughts
  for (const user of users) {
    const userThoughts = getRandomThoughts(2).map((thought) => ({
      thoughtText: thought,
      //after inserting, user has _id field 
      username: user.username, 
      reactions: getRandomReactions(2).map(reaction => ({
        reactionBody: reaction,
        username: getRandomUser(1)[0].username, 
      })),
    }));

    // Insert Thoughts into the Thought collection
    const insertedThoughts = await Thought.insertMany(userThoughts);

    // Update User document with the inserted Thought IDs
    await User.findByIdAndUpdate(user._id, {
      $set: { thoughts: insertedThoughts.map(thought => thought._id) }
    }, { new: true });
  }

  console.info("Seeding complete! 🌱");
  process.exit(0);
});
