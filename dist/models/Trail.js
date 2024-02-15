"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Trail = new mongoose_1.default.Schema({
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
                type: mongoose_1.default.Schema.Types.ObjectId,
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
const TrailModel = mongoose_1.default.model("Trail", Trail);
exports.default = TrailModel;
//# sourceMappingURL=Trail.js.map