import { Request, Response } from 'express';
import UserModel from '../models/User';
import bcrypt from 'bcrypt';
import { TokenService } from '../services/tokenService';
import { HTTP_CODE } from '../enums/http-status-codes';

export class UserController {
    async getUsers(req: Request, res: Response) {
        try {
            const users = await UserModel.find();
            res.status(HTTP_CODE.OK).json(users);
            
        } catch (error) {
            console.error('Error:', error);
            res.status(HTTP_CODE.InternalServerError).json({ error: 'Internal Server Error' });
        }
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            const user = await UserModel.findOne({ email: email });
            
            if (!user) {
                res.status(HTTP_CODE.NotFound).json({ message: 'User not found' });
                return;
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                res.status(HTTP_CODE.Unauthorized).json({ message: 'Invalid email or password' });
                return;
            }

            const tokenService = new TokenService();
            const token = tokenService.generateLoginToken(email);

            res.status(HTTP_CODE.OK).json({ message: 'Login successful', token });

        } catch (error) {
            console.error('Error:', error);
            res.status(HTTP_CODE.InternalServerError).json({ error: 'Internal Server Error' });
        }
    }

    async saveUser(userObj: any) {
        try {
            const newUser = await UserModel.create(userObj);
            return newUser;
        } catch (error) {
            console.error('Error:', error);
            throw 'Internal Server Error';
        }
    }
    
    async getUserByEmail(email: string) {
        try {
            const user = await UserModel.findOne({ email });
            return user;
        } catch (error) {
            console.error('Error:', error);
            throw 'Internal Server Error';
        }
    }
}