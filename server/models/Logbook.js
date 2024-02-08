const { Schema, model } = require("mongoose");
const { dateFormat } = require("../utils/dateFormat");

const GradeSchema = new Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
    assignment: {
      type: String,
      required: true,
      trim: true,
      maxLength: 10,
    },
    grade: {
      type: Number,
      required: true,
      trim: true,
      max: 100,
    },
    url: {
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

const LogbookSchema = new Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
    date: {
      type: Date,
      required: true,
      trim: true,
    },
    grades: [GradeSchema],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const Logbook = model("Logbook", LogbookSchema);

module.exports = Logbook;
