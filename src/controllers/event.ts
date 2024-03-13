import EventModel from "../models/Event";
import { HTTP_CODE } from "../enums/http-status-codes";
import TrailModel from "../models/Trail";
import UserModel from "../models/User";

// const Event = require('../models/Event');

export class EventController{
    saveEvent = async (eventObj: any, trailId: any, creatorId: any) => {
        try {
            const { date, time, ...rest} = eventObj;
            if(!trailId || !creatorId) {
                const customError: any = new Error('Creator Id or Trail ID not found!');
                customError.code = HTTP_CODE.NotFound;
                throw customError
            }
            if(!date || !time) {
                const customError: any = new Error('Please check the required fields!');
                customError.code = HTTP_CODE.NotFound;
                throw customError
            }

            const existingTrail = await TrailModel.findById(trailId);
            if (!existingTrail) {
                const customError: any = new Error('Trail not found!');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            const user = await UserModel.findById(creatorId);
            if (!user) {
                const customError: any = new Error('User not found!');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            const newEvent = new EventModel({
                trail: trailId,
                creator: creatorId,
                date,
                time,
                ...rest
            });
            await newEvent.save();

            existingTrail.events.push(newEvent._id);
            await existingTrail.save();

            user.eventsAttending.push(newEvent._id);
            await user.save();
            return newEvent; 
        } catch (error) {
            console.error('Error saving event:', error);
            throw new Error('Internal Server Error');
        }
    };
    
    async deleteEvent(eventId: any, creatorId: any) {
        try {
            const event = await EventModel.findById(eventId);
            if (!event) {
                const customError:any = new Error('Event not found');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            if(event.creator.toString() !== creatorId.toString()){
                const customError:any = new Error('You are not the creator of this event and so you cannot delete it!');
                customError.code = HTTP_CODE.Forbidden;
                throw customError;
            }
            await EventModel.findByIdAndDelete(eventId);
            const existingTrail = await TrailModel.findById(event.trail);
            if (!existingTrail) {
                const customError:any = new Error('Trail not found');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }
            existingTrail.events = existingTrail.events.filter(e => e.toString() !== eventId.toString());
            await existingTrail.save();

            const user = await UserModel.findById(creatorId);
            if (!user) {
                const customError:any = new Error('User not found');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }
            user.eventsAttending = user.eventsAttending.filter(e => e.toString() !== eventId.toString());
            await user.save();

            return { message: 'Event deleted successfully' };
        } catch (error) {
            console.error('Error deleting event:', error);
            throw new Error('Internal Server Error');
        }
    }
    
    async updateEvent(eventObj: any, eventId:any, creatorId:any) {
        try {
            const { attendees, date, time, location, maxAttendees, status, title, description } = eventObj;
    
            const existingEvent = await EventModel.findById(eventId);
    
            if (!existingEvent) {
                const customError:any = new Error('Event not found');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }
            
            if(existingEvent.creator.toString() !== creatorId.toString()){
                const customError:any = new Error('You are not the creator of this event and so you cannot change it!');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            if (eventObj.trail || eventObj.creator || eventObj.duration) {
                const customError: any = new Error('You cannot update the trail, creator, or duration of the event');
                customError.code = HTTP_CODE.BadRequest;
                throw customError;
            }

            existingEvent.attendees = attendees;
            existingEvent.date = date;
            existingEvent.time = time;
            existingEvent.location = location;
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
    
    async getEvents() {
        try {
            const events = await EventModel.find();
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
