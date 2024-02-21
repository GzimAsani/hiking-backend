import express from 'express';
import { HttpRequestHandlers } from '../htpp-middleware/request-handlers';

const router = express.Router();

// Define routes
router.get('/users', HttpRequestHandlers.data)
router.get('/users/:userId', HttpRequestHandlers.getUser);
router.post('/users', HttpRequestHandlers.signup);
router.delete('/users/:userId', HttpRequestHandlers.deleteUser);
router.get('/users/email/:email', HttpRequestHandlers.getUserByEmail);
router.post('/login', HttpRequestHandlers.login);
router.post('/users/:userId/favorites/:trailId', HttpRequestHandlers.addFavoriteTrail);
router.delete('/users/:userId/favorites/:trailId', HttpRequestHandlers.removeFavoriteTrail);
router.get('/users/:userId/favorites', HttpRequestHandlers.readFavoriteTrails)
router.put('/users/:userId', HttpRequestHandlers.updateUser);
router.post('/reminder/addReminder', HttpRequestHandlers.saveReminder);
router.delete('/reminder/:reminderId', HttpRequestHandlers.deleteReminder);
router.put('/reminder/updateReminder', HttpRequestHandlers.updateReminder);
router.get('/reminder', HttpRequestHandlers.getAllReminders)

export default router;

