import UserModel from '../models/User';
import bcrypt from 'bcrypt';
import { TokenService } from '../services/tokenService';
import { HTTP_CODE } from '../enums/http-status-codes';
import mongoose from 'mongoose';

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
            const customError: any = new Error('First name and last name are required!');
            customError.code = HTTP_CODE.NotFound;

            throw customError
        }
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            const customError: any = new Error('This email has already been registered!');
            customError.code = HTTP_CODE.NotFound

            throw customError
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new UserModel({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });
        await newUser.save();
        return { message: 'User created successfully!' };
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
        const user = await UserModel.findOne({ email });
        if (!user) {
            const customError: any = new Error('User not found!');
            customError.code = HTTP_CODE.NotFound;

            throw customError
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            const customError: any = new Error('Inccorect password!');
            customError.code = HTTP_CODE.Unauthorized;

            throw customError
        }

        const tokenService = new TokenService();
        const token = tokenService.generateLoginToken(email);

        return {
            statusCode: HTTP_CODE.OK,
            data: { message: 'Login successefully!', token }
        };

    }

    async addFavoriteTrail(userId: string, trailId: string) {

        // try {
        const query = { _id: userId } //find user by ID
        const newFavoriteTrailId = new mongoose.Types.ObjectId(trailId); //
        const update = {
            $addToSet: { trailFavorites: newFavoriteTrailId }
        };
        const options = { upsert: true }; //do not accept duplification
        console.log("ObjectIdTrailId:", newFavoriteTrailId);
        const response = await UserModel.updateOne(query, update, options)
        console.log(response)
        return response
        // } catch (error) {
        //     console.error('Error adding favorite trail:', error);
        //     throw new Error('Failed to add favorite trail');
        // }
    }

    async removeFavoriteTrail(userId: string, trailId: string) {
        // try {
        const query = { _id: userId }
        const update = {
            $pull: { trailFavorites: trailId }
        };

        const response = await UserModel.updateOne(query, update)
        console.log(response)
        return response
        // } catch (error) {
        //     console.error('Error removing favorite trail:', error);
        //     throw new Error('Failed to remove favorite trail');
        // }
    }


    async readFavoriteTrails(userId: string) {

        const response = await UserModel.findById(userId)
        return response?.trailFavorites

    }

}
