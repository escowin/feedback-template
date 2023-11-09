const { Schema, model } = require("mongoose");

const CollectionSchema = new Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    title: {
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

const Collection = model("Collection", CollectionSchema);

module.exports = Collection;
