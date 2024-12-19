const mongoose = require('mongoose');
const userModel = require('../models/user.model');
const ChatRoom = require('../models/chatroom.model');
const MessageModel = require('../models/message.model')

const Mutation = {
    createUser: async (_, { username,password, email }) => {
      try {
        const newUser = new userModel({
          username,
          email,
          password,
          createdAt: new Date().toISOString(),
        });
  
        const savedUser = await newUser.save();
        return savedUser;
      } catch (err) {
        console.error('Error creating user:', err);
        throw new Error('Failed to create user');
      }
    },
    signIn : async (_, { email, password }) => {
      try {
        const foundUser = await userModel.findOne({ email });
    
        if (!foundUser) {
          throw new Error("User not found");
        }
    
        if (foundUser.password !== password) {
          throw new Error("Incorrect password");
        }
    
        return {
          id: foundUser._id,
          email: foundUser.email,
          username: foundUser.username,
          createdAt: foundUser.createdAt,
        };
      } catch (error) {
        console.error("Error signing in:", error);
        throw new Error("Authentication failed");
      }
    },
    createChatRoom: async (_, { name, participantIds,messages=[] }) => {
        try {
          const participants = await userModel.find({ _id: { $in: participantIds } });
          if (participants.length !== participantIds.length) {
            throw new Error('Some participant IDs are invalid');
          }
          const chatRoom = new ChatRoom({ name, participants,messages});
          return await chatRoom.save();
        } catch (err) {
          console.error('Error creating chat room:', err);
          throw new Error('Failed to create chat room');
        }
      },
      sendMessage: async (_, { chatRoomId, content, senderId }) => {
        try {
          // Validate sender
          const sender = await userModel.findById(senderId);
          if (!sender) {
            throw new Error('Invalid sender ID');
          }
    
          // Validate chat room
          const chatRoom = await ChatRoom.findById(chatRoomId);
          if (!chatRoom) {
            throw new Error('Invalid chat room ID');
          }
    
          // Create and save the message
          const message = new MessageModel({ content, sender: senderId, chatRoom: chatRoomId });
          const savedMessage = await message.save();
    
          // Add message to chat room
          chatRoom.messages.push(savedMessage._id);
          await chatRoom.save();
    
          // Fetch and populate the saved message
          const populatedMessage = await MessageModel.findById(savedMessage._id)
            .populate('sender') // Populate sender details
            .populate('chatRoom'); // Populate chat room details
    
          return populatedMessage;
        } catch (err) {
          console.error('Error sending message:', err);
          throw new Error('Failed to send message');
        }
      },
  };

module.exports = Mutation;