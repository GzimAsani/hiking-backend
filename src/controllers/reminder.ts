// import { HTTP_CODE } from "../enums/http-status-codes";
// import ReminderModel from "../models/Reminder";

// const Reminder = require('../models/Reminder');

// export class ReminderController {

//     async getReminders(location?:string) {
//         try {
//             let query={};
//             if(location){
//                 query={location:new RegExp(location,'i')}
//             }
//             const reminders = await ReminderModel.find(query);
//             return reminders;
//         } catch (error) {
//             console.error('Error:', error);
//             throw new Error('Internal Server Error');
//         }
//     }


//     async saveReminder(userObj: any) {

//         const { date, location, description } = userObj;
//         const newReminder = new ReminderModel({
//             date,
//             // time,
//             location,
//             description
//         });
//         await newReminder.save();
//         if (!date) {
//             const customError: any = new Error('Date and Time are required to be fullfilled');
//             customError.code = HTTP_CODE.NotFound;
//             throw customError
//         }
//         const existingReminder = await ReminderModel.findOne({ Reminder });
//         if (existingReminder) {
//             const customError: any = new Error('This reminder already exists for this profile');
//             customError.code = HTTP_CODE.NotFound

//             throw customError
//         }
//     }

//     async deleteReminder(reminderId: string) {
//         try {
//             await ReminderModel.findByIdAndDelete(reminderId);
//         } catch (error) {
//             console.error('Error:', error);
//             throw new Error('Internal Server Error');
//         }
//     }

//     async updateReminder(userObj: any) {
//         try {
//             const { id, date, location, description } = userObj;

//             if (!date) {
//                 const customError: any = new Error('Date and Time are required to be fulfilled');
//                 customError.code = HTTP_CODE.NotFound;
//                 throw customError;
//             }

//             const existingReminder = await ReminderModel.findById(id);

//             if (!existingReminder) {
//                 const customError: any = new Error('Reminder not found');
//                 customError.code = HTTP_CODE.NotFound;
//                 throw customError;
//             }

//             existingReminder.date = date;
//             existingReminder.location = location;
//             existingReminder.description = description;

//             await existingReminder.save();

//             return existingReminder;
//         } catch (error) {
//             console.error('Error updating reminder:', error);
//             throw error;
//         }
//     }
// }

import { HTTP_CODE } from "../enums/http-status-codes";
import EventModel from "../models/Event";
import ReminderModel from "../models/Reminder";
import UserModel from "../models/User";

export class ReminderController {
    async createReminder(reminderData: any) {
        try {
            const { userId, eventId, reminderDate, message } = reminderData;
            const user = await UserModel.findById(userId);
            const event = await EventModel.findById(eventId);

            if(!user || !event) {
                const customError: any = new Error('User or Event not found');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            if(!reminderDate) {
                const customError: any = new Error('The time of this reminder is required');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            const newReminder = new ReminderModel({
                userId,
                eventId,
                reminderDate,
                message
            });

            await newReminder.save();

            
            user.reminders.push(newReminder._id);
            await user.save();

            return newReminder;
        } catch (error) {
            console.error("Error creating reminder:", error);
            throw new Error("Internal Server Error");
        }
    }

    async getReminderById(reminderId: string) {
        try {
            const reminder = await ReminderModel.findById(reminderId);
            return reminder;
        } catch (error) {
            console.error("Error:", error);
            throw new Error("Internal Server Error");
        }
    }

    async getUserReminders(userId: string) {
        try {
            const user = await UserModel.findById(userId).populate("reminders");
            if (!user) {
                const customError: any = new Error('User not found');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }
            return user.reminders;
        } catch (error) {
            console.error("Error retrieving user reminders:", error);
            throw new Error("Internal Server Error");
        }
    }

    async getAllReminders() {
        try {
            const reminders = await ReminderModel.find();
            return reminders;
        } catch (error) {
            console.error("Error retrieving all reminders:", error);
            throw new Error("Internal Server Error");
        }
    }
}
