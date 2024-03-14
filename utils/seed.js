//importing necessary modules
const connection = require("../config/connection");
const { User, Thought } = require("../models");
const {
  getRandomUser,
  getRandomThoughts,
  getRandomReactions,
} = require("./data");
connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("connected");

  // Drop existing collections
  // await connection.db
  //   .dropCollection("users")
  //   .catch((err) =>
  //     console.log("Users collection does not exist or could not be dropped.")
  //   );
  // await connection.db
  //   .dropCollection("thoughts")
  //   .catch((err) =>
  //     console.log("Thoughts collection does not exist or could not be dropped.")
  //   );
  let userCheck = await connection.db.listCollections({ name: 'users' }).toArray();
  if (userCheck.length) {
    await connection.dropCollection('users');
  }

  let thoughtsCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();
  if (thoughtsCheck.length) {
    await connection.dropCollection('thoughts');
  }

  // Create random users
  let userInfo = getRandomUser(5); // Generate 5 random users

  // Create thoughts for each user
  let thoughts = [];
  userInfo.forEach((user) => {
    let randomUsers = getRandomUser(3);
    let userThoughts = getRandomThoughts(2).map((thought) => ({
      thoughtText: thought,
      username: user.username,
      reactions: getRandomReactions(3).map((reaction, index) => {
        let randomUserIndex = index % randomUsers.length;
        let randomUser = randomUsers[randomUserIndex];
        return {
            reactionBody: reaction,
            username: randomUser.username, 
        };
    }),
    }));
    thoughts.push(...userThoughts);
  });

  //inserting thoughts into Thought collection
  if (thoughts.length > 0) {
    await Thought.collection.insertMany(thoughts);
  } else {
    console.log("No thoughts to insert.");
  }

  //inserting userInfo into User collection
  if (userInfo.length > 0) {
    await User.collection.insertMany(userInfo);
  } else {
    console.log("No user to insert.");
  }
  const simpleUser = {
    username: "TestUser",
    email: "testuser@example.com",
  };

  await User.collection.insertOne(simpleUser);

  console.info("Seeding complete! 🌱");
  console.table(userInfo);
  console.table(thoughts);
  process.exit(0);
});
