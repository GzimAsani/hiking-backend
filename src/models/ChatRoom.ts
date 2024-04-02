import mongoose from 'mongoose';

const ChatRoom = new mongoose.Schema({
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    messages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatMessage',
    }],
});

const ChatRoomModel = mongoose.model('ChatRoom', ChatRoom);

export default ChatRoomModel;