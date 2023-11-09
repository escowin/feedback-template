// Import depdencies
// Initialize server port connection
// Initialize server using configured Apollo Server
// Initialize Express app instance
// Configure middleware to facilitate client & server communication
// IF deployed to production, use client side build for frontend code
// Initialize & call Apollo Server with GraphQL schema parameters.

// Dependencies
const path = require("path");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const db = require("./config/connection");
// auth middleware
// graphql schemas

// Port connection for either production or local environment
const PORT = process.env.port || 3001;

// Apollo server configuration
const server = new ApolloServer({
    // typeDefs,
    // resolvers,
    // context: authMiddleware,
    cache: "bounded"
})

// Creates an instance of the Express application
const app = express();
// Middleware allows server the process data sent from client side forms, and handle JSON data sent in the request body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Production environment uses client-side build for frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

async function startApolloServer(typeDefs, resolvers) {
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}`);
      console.log(`URL http://localhost:${PORT}`);
    });
  });
}

startApolloServer("typedefs", "resolvers");
