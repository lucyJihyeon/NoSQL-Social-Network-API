//importing schema module from mongoose
const { Schema, Types } = require("mongoose");
const moment = require("moment");

//createing a subdocument
const reactionSchema = new Schema(
  {
    reactionBody: {
      type: String,
      required: true,
      maxlength: [280, "maximum length of reaction must be 280"],
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) =>
        moment(createdAtVal).format("MMM DD, YYYY [at] hh:mm a"),
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false, 
  }
);

module.exports = reactionSchema;
