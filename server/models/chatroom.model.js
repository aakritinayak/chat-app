const mongoose = require('mongoose');

const ChatRoomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
      },
    ],
    createdAt: { type: String, default: () => new Date().toISOString() },
});

const ChatRoom = mongoose.model('chatRoom',ChatRoomSchema);

module.exports = ChatRoom