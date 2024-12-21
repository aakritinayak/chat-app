
const express = require("express"); // express server
const cors = require("cors"); // cross origin resource sharing
const {ApolloServer} = require('@apollo/server'); // graphql server
const {expressMiddleware} = require('@apollo/server/express4'); // express re graph server use kariba pai middleware
const mongoose = require("mongoose");

const typeDefs = require('./graphql/typeDefs')
const query = require('./graphql/query')
const mutation = require('./graphql/mutation')
const { WebSocketServer, WebSocket } = require("ws");

// Connect to MongoDB
mongoose.connect("mongodb+srv://aakriti:akash@cluster0.p4thj.mongodb.net/")
.then(() => console.log("MongoDB is connected"))
.catch((err) => console.error("MongoDB connection error:", err));

const wss = new WebSocketServer({ port: 8080 },(()=>console.log("WebSocket is connected in 8080")));

let allSockets = [];

wss.on("connection", (socket) => {

  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.type == "join") {
        console.log(parsedMessage.type)
        console.log("user joined room " + parsedMessage.payload.roomId);
        allSockets.push({
            socket,
            room: parsedMessage.payload.roomId
        })
    }
    
    if (parsedMessage.type == "chat") {
        const currentUserRoom = allSockets.find((x) => x.socket == socket).room
        for (let i = 0; i < allSockets.length; i++) {
            if (allSockets[i].room == currentUserRoom) {
                allSockets[i].socket.send(parsedMessage.payload.senderId+','+parsedMessage.payload.content)
            }
        }
    }
  })

})

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
  await server.start(); // graphql server run
  app.use("/graphql",expressMiddleware(server));
  app.listen(4000, () => {
    console.log("Server running at http://localhost:4000/graphql");
  });
}

startServer();
