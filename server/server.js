const { createYoga } = require("graphql-yoga");
const express = require("express");
const cors = require("cors");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} = require("graphql");

const messages = [];

// Define the Message type
const MessageType = new GraphQLObjectType({
  name: "Message",
  fields: {
    id: { type: GraphQLID },
    user: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

// Define the Query type
const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    messages: {
      type: new GraphQLList(MessageType),
      resolve: () => {
        console.log("Fetching messages:", messages);
        return messages;
      },
    },
  },
});

// Define the Mutation type
const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    postMessage: {
      type: GraphQLID,
      args: {
        user: { type: GraphQLString },
        content: { type: GraphQLString },
      },
      resolve: (_, { user, content }) => {
        try {
          const id = messages.length + 1;
          const message = { id, user, content };
          messages.push(message);
          console.log("Message added:", message);
          return id;
        } catch (error) {
          console.error("Error in postMessage resolver:", error);
          throw new Error("Failed to post message.");
        }
      },
    },
  },
});

// Create the GraphQL schema
const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

// Initialize Express app
const app = express();
app.use(cors());

// Attach Yoga middleware to Express
const yoga = createYoga({
  schema,
  graphqlEndpoint: "/graphql", // Set the endpoint explicitly
});
app.use("/graphql", yoga);

// Start the server
app.listen(4000, () => {
  console.log("Server running at http://localhost:4000/graphql");
});