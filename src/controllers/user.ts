import UserModel from '../models/User';
import bcrypt from 'bcrypt';
import { TokenService } from '../services/tokenService';
import { HTTP_CODE } from '../enums/http-status-codes';

export class UserController {
    async getUsers() {
        try {
            const users = await UserModel.find();
            return users;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async getUserById(userId: string) {
        try {
            const user = await UserModel.findById(userId);
            return user;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async signup(userObj: any) {
            const { firstName, lastName, email, password } = userObj;
            if (!firstName || !lastName) {
                throw new Error('First name and last name are required');
            }
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                throw new Error('User already exists');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({
                firstName,
                lastName,
                email,
                password: hashedPassword
            });
            await newUser.save();
            return { message: 'User created successfully' };
    }

    async deleteUser(userId: string) {
        try {
            await UserModel.findByIdAndDelete(userId);
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async getUserByEmail(email: string) {
        try {
            const user = await UserModel.findOne({ email });
            return user;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }    

    async login(email: string, password: string) {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return {
                    statusCode: HTTP_CODE.NotFound,
                    data: { message: 'User not found' }
                };
            }

            const passwordMatch = await bcrypt.hash(password, 10);
            if (!passwordMatch) {
                return {
                    statusCode: HTTP_CODE.Unauthorized,
                    data: { message: 'Invalid email or password' }
                };
            }

            const tokenService = new TokenService();
            const token = tokenService.generateLoginToken(email);

            return {
                statusCode: HTTP_CODE.OK,
                data: { message: 'Login successful', token }
            };
        } catch (error) {
            console.error('Error:', error);
            return {
                statusCode: HTTP_CODE.InternalServerError,
                data: { error: 'Internal Server Error' }
            };
        }
    }
}
