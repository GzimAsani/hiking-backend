import mongoose from "mongoose";
import bcrypt from "bcrypt";

const User = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true,
        minlength: [6, 'Username must be at least 6 characters long'],
        maxlength: [50, 'Username cannot exceed 50 characters']
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
