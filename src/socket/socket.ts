import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ChatMessagesContoller } from "../controllers/chat-messages";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST"],
	},
});

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);
    
    socket.on('sendMessage', async (data) => {
      try {
          const { chatRoomId, senderId, message } = data;
  
          if (!chatRoomId || !senderId || !message) {
            throw new Error('Chat Room ID, Sender ID, and Message are required');
          }
  
          const chatMessagesController = new ChatMessagesContoller();
          await chatMessagesController.sendMessage(chatRoomId, senderId, message);
  
          io.to(chatRoomId).emit('message', { chatRoomId, senderId, message });
      } catch (error) {
          console.error('Error handling sendMessage:', error);
          socket.emit('sendMessageError', { error: error });
      }
  
      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
  
})

export { app, server };

