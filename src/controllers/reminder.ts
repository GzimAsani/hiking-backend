import { HTTP_CODE } from "../enums/http-status-codes";
import ReminderModel from "../models/Reminder";
import TrailModel from "../models/Trail";
import UserModel from "../models/User";


export class ReminderController {

    async getAllReminders(trailId: string) {
        try {
            const trail = await TrailModel.findById(trailId).populate('reminders');
            if (!trail) { 
                const customError: any = new Error('No trail found.');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }
            return trail.reminders;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }
    

    async saveReminder(trailId: string, reminderData: any) {
        try {
            const { date, time, description, userId } = reminderData;

            const trail = await TrailModel.findById(trailId);
            if(!trail) { 
                const customError: any = new Error('Trail not found.');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            const user = await UserModel.findById(userId);
            if(!user) { 
                const customError: any = new Error('User not found.');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            if(!date || !time || !description) {
                const customError: any = new Error('Date, Time and Description are required to be fullfilled');
                customError.code = HTTP_CODE.NotFound;
                throw customError
            }

            const existingReminderOnThatDate = await ReminderModel.findOne({createdBy: userId, date});

            if(existingReminderOnThatDate) {
                const customError: any = new Error('A reminder already exists for this user on the same day.');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            const newReminder = new ReminderModel({
                date,
                time,
                description,
                createdBy: userId
            });
            await newReminder.save();
            
            const update = {
                $push: { reminders: newReminder }
            };
            await TrailModel.updateOne({ _id: trailId }, update);
    
            return newReminder;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async deleteReminder(trailId: string, reminderId: string) {
        try {
            const trail = await TrailModel.findById(trailId).populate('reminders');
            if (!trail) {
                const customError: any = new Error('Trail not found.');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            const reminder = trail?.reminders.find(rem => rem._id.toString() === reminderId);
            if (!reminder) {
                const customError: any = new Error('Reminder not found in trail.');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            trail.reminders = trail.reminders.filter(rem => rem._id.toString() !== reminderId);
            const response = await trail.save();

            return response;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async updateReminder(trailId: string, reminderId: string, reminderData: any) {
        try {
            const { date, time, description } = reminderData;

            const trail = await TrailModel.findById(trailId).populate('reminders');
            if (!trail) {
                const customError: any = new Error('Trail not found.');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }
    
            const reminder: any = trail?.reminders.find(rem => rem._id.toString() === reminderId);
            if (!reminder) {
                const customError: any = new Error('Reminder not found in trail.');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }
    
            const existingReminderOnThatDate = await ReminderModel.findOne({
                _id: { $ne: reminderId }, 
                date,
                createdBy: reminder.createdBy
            });
    
            if (existingReminderOnThatDate) {
                const customError: any = new Error('Another reminder already exists for this user on the same day.');
                customError.code = HTTP_CODE.Conflict;
                throw customError;
            }
    
            if (date) reminder.date = date;
            if (time) reminder.time = time;
            if (description) reminder.description = description;
    
            await trail.save();
            
            return reminder;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }
    

    async getAReminder(trailId: string, reminderId: string) {
        try {
            const trail = await TrailModel.findById(trailId).populate('reminders');
            if (!trail) { 
                const customError: any = new Error('No trail found.');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }
            const reminder: any = trail?.reminders.find(rem => rem._id.toString() === reminderId);
            if (!reminder) { 
                const customError: any = new Error('No reminder found.');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }
            return reminder;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

}
