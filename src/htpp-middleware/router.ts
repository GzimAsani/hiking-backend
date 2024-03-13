import express from 'express';
import { HttpRequestHandlers } from '../htpp-middleware/request-handlers';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'src/uploads/profileImages',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
});

const trailImageStorage = multer.diskStorage({
  destination: 'src/uploads/pastTrailImages',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const trailImageUpload = multer({
  storage: trailImageStorage,
});

// Define routes
router.post(
  '/users/:userId/user-trails',
  trailImageUpload.array('images'),
  HttpRequestHandlers.addPastTrail
);
router.get('/users', HttpRequestHandlers.data);
router.get('/users/:userId', HttpRequestHandlers.getUser);
router.post('/users', HttpRequestHandlers.signup);
router.delete('/users/:userId', HttpRequestHandlers.deleteUser);
router.get('/users/email/:email', HttpRequestHandlers.getUserByEmail);
router.post('/login', HttpRequestHandlers.login);
router.post(
  '/users/:userId/favorites/:trailId',
  HttpRequestHandlers.addFavoriteTrail
);
router.delete(
  '/users/:userId/favorites/:trailId',
  HttpRequestHandlers.removeFavoriteTrail
);
router.get('/users/:userId/favorites', HttpRequestHandlers.readFavoriteTrails);
router.put('/users/:userId', HttpRequestHandlers.updateUser);
router.post('/reminder/addReminder', HttpRequestHandlers.saveReminder);
router.delete('/reminder/:reminderId', HttpRequestHandlers.deleteReminder);
router.put('/reminder/updateReminder', HttpRequestHandlers.updateReminder);
router.get('/reminder', HttpRequestHandlers.getAllReminders);
router.post('/users/:userId/user-trails', HttpRequestHandlers.addPastTrail);
router.delete(
  '/users/:userId/user-trails/:trailId',
  HttpRequestHandlers.removePastTrail
);
router.get('/users/:userId/user-trails', HttpRequestHandlers.getPastTrails);

router.get(
  '/users/:userId/user-trails/:trailId',
  HttpRequestHandlers.getSinglePastTrail
);

router.get('/trails', HttpRequestHandlers.getAllTrails);
router.get('/trails/:trailId', HttpRequestHandlers.getTrail);
router.post('/trails', HttpRequestHandlers.createTrail);
router.put('/trails/:trailId', HttpRequestHandlers.updateTrail);
router.delete('/trails/:trailId', HttpRequestHandlers.deleteTrail);
router.post(
  '/trails/:trailId/reviews/:userId',
  HttpRequestHandlers.rateAndReviewTrail
);
router.put(
  '/trails/:trailId/reviews/:userId',
  HttpRequestHandlers.updateRateAndReviewTrail
);
router.delete(
  '/trails/:trailId/reviews/:userId',
  HttpRequestHandlers.deleteReviewTrail
);
router.get('/trails/:trailId/reviews', HttpRequestHandlers.getAllReviews);
router.get('/hikeBuddies', HttpRequestHandlers.getHikeBuddies);
router.post('/hikeBuddies/search', HttpRequestHandlers.searchHikeBuddies);
router.post(
  '/upload/:userId',
  upload.single('profileImage'),
  HttpRequestHandlers.uploadProfileImg
);
router.use(
  '/profileImages',
  express.static(path.join(__dirname, '../uploads/profileImages'))
);
router.use(
  '/pastTrailimages',
  express.static(path.join(__dirname, '../uploads/pastTrailimages'))
);
router.get('/trails/trail/:trailName', HttpRequestHandlers.getTrailByName);

router.get('/events', HttpRequestHandlers.getAllEvents);
router.get('/events/:eventId', HttpRequestHandlers.getEventById)
router.post('/events/:trailId/:creatorId', HttpRequestHandlers.saveEvent);
router.delete('/events/:eventId/:creatorId', HttpRequestHandlers.deleteEventById);
router.put('/events/:eventId/:creatorId', HttpRequestHandlers.updateEventById);

export default router;
