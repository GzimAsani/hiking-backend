import UserModel from '../models/User';
import bcrypt from 'bcrypt';
import { TokenService } from '../services/tokenService';
import { HTTP_CODE } from '../enums/http-status-codes';
import mongoose from 'mongoose';
import { config } from "../config";

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
        const { firstName, lastName, email, password, ...rest } = userObj;
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
            password: hashedPassword,
            ...rest
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
        const expiresIn = config.token_expire;

        return {
            statusCode: HTTP_CODE.OK,
            data: { message: 'Login successefully!', user, token, expiresIn }
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
        console.log({ trailId })
        const query = { _id: userId }
        const trailFavoriteToBeDeleted = new mongoose.Types.ObjectId(trailId);
        const update = {
            $pull: { trailFavorites: trailFavoriteToBeDeleted }
        };

        const response = await UserModel.updateOne(query, update)
        return response
        // } catch (error) {
        //     console.error('Error removing favorite trail:', error);
        //     throw new Error('Failed to remove favorite trail');
        // }
    }


    async readFavoriteTrails(userId: string) {

        const response = await UserModel.findById(userId).populate('trailFavorites')

        return response?.trailFavorites

    }

    async updateUser(userId: string, updatedFields: any) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                const customError: any = new Error('User not found!');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }
    
            const { age, gender, description, location, availability, skillLevel, interests, phoneNumber, 
                socialMedia, equipment, hikeBuddy } = updatedFields;
    
            console.log("User before update:", user);
            console.log(updatedFields);
    
            if (age) {
                if (age < 1 || age > 150) {
                    const customError: any = new Error('Age must be between 1 and 150');
                    customError.code = HTTP_CODE.BadRequest;
                    throw customError;
                }
                user.age = age;
            }
            if (gender) {
                if (!['male', 'female'].includes(gender)) {
                    const customError: any = new Error('Gender must be either "male" or "female"');
                    customError.code = HTTP_CODE.BadRequest;
                    throw customError;
                }
                user.gender = gender;
            }
            if (location) {
                user.location = location;
            }
            if (availability) {
                user.availability = availability;
            }
            if (skillLevel) {
                if (!['beginner', 'intermediate', 'advanced'].includes(skillLevel)) {
                    const customError: any = new Error('Skill level must be one of: "beginner", "intermediate", "advanced"');
                    customError.code = HTTP_CODE.BadRequest;
                    throw customError;
                }
                user.skillLevel = skillLevel;
            }
            if (interests) {
                user.interests = interests;
            }
            if (description) {
                user.description = description;
            }
            if (phoneNumber) {
                user.phoneNumber = phoneNumber;
            }
            if (user.socialMedia) {
                if (socialMedia) {
                    if (socialMedia.facebook) {
                        user.socialMedia.facebook = socialMedia.facebook;
                    }
                    if (socialMedia.twitter) {
                        user.socialMedia.twitter = socialMedia.twitter;
                    }
                    if (socialMedia.instagram) {
                        user.socialMedia.instagram = socialMedia.instagram;
                    }
                }
            }
            if (equipment) {
                user.equipment = equipment;
            }
            if (hikeBuddy !== undefined) {
                if (typeof hikeBuddy !== 'boolean') {
                    const customError: any = new Error('Invalid hikeBuddy value');
                    customError.code = HTTP_CODE.BadRequest;
                    throw customError;
                }
                user.hikeBuddy = hikeBuddy;
            }
    
            console.log("User after update:", user);
    
            await user.save();
    
            return user;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async getAllHikeBuddies() {
        try {
            const hikeBuddies = await UserModel.find({ hikeBuddy: true });
            return hikeBuddies;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async searchForHikeBuddies(filters: any) {
        try {
            const {
                fullName,
                location,
                gender,
                skillLevel
            } = filters;
    
            const query: any = {};
            
            if (fullName) {
                query.$or = [
                    { firstName: { $regex: new RegExp(fullName, "i") } },
                    { lastName: { $regex: new RegExp(fullName, "i") } }
                ];
            }
    
            if (location) {
                query.location = { $regex: new RegExp(location, "i") };
            }
    
            if (gender) {
                query.gender = gender;
            }
    
            if (skillLevel) {
                query.skillLevel = skillLevel;
            }
    
            const hikeBuddies = await UserModel.find({ ...query, hikeBuddy: true });
            return hikeBuddies;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }
    
    static async uploadProfileImg(userId:string, profileImage:any) {
        try {
          if (!profileImage) {
            throw new Error('No profile image provided');
          }
      
          const user = await UserModel.findByIdAndUpdate(
            userId,
            { profileImg: profileImage.filename },
            { new: true }
          );
      
          if (!user) {
            throw new Error('User not found');
          }
      
          return { message: 'Profile image uploaded successfully', user };
        } catch (error) {
          console.error('Error uploading profile image:', error);
          throw new Error('Internal server error');
        }
    }
       
}
