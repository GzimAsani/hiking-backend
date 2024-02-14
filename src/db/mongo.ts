import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://root:root@cluster0.ybirikr.mongodb.net/hiking-app?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});
