import mongoose from "mongoose";
import { HTTP_CODE } from "../enums/http-status-codes";
import ChatRoomModel from "../models/ChatRoom";
import EventModel from "../models/Event";
import UserModel from "../models/User";

export class ChatRoomController {
    async createJoinChatRoom(eventId: any, participantId: any) {
        try {
            const event = await EventModel.findById(eventId);
            const participant = await UserModel.findById(participantId);

            if (!participant || !event) {
                const customError: any = new Error('Participant or Event not found');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            const participantName = participant.firstName + " " + participant.lastName;

            let chatRoom = await ChatRoomModel.findOne({ eventId });

            const participantIdObject = new mongoose.Types.ObjectId(participantId);

            if (chatRoom) {
                chatRoom.participants.push(participantIdObject);
                chatRoom.participantsName.push(participantName);
                await chatRoom.save();
            } else {
                chatRoom = new ChatRoomModel({
                    eventId: eventId,
                    participants: [participantId],
                    participantsName: [participantName]
                });
                await chatRoom.save();
            }

            return { message: 'Chat room created/joined successfully' };
        } catch (error) {
            console.error("Error creating/joining chat room:", error);
            throw new Error("Internal Server Error");
        }
    }

    async deleteChatRoom(eventId: any) {
        try {
            await ChatRoomModel.deleteOne({ eventId });

            return { message: 'Chat room deleted successfully' };
        } catch (error) {
            console.error("Error deleting chat room:", error);
            throw new Error("Internal Server Error");
        }
    }

    async leaveChatRoom(eventId: any, participantId: any) {
        try {
            const chatRoom = await ChatRoomModel.findOne({ eventId });

            if (!chatRoom) {
                const customError: any = new Error('Chat room not found');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            const participant = await UserModel.findById(participantId);

            const participantName = participant?.firstName + " " + participant?.lastName;

            chatRoom.participants = chatRoom.participants.filter(participant => participant.toString() !== participantId);
            chatRoom.participantsName = chatRoom.participantsName.filter(name => name !== participantName);
            await chatRoom.save();

            return { message: 'Participant left the chat room successfully' };
        } catch (error) {
            console.error("Error leaving chat room:", error);
            throw new Error("Internal Server Error");
        }
    };

    async getAllChatRooms() {
        try {
            const chatRooms = await ChatRoomModel.find();
            return chatRooms;
        } catch (error) {
            console.error("Error retrieving chat rooms:", error);
            throw new Error("Internal Server Error");
        }
    };

    async getChatRoomById(chatRoomId: any) {
        try {
            const chatRoom = await ChatRoomModel.findById(chatRoomId);
            return chatRoom;
        } catch (error) {
            console.error("Error getting the chat room:", error);
            throw new Error("Internal Server Error");
        }
    }
}
