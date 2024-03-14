//importing necessary modules from mongoose
const { Schema, Types, model } = require("mongoose");
//importing isEmail to validate an email field.
const isEmail = require("validator/lib/isEmail");

//creating a new instance of schema named userSchema
const userSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      //use usEmail for validation
      validate: [isEmail, "invalid email"],
    },
    //thoughts field referencing the thought model 
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "thought",
      },
    ],
    //friends frield referencing the user model (self-reference)
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    //include virtuals to be included with the response
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

//creating a virtual property 'friendCount' that gets the length of friends per user 
userSchema
  .virtual('friendCount')
  //Getter
  .get(function(){
    return this.friends.length;
  });

const User = model('user', userSchema);

module.exports = User;