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

export default router;

