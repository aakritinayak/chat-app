
const type = `
    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
        profilePicture: String
        createdAt: String
    }

    type Message {
        id: ID!
        content: String!
        sender: User!
        chatRoom: ChatRoom!
        sentAt: String!
    }

    type ChatRoom {
        id: ID!
        name: String!
        participants: [User!]
        messages: [Message!]
    }
    
    type Query {
        getUser: [User]
        getChatRooms: [ChatRoom!]
        getMessages(chatRoomId: ID!, limit: Int, offset: Int): [Message!]
    }

    type Mutation {
        createUser(username:String!,password:String!,email:String!): User
        signIn(email:String!,password:String!):User
        sendMessage(chatRoomId: ID!, content: String!, senderId: ID!): Message
        createChatRoom(name: String!, participantIds: [ID!]!): ChatRoom
    }

    type Subscription {
        messageAdded(chatRoomId: ID!): Message
    }
`;

module.exports = type;