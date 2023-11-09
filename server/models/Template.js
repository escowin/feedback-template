const { Schema, model } = require("mongoose");

const StringSchema = new Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      maxLength: 25,
    },
    string: {
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
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 25,
    },
    strings: [StringSchema],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const Template = model("Template", TemplateSchema);

module.exports = Template;
