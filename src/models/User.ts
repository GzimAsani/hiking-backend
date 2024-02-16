import mongoose from "mongoose";
import bcrypt from "bcrypt";

const User = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: [1, 'First name must be at least 2 character long'],
        maxlength: [20, 'First name cannot exceed 20 characters']
    },
    lastName: {
        type: String,
        required: true,
        minlength: [1, 'Last name must be at least 1 character long'],
        maxlength: [20, 'Last name cannot exceed 20 characters']
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
    favorites: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Trail' 
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

User.pre("save", function(next) {
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    
    bcrypt.hash(user.password, 10)
        .then((hashedPassword) => {
            user.password = hashedPassword;
            next();
        })
        .catch((error) => {
            next(error);
        });
});


const UserModel = mongoose.model("User", User);

export default UserModel;