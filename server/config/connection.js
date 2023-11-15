const mongoose = require("mongoose");

// Connects server to MongoDB database for production & local environments (configured local for Node.js 18 & up)
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/feedback-templateur"
  )
  .catch((err) => console.error(err));

module.exports = mongoose.connection;
