const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref:"user" , required: true },
    chatRoom: { type: mongoose.Schema.Types.ObjectId, ref:"chatRoom" , required: true },
    sentAt: {type:String}
});

const MessageModel = mongoose.model("Message", messageSchema);

module.exports = MessageModel;