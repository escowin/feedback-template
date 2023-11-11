const { User, Collection, Template } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }
      const user = await User.findOne({ _id: context.user._id })
        .select("-__v -password")
        .populate([{ path: "collections" }]);
      return user;
    },
    users: async () => User.find().select("-__v -password"),
    user: async (parent, { username }) =>
      User.findOne({ username }).select("-__v -password"),
    collections: async () => Collection.find(),
    templates: async () => Template.find(),
  },
  Mutation: {
    // User
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new AuthenticationError("incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },

    // Collection
    addCollection: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      const collection = await Collection.create({
        ...args,
        username: context.user.username,
      });

      await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $push: { collections: collection._id } },
        { new: true }
      );

      return collection;
    },
    editCollection: async (parent, { _id, ...updatedFields }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      const collection = await Collection.findByIdAndUpdate(
        _id,
        { $set: updatedFields },
        { new: true }
      );

      if (!collection) {
        throw new Error("collection not found");
      }

      return collection;
    },
    deleteCollection: async (parent, { _id }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      const collection = await Collection.findByIdAndDelete(_id);

      await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $pull: { collections: collection._id } },
        { new: true }
      );
      return collection;
    },

    // Template
    addTemplate: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      const collection = await Template.create({
        ...args,
        username: context.user.username,
      });

      return collection;
    },
    editTemplate: async (parent, { _id, ...updatedFields }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      const collection = await Template.findByIdAndUpdate(
        _id,
        { $set: updatedFields },
        { new: true }
      );

      if (!collection) {
        throw new Error("collection not found");
      }

      return collection;
    },
    deleteTemplate: async (parent, { _id }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      const collection = await Template.findByIdAndDelete(_id);

      await Collection.findByIdAndUpdate(
        { _id: context.user._id },
        { $pull: { templates: template._id } },
        { new: true }
      );
      return collection;
    },

    // Strings
    addText: async (parent, { templateId, string, type }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      const update = await Template.findOneAndUpdate(
        { _id: templateId },
        { $push: { strings: { string, type } } },
        { new: true, runValidators: true }
      );

      return update;
    },
    editText: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      console.log(args);
    },
    deleteText: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }
      console.log(args);
      // try {
      //   const template = await Template.findOneAndUpdate(
      //     { _id: },
      //     { $pull: { strings: { _id: _id } } },
      //     { new: true, runValidators: true }
      //   );
      //   return !template ? new Error("template not found") : updatedJob;
      // } catch (err) {
      //   throw new Error("failed to delete string");
      // }
    },
  },
};

module.exports = resolvers;
