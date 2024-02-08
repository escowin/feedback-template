const { User, Collection, Template, Logbook } = require("../models");
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
        ])
        .populate([
          {
            path: "logbook",
            populate: { path: "grades", options: { sort: { assignment: 1 } } },
          },
        ]);

      // Manually sort grades within logbook after population
      user.logbook.forEach((logbook) => {
        logbook.grades.sort((a, b) => a.assignment.localeCompare(b.assignment));
      });

      return user;
    },
    users: async () => User.find().select("-__v -password"),
    user: async (parent, { username }) =>
      User.findOne({ username })
        .select("-__v -password")
        .populate("collections")
        .populate("grades"),
    collections: async () => Collection.find().populate("templates"),
    templates: async () => Template.find(),
    logbooks: async () =>
      Logbook.find().populate({
        path: "grades",
        options: { sort: { assignment: 1 } },
      }),
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
      // target a specific Template by its id
      // replace the matching text object in the texts array with new data
      // save the changes
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      try {
        const { templateId, _id, type, text } = args;

        // Find the template by ID and update the matching text object
        const template = await Template.findOneAndUpdate(
          { _id: templateId, "texts._id": _id },
          { $set: { "texts.$.type": type, "texts.$.text": text } },
          { new: true, runValidators: true }
        );

        return !template ? new Error("template not found") : template;
      } catch (err) {
        throw new Error("failed to edit text");
      }
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
        throw new Error("failed to delete text");
      }
    },

    // Logbook
    addLogbook: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      try {
        console.log(args);
        const response = await Logbook.create({
          ...args,
          username: context.user.username,
        });

        // Links the logbook with a specified user
        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { logbook: response._id } },
          { new: true }
        );

        return response;
      } catch (err) {
        console.error(err);
      }
    },
    editLogbook: async (parent, { _id, ...updatedFields }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      const response = await Logbook.findByIdAndUpdate(
        _id,
        { $set: updatedFields },
        { new: true }
      );

      if (!response) {
        throw new Error("collection not found");
      }

      return response;
    },
    deleteLogbook: async (parent, { _id }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      const response = await Logbook.findByIdAndDelete(_id);

      await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $pull: { logbook: response._id } },
        { new: true }
      );
      return response;
    },

    // Grades
    addGrade: async (parent, { logbookId, ...data }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      try {
        const response = await Logbook.findOneAndUpdate(
          { _id: logbookId },
          { $push: { grades: { ...data } } },
          { new: true, runValidators: true }
        );

        // Sort grades array in descending order based on createdAt
        response.grades.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const addedGrade = response.grades[0];
        return addedGrade;
      } catch (err) {
        console.error(err);
      }
    },
    editGrade: async (parent, { logbookId, _id, ...data }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      try {
        const { assignment, grade, url } = data;

        const response = await Logbook.findOneAndUpdate(
          { _id: logbookId, "grades._id": _id },
          {
            $set: {
              "grades.$.assignment": assignment,
              "grades.$.grade": grade,
              "grades.$.url": url,
            },
          },
          { new: true, runValidators: true }
        );

        // Extract and return the edited grade. `.toString()` ensures comparison consistency as MongoDB `_id` values are not regular strings
        const update = response.grades.find(
          (grade) => grade._id.toString() === _id
        );

        return !update ? new Error("logbook or grade not found") : update;
      } catch (err) {
        throw new Error("failed to edit grade");
      }
    },
    deleteGrade: async (parent, { _id, logbookId }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      try {
        const response = await Logbook.findOneAndUpdate(
          { _id: logbookId },
          { $pull: { grades: { _id: _id } } },
          { new: true, runValidators: true }
        );

        return !response ? new Error("template not found") : response;
      } catch (err) {
        throw new Error("failed to delete text");
      }
    },
  },
};

module.exports = resolvers;
