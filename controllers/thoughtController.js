const { ObjectId } = require("mongoose").Types;
const { Thought, User } = require("../models");

module.exports = {
  //Get all the thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find().select("-__v");
      res.json(thoughts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting thoughts" });
    }
  },
  //Get a single thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        //excluding __v
        .select("-__v");
      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }
      res.json(thought);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting a thought" });
    }
  },
  //create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      res.json(thought);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating a thought" });
    }
  },
  //delete a thought 
  async deleteThought(req, res) {
    try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
        if (!thought)   {
            return res.status(404).json({ message: "No thought with that ID" });
        };
        await User.findOneAndUpdate(
            { thoughts : req.params.thoughtId },
            { $pull :{ thoughts : req.params.thoughtId  }},
            { new: true}
        );
        res.status(200).json( { message: "This thought is successfully deleted!" });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting a thought" });
      }
  }
};
