import express from 'express';
import { UserController } from '../controllers/UserController';

const router = express.Router();

// Define routes
router.get('/user/:userId', UserController.getUser);
router.post('/user', UserController.saveUser);
router.delete('/user/:userId', UserController.deleteUser);
router.get('/userByEmail/:email', UserController.getUserByEmail);
router.post('/login', UserController.login);

export default router;
