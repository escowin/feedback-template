const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth")

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }
      const user = await User.findOne({ _id: context.user._id }).select(
        "-__v -password"
      );
      return user;
    },
    users: async () => User.find().select("-__v -password"),
    user: async (parent, { username }) =>
      User.findOne({ username }).select("-__v -password"),
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user }
    },
  },
};

module.exports = resolvers;
