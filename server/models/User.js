const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxLength: 25,
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 25,
    },
    collections: [
      {
        type: Schema.Types.ObjectId,
        ref: "Collection"
      }
    ]
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

UserSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", UserSchema);

module.exports = User;
