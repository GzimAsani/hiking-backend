import mongoose from "mongoose";

const User = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (email: string) => {
                return /\S+@\S+\.\S+/.test(email);
            },
            message: 'Invalid email address'
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (password: string) => {
                return password.length >= 8;
            },
            message: 'Password must be at least 8 characters long'
        }
    },
    description: {
        type: String
    },
    profileImg: {
        type: String
    },
    age: {
        type: Number,
        min: [1, 'Age cannot be less than 1'],
        max: [150, 'Age cannot be greater than 150']
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    location: {
        type: String
    },
    availability: {
        type: String
    },
    skillLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced']
    },
    interests: [String],
    emergencyContact: {
        name: String,
        phoneNumber: String
    },
    socialMedia: {
        facebook: String,
        twitter: String,
        instagram: String
    },
    hikingExperience: {
        type: String
    },
    equipment: [String],
    created_at: {
        type: Date,
        default: Date.now
    },
    trailFavorites: [{
        // type: mongoose.Schema.Types.ObjectId,
        type: String
        // ref: 'Trail' 
        //commented just for testing 


    }],
    reviews: [{
        trail: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Trail'
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String
        }
    }],
    hikeBuddy: {
        type: Boolean,
        default: false,
        validate: {
            validator: (value: any) => {
                return typeof value === 'boolean';
            },
            message: 'hikeBuddy must be a boolean value'
        }
    }
});

const UserModel = mongoose.model("User", User);

export default UserModel;