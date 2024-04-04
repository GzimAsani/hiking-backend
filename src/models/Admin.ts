const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'moderator', 'user'], default: 'user' }
});

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    permissions: [{ type: String }]
});

const permissionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


const imageSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    fileType: { type: String, required: true },
    size: { type: Number, required: true },
    blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
    createdAt: { type: Date, default: Date.now }
});

const logSchema = new mongoose.Schema({
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const sessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true }
});

const User = mongoose.model('User', userSchema);
const Role = mongoose.model('Role', roleSchema);
const Permission = mongoose.model('Permission', permissionSchema);
const Blog = mongoose.model('Blog', blogSchema);
const ImageModel = mongoose.model('Image', imageSchema);
const Log = mongoose.model('Log', logSchema);
const Session = mongoose.model('Session', sessionSchema);


module.exports = { User, Role, Permission, Blog, Image, Log, Session };
