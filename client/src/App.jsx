// Import necessary dependencies
// Create Apllo client for API endpoint connection
// Define main App with Routing
// import { useState } from "react";

import { ApolloProvider, ApolloClient, createHttpLink } from "@apollo/client";
import { InMemoryCache } from "@apollo/client/cache";
import { setContext } from "@apollo/client/link/context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header"
import Home from "./pages/Home";

// Apollo client configuration
const httpLink = createHttpLink({ uri: "/graphql" });

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  // Sets up client to execute the `authLink` middleware prior to making the request to the GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


function App() {

  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path={"/"} element={<Home/>}></Route>
            </Routes>
          </main>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
