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
        .populate([
          {
            path: "collections",
            populate: { path: "templates" },
          },
        ]);
      return user;
    },
    users: async () => User.find().select("-__v -password"),
    user: async (parent, { username }) =>
      User.findOne({ username })
        .select("-__v -password")
        .populate("collections"),
    collections: async () => Collection.find().populate("templates"),
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

      // Links the template with a specified user
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
    addTemplate: async (parent, { collectionId, ...data }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      const template = await Template.create({ ...data });

      // Links the template with a specified collection
      await Collection.findByIdAndUpdate(
        { _id: collectionId },
        { $push: { templates: template._id } },
        { new: true }
      );

      return template;
    },
    editTemplate: async (parent, { _id, ...updatedFields }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      const template = await Template.findByIdAndUpdate(
        _id,
        { $set: updatedFields },
        { new: true }
      );

      if (!template) {
        throw new Error("template not found");
      }

      return template;
    },
    deleteTemplate: async (parent, { _id }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      const template = await Template.findByIdAndDelete(_id);

      await Collection.findByIdAndUpdate(
        { _id: context.user._id },
        { $pull: { templates: template._id } },
        { new: true }
      );
      return template;
    },

    // Strings
    addText: async (parent, { templateId, text, type }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      // Text is populated into specified template's `texts` array field
      const update = await Template.findOneAndUpdate(
        { _id: templateId },
        { $push: { texts: { text, type } } },
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
    deleteText: async (parent, { _id, templateId }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      try {
        const template = await Template.findOneAndUpdate(
          { _id: templateId },
          { $pull: { texts: { _id: _id } } },
          { new: true, runValidators: true }
        );
        
        return !template ? new Error("template not found") : template;
      } catch (err) {
        throw new Error("failed to deelte text");
      }
    },
  },
};

module.exports = resolvers;
