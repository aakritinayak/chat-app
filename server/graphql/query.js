const mongoose = require('mongoose');
const userModel = require('../models/user.model');
const ChatRoomModel = require('../models/chatroom.model');
const MessageModel = require('../models/message.model');

const Query = {
  getUser: async () => {
    try {
      const users = await userModel.find();
      return users;
    } catch (err) {
      console.error('Error fetching users:', err);
      throw new Error('Failed to fetch users');
    }
  },
  getUserByID: async (_,{userId}) => {
    try {
      const users = await userModel.findById(userId);
      return users;
    } catch (err) {
      console.error('Error fetching users:', err);
      throw new Error('Failed to fetch users');
    }
  },
  getChatRooms: async () => {
    try {
      return await ChatRoomModel.find()
        .populate('participants') // Populate User references
        .populate('messages'); // Populate Message references
    } catch (err) {
      console.error('Error fetching chat rooms:', err);
      throw new Error('Failed to fetch chat rooms');
    }
  },
  getMessages: async (_, { chatRoomId, limit = 10, offset = 0 }) => {
    try {
      // Fetch messages for the given chatRoomId with pagination
      const messages = await MessageModel.find({ chatRoom:chatRoomId })
            .sort({ createdAt: -1 }) // Sort by creation date (most recent first)
            .skip(offset) // Skip the given number of messages (for pagination)
            .limit(limit) // Limit the number of messages returned
            .populate('sender');

            return messages;
    } catch (error) {
            console.error("Error fetching messages:", error);
            throw new Error("Failed to fetch messages");
    }
  },
  getParticipants: async (_, { chatRoomId }) => {
    try {
      // Fetch the chat room and populate participants
      const chatRoom = await ChatRoomModel.findById(chatRoomId).populate('participants');
      
      if (!chatRoom) {
        throw new Error("Chat room not found");
      }
      
      return chatRoom;
    } catch (error) {
      console.error("Error fetching participants:", error);
      throw new Error("Failed to fetch participants");
    }
  }
}

module.exports = Query;