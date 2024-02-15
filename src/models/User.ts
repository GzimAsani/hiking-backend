import mongoose from "mongoose";

const User = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
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
        default: false
    }
});

const UserModel = mongoose.model("User", User);

export default UserModel;