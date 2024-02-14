import mongoose from "mongoose";

const Trail = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    location: { 
        type: String, 
        required: true 
    },
    difficulty: { 
        type: String, 
        required: true 
    },
    length: { 
        type: String, 
        required: true 
    },
    status: {
        type: Boolean,
        default: true
    },
    description: { 
        type: String 
    },
    photos: {
        type: [String],
        required: true,
    },
    keyFeatures: {
        type: [String]
    },
    ratings: [{
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        },
        rating: { 
            type: Number, 
            required: true, 
            min: 1, 
            max: 5 
        }
    }]
});

const TrailModel = mongoose.model("Trail", Trail);

export default TrailModel;
