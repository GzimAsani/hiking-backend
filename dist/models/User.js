"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User = new mongoose_1.default.Schema({
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Trail'
        }],
    reviews: [{
            trail: {
                type: mongoose_1.default.Schema.Types.ObjectId,
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
const UserModel = mongoose_1.default.model("User", User);
exports.default = UserModel;
//# sourceMappingURL=User.js.map