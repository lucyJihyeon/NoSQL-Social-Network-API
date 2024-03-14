const { ObjectId } = require("mongoose").Types;
const { Thought, User, reactionSchema } = require("../models");

module.exports = {
  //Get all the users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
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
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
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
    } catch (err) {
      res.status(500).json(err);
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
          { $set: { username: req.body.username } }
        );
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error updating user", error: error.message });
    }
  },
};
