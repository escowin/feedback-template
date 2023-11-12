const { Schema, model } = require("mongoose");
const { dateFormat } = require("../utils/dateFormat")

const CollectionSchema = new Schema(
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
    },
    templates: [
      {
        type: Schema.Types.ObjectId,
        ref: "Template"
      }
    ]
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const Collection = model("Collection", CollectionSchema);

module.exports = Collection;
