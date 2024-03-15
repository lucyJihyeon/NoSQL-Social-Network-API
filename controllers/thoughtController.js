const { ObjectId } = require("mongoose").Types;
const { Thought, User } = require("../models");

module.exports = {
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find().select("-__v");
            res.json(thoughts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error getting thoughts" });
          }
    },
}