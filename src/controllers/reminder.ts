import { HTTP_CODE } from "../enums/http-status-codes";
import ReminderModel from "../models/Reminder";

const Reminder = require('../models/Reminder');

export class ReminderController {

    async getReminders() {
        try {
            const reminders = await ReminderModel.find();
            return reminders;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }




    async saveReminder(userObj: any) {
        
            const { date, time, location, description } = userObj;
            const newReminder = new ReminderModel({
                date,
                time,
                location,
                description
            });
            await newReminder.save();
            if (!date || !time) {
                const customError:any = new Error('Date and Time are required to be fullfilled');
                customError.code = HTTP_CODE.NotFound;
                throw customError
            }
            const existingReminder = await ReminderModel.findOne({ Reminder });
            if (existingReminder) {
                const customError:any =  new Error('This reminder already exists for this profile');
                customError.code = HTTP_CODE.NotFound

                throw customError
            }    
    }

    async deleteUser(reminderId: string) {
        try {
            await ReminderModel.findByIdAndDelete(reminderId);
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async updateReminder(userObj: any) {
        try {
            const { id, date, time, location, description } = userObj;
    
            if (!date || !time) {
                const customError: any = new Error('Date and Time are required to be fulfilled');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }
    
            const existingReminder = await ReminderModel.findById(id);
    
            if (!existingReminder) {
                const customError: any = new Error('Reminder not found');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }
    
            existingReminder.date = date;
            existingReminder.time = time;
            existingReminder.location = location;
            existingReminder.description = description;
    
            await existingReminder.save();
    
            return existingReminder;
        } catch (error) {
            console.error('Error updating reminder:', error);
            throw error; 
        }
    }
}
