import TrailModel from "../models/Trail";
import { HTTP_CODE } from '../enums/http-status-codes';

export class TrailController {

    async getAllTrails() {
        try {
            const trails = await TrailModel.find();
            return trails;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async getTrailById(trailId: string) {
        try {
            const trail = await TrailModel.findById(trailId);
            return trail;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async getTrailByName(trailName: string) {
        try {
            console.log(' Trail name: ',trailName);
            
            const formattedTrailName = trailName.replace(/-/g, ' ');
            console.log(' Formated Trail name: ',formattedTrailName);
            
            const trail = await TrailModel.findOne({name: formattedTrailName})
            return trail;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async createTrail(trailObj:any) {
        const { name, location, difficulty, length, photos, ...rest } = trailObj;
        if(!name || !location || !difficulty || !length || !photos) {
            const customError: any = new Error('Please check the required fields!');
            customError.code = HTTP_CODE.NotFound;

            throw customError
        }

        const newTrail = new TrailModel({
            name,
            location,
            difficulty,
            length,
            photos,
            ...rest
        })

        await newTrail.save();
        return {message: "Trail created succesfully!"}
    }

    async deleteTrail(trailId: string) {
        try {
            await TrailModel.findByIdAndDelete(trailId);
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async updateTrail(trailId: string, updatedFields: any) {
        try {
            const trail = await TrailModel.findById(trailId);
            if (!trail) {
                const customError: any = new Error('Trail not found!');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }
    
            const { name, location, difficulty, length, elevationGain, duration, routeType, status, description,
                photos, keyFeatures, tags } = updatedFields;
    
            if (name) trail.name = name;
            if (location) trail.location = location;
            if (difficulty) trail.difficulty = difficulty;
            if (length) trail.length = length;
            if (elevationGain) trail.elevationGain = elevationGain;
            if (duration) trail.duration = duration;
            if (routeType) trail.routeType = routeType;
            if (status !== undefined) trail.status = status;
            if (description) trail.description = description;
            if (photos) trail.photos = photos;
            if (keyFeatures) trail.keyFeatures = keyFeatures;
            if (tags) trail.tags = tags;
    
            await trail.save();
    
            return { message: "Trail updated successfully!" };
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async rateAndReviewTrail (trailId: string, userId: string, rating: number, comment: string) {
        try {
            const trail = await TrailModel.findById(trailId);
            if(!trail) {
                const customError: any = new Error('Trail not found!');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            const existingReview = trail.reviews.findIndex( index => index.user?.toString() === userId);
            if (existingReview !== -1) {
                throw new Error('User has already rated or reviewed this trail.');
            }

            trail.reviews.push({ user: userId, rating, comment });
            await trail.save();

            return { message: "Trail rated and reviewed successfully!" };
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async updateRateAndReviewTrail(trailId: string, userId: string, rating: number, comment: string) {
        try {
            const trail = await TrailModel.findById(trailId);
            if (!trail) {
                const customError: any = new Error('Trail not found!');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }
    
            const existingReview = trail.reviews.findIndex(index => index.user?.toString() === userId);
            if (existingReview === -1) {
                throw new Error('User has not rated or reviewed this trail yet.');
            }
    
            trail.reviews[existingReview].rating = rating;
            trail.reviews[existingReview].comment = comment;
            await trail.save();
    
            return { message: "Trail review updated successfully!" };
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }
    
    async deleteReview(trailId: string, userId: string) {
        try {
            const trail = await TrailModel.findById(trailId);
            if (!trail) {
                const customError: any = new Error('Trail not found!');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }
    
            const existingReview = trail.reviews.findIndex(review => review.user?.toString() === userId);
            if (existingReview === -1) {
                throw new Error('Review not found for this user and trail.');
            }
    
            trail.reviews.splice(existingReview, 1);
            await trail.save();
    
            return { message: "Review deleted successfully!" };
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }
    
    async getAllReivews(trailId: string) {
        try {
            const trail = await TrailModel.findById(trailId);
            if (!trail) {
                const customError: any = new Error('Trail not found!');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            const reviews = trail.reviews;
            return reviews;
            
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }
};
