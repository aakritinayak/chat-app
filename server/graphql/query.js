const mongoose = require('mongoose');
const userModel = require('../models/user.model');
const ChatRoomModel = require('../models/chatroom.model')

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
};

module.exports = Query;