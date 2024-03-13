import EventModel from "../models/Event";
import { HTTP_CODE } from "../enums/http-status-codes";

const Event = require('../models/Event');

export class EventController{
    saveEvent = async (eventObj: any) => {
        try {
            const newEvent = new EventModel(eventObj);
            await newEvent.save();
            return newEvent; 
        } catch (error) {
            console.error('Error saving event:', error);
            throw new Error('Internal Server Error');
        }
    };
    
    async deleteEvent(eventId: any) {
        try {
            await EventModel.findByIdAndDelete(eventId);
        } catch (error) {
            console.error('Error deleting event:', error);
            throw new Error('Internal Server Error');
        }
    }
    
    async updateEvent(eventObj: any) {
        try {
            const { _id, trail, creator, attendees, date, time, location, duration, maxAttendees, status, title, description } = eventObj;
    
            const existingEvent = await EventModel.findById(_id);
    
            if (!existingEvent) {
                const customError:any = new Error('Event not found');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }
    
            existingEvent.trail = trail;
            existingEvent.creator = creator;
            existingEvent.attendees = attendees;
            existingEvent.date = date;
            existingEvent.time = time;
            existingEvent.location = location;
            existingEvent.duration = duration;
            existingEvent.maxAttendees = maxAttendees;
            existingEvent.status = status;
            existingEvent.title = title;
            existingEvent.description = description;
    
            await existingEvent.save();
    
            return existingEvent;
        } catch (error) {
            console.error('Error updating event:', error);
            throw error;
        }
    }
    
    async getEvents(location: string | RegExp) {
        try {
            let query = {};
            if (location) {
                query = { location: new RegExp(location, 'i') };
            }
            const events = await EventModel.find(query);
            return events;
        } catch (error) {
            console.error('Error retrieving events:', error);
            throw new Error('Internal Server Error');
        }
    }

    async getEventById(eventId: string) {
        try {
            const event = await EventModel.findById(eventId);
            return event;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }
}
