import { HTTP_CODE } from "../enums/http-status-codes";
import ChatMessageModel from "../models/ChatMessage";
import ChatRoomModel from "../models/ChatRoom";
import UserModel from "../models/User";

export class ChatMessagesContoller {
    async sendMessage(chatRoomId: any, senderId: any, message: string) {
        try {
            const chatRoom = await ChatRoomModel.findById(chatRoomId);
            if (!chatRoom) {
                const customError: any = new Error('Chat room not found');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }
    
            const sender = await UserModel.findById(senderId);
            if (!sender) {
                const customError: any = new Error('Sender not found');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }
    
            if (!chatRoom.participants.includes(senderId)) {
                const customError: any = new Error('Sender is not a participant in the chat room');
                customError.code = HTTP_CODE.Forbidden;
                throw customError;
            }
    
            const newMessage = new ChatMessageModel({
                chatRoomId: chatRoomId,
                sender: senderId,
                message: message,
            });
    
            await newMessage.save();
    
            chatRoom.messages.push(newMessage._id);
            await chatRoom.save();
    
            return { message: 'Message sent successfully', chatMessage: newMessage };
        } catch (error) {
            console.error("Error sending message:", error);
            throw new Error("Internal Server Error");
        }
    } 
    
    async getAllMessagesInRoom(chatRoomId: any) {
        try {
            const chatRoom = await ChatRoomModel.findById(chatRoomId);
            if (!chatRoom) {
                const customError: any = new Error('Chat room not found');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            await chatRoom.populate('messages');

            return chatRoom.messages;
        } catch (error) {
            console.error("Error retrieving messages:", error);
            throw new Error("Internal Server Error");
        }
    }
}