const { createYoga } = require("graphql-yoga");
const { createServer } = require("http");
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = require("graphql");

const messages = [];


const MessageType = new GraphQLObjectType({
  name: "Message",
  fields: {
    id: { type: GraphQLID },
    user: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});


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
          const id = messages.length;
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


const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});


const yoga = createYoga({
  schema,
});


const server = createServer(yoga);


server.listen(4000, () => {
  console.log("Server running at http://localhost:4000");
});
