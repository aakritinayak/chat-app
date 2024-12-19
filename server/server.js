
const express = require("express");
const cors = require("cors");
const {ApolloServer} = require('@apollo/server');
const {expressMiddleware} = require('@apollo/server/express4');
const mongoose = require("mongoose");
const { createYoga } = require("graphql-yoga");
const typeDefs = require('./graphql/typeDefs')
const query = require('./graphql/query')
const mutation = require('./graphql/mutation')

// Connect to MongoDB
mongoose.connect("mongodb+srv://akashakp0037:akash@cluster0.p4thj.mongodb.net/")
.then(() => console.log("MongoDB is connected"))
.catch((err) => console.error("MongoDB connection error:", err));

let users = [
  { id: '1', username: 'Alice', email:'alice@gmail.com'  },
  { id: '2', username: 'Bob', email: 'bob@gmail.com' }
];

async function startServer(){
  const app = express();
  const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers:{
      Query: query,
      Mutation: mutation
    }
  });
  app.use(express.json());
  app.use(cors());
  await server.start();
  app.use("/graphql",expressMiddleware(server));
  app.listen(4000, () => {
    console.log("Server running at http://localhost:4000/graphql");
  });
}

startServer();
