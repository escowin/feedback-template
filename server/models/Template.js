const { Schema, model } = require("mongoose");
const { dateFormat } = require("../utils/dateFormat");

const TextSchema = new Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
    type: {
      type: String,
      required: true,
      trim: true,
      maxLength: 25,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const TemplateSchema = new Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 25,
    },
    texts: [TextSchema],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const Template = model("Template", TemplateSchema);

module.exports = Template;
