const { ObjectId } = require("mongoose").Types;
const { Thought, User } = require("../models");

module.exports = {
  //Get all the users
  async getUsers(req, res) {
    try {
      const users = await User.find().select("-__v");
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting users" });
    }
  },
  //Get a single user by its id
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        //excluding __v
        .select("-__v");
      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting a user" });
    }
  },
  //create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating a user" });
    }
  },
  // Delete a user and associated thoughts
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: "User and associated thoughts deleted!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting a user" });
    }
  },
  
  // Update a user and associated thoughts
  async updateUser(req, res) {
    try {
      const ogUser = await User.findOne({ _id: req.params.userId });
      if (!ogUser) {
        return res.status(404).json({ message: "No user found with this id!" });
      }
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        //replace user info with value in the request body
        { $set: req.body },
        { runValidators: true, new: true }
      );

      // If the username was updated, reflect this change in the user's thoughts
      if (req.body.username && ogUser.username !== req.body.username) {
        await Thought.updateMany(
          { username: ogUser.username },
          { $set: { username: req.body.username } },
          //return the updated data and run validator
          { runValidators: true, new: true }
        );
        // Update username in reactions within thoughts where the reaction's username matches the old username
        await Thought.updateMany(
          { "reactions.username": ogUser.username },
          { $set: { "reactions.$.username": req.body.username } },
          { runValidators: true, new: true }
        );
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating user" });
    }
  },
  // Add a friend
  // /api/users/:userId/friends/:friendId
  async addfriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true, runValidators: true }
      );
      if (!user) {
        return res.status(404).json({ message: "No user found with this ID" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error adding a friend" });
    }
  },
  // Deleted a friend
  async deletefriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "No user found with this ID" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting a friend" });
    }
  },
};
