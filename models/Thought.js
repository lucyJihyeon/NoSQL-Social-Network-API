//importing necessary modules from mongoose
const { Schema, Types, model } = require("mongoose");
const reactionSchema = require('./Reaction.js');
const moment = require("moment"); 

//create a new schema instance named thought
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      trim: true,
      minlength: [1, "Minimun length of thought must be at least 1 character"],
      maxlength: [280, "maximum length of thought must be 280"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => moment(createdAtVal).format("MMM DD, YYYY [at] hh:mm a") ,
    },
    username: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    reactions: [reactionSchema],
  },
  {
    //include virtuals to be included with the response
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

//creating a virtual property 'reactionCount' that gets the length of reaction per thought 
thoughtSchema
  .virtual('reactionCount')
  //Getter
  .get(function(){
    return this.reactions.length;
  });

const Thought = model('thought', thoughtSchema);

module.exports = Thought;