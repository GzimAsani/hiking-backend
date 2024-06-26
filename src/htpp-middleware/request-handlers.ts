import { UserController } from '../controllers/user';
import { HTTP_CODE } from '../enums/http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { PastTrailsController } from '../controllers/user-trails';
import { TrailController } from '../controllers/trail';
import fs from 'fs';
import { promisify } from 'util';
import EventModel from '../models/Event';
import { EventController } from '../controllers/event';
import mongoose from 'mongoose';
import { Readable } from 'stream';
import { BlogsController } from '../controllers/blogs';
import BlogsModel from '../models/Blogs';
import { ReminderController } from '../controllers/reminder';
import { ReviewController } from '../controllers/review';
import ReviewsModel from '../models/Review';
import TrailModel from '../models/Trail';
import UserModel from '../models/User';
import { ChatRoomController } from '../controllers/chat-room';
import { ChatMessagesContoller } from '../controllers/chat-messages';

export class HttpRequestHandlers {
  static data = async (req: Request, res: Response) => {
    try {
      const userController = new UserController();
      const users = await userController.getUsers();
      res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users));
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };

  static getUser = async (req: Request, res: Response) => {
    try {
      const userId = req.url?.split('/')[2];
      if (!userId) {
        res.writeHead(HTTP_CODE.BadRequest, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'User ID is required' }));
        return;
      }
      const userController = new UserController();
      const user = await userController.getUserById(userId);
      if (!user) {
        res.writeHead(HTTP_CODE.NotFound, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ message: `User ${userId} not found` }));
      } else {
        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };

  static signup = async (req: Request, res: Response) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', async () => {
      try {
        const userObj: any = JSON.parse(data);

        const userController = new UserController();
        const result = await userController.signup(userObj);

        res.writeHead(HTTP_CODE.Created, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify(result));
      } catch (err: any) {
        console.log('AFTER THIS ERROR SHOULD APPEAR');
        console.log(new Error(err).message);

        //console.error('Error:', error);

        res.writeHead(err?.code ? err?.code : HTTP_CODE.InternalServerError, {
          'Content-Type': 'application/json',
        });
        res.end(
          JSON.stringify({
            error: err.message ? err.message : 'Internal Server Error',
          })
        );
      }
    });
  };

  static deleteUser = async (req: Request, res: Response) => {
    try {
      const userId = req.url?.split('/')[2];
      if (!userId) {
        res.writeHead(HTTP_CODE.BadRequest, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'User ID is required' }));
        return;
      }
      const userController = new UserController();
      await userController.deleteUser(userId);
      res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ message: `User ${userId} deleted successfully` })
      );
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };

  static getUserByEmail = async (req: Request, res: Response) => {
    try {
      const urlParts = req.url?.split('/');
      const userEmail = urlParts && urlParts.length >= 4 ? urlParts[3] : '';

      if (!userEmail) {
        res.writeHead(HTTP_CODE.BadRequest, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'User email is required' }));
        return;
      }
      const userController = new UserController();
      const user = await userController.getUserByEmail(userEmail);
      if (!user) {
        res.writeHead(HTTP_CODE.NotFound, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ message: `User ${userEmail} not found` }));
      } else {
        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };

  static login = async (req: Request, res: Response) => {
    // try {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', async () => {
      try {
        const { email, password } = JSON.parse(data);
        const userController = new UserController();
        const result = await userController.login(email, password);
        res.writeHead(result.statusCode, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify(result.data));
      } catch (err: any) {
        console.log('AFTER THIS ERROR SHOULD APPEAR');
        console.log(new Error(err).message);

        //console.error('Error:', error);

        res.writeHead(err?.code ? err?.code : HTTP_CODE.InternalServerError, {
          'Content-Type': 'application/json',
        });
        res.end(
          JSON.stringify({
            error: err.message ? err.message : 'Internal Server Error',
          })
        );
      }
    });
    // } catch (error) {
    //     console.error('Error:', error);
    //     res.writeHead(HTTP_CODE.InternalServerError, { 'Content-Type': 'application/json' });
    //     res.end(JSON.stringify({ error: 'Internal Server Error' }));
    // }
  };

  static addFavoriteTrail = async (req: Request, res: Response) => {
    try {
      const { userId, trailId } = req.params;
      const userController = new UserController();
      await userController.addFavoriteTrail(userId, trailId);
      res
        .status(HTTP_CODE.OK)
        .json({ message: 'Favorite trail added successfully' });
    } catch (error) {
      console.error('Error adding favorite trail:', error);
      res
        .status(HTTP_CODE.InternalServerError)
        .json({ error: 'Failed to add favorite trail' });
    }
  };
  static removeFavoriteTrail = async (req: Request, res: Response) => {
    try {
      const { userId, trailId } = req.params;
      const userController = new UserController();
      await userController.removeFavoriteTrail(userId, trailId);
      res
        .status(HTTP_CODE.OK)
        .json({ message: 'Favorite trail removed successfully' });
    } catch (error) {
      console.error('Error removing favorite trail:', error);
      res
        .status(HTTP_CODE.InternalServerError)
        .json({ error: 'Failed to remove favorite trail' });
    }
  };
  static readFavoriteTrails = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const userController = new UserController();
      const response = await userController.readFavoriteTrails(userId);
      console.log('Response sent:', response);
      res.status(HTTP_CODE.OK).json(response);
    } catch (error) {
      res.status(HTTP_CODE.InternalServerError).json({ error: 'Failed' });
    }
  };

  static updateUser = async (req: Request, res: Response) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', async () => {
      try {
        const userId = req.params.userId;
        const updatedFields = JSON.parse(data);
        if (!userId) {
          res.writeHead(HTTP_CODE.BadRequest, {
            'Content-Type': 'application/json',
          });
          res.end(JSON.stringify({ error: 'User ID is required' }));
          return;
        }
        const userController = new UserController();
        const result = await userController.updateUser(userId, updatedFields);
        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err: any) {
        console.log('AFTER THIS ERROR SHOULD APPEAR');
        console.log(new Error(err).message);

        res.writeHead(err?.code ? err?.code : HTTP_CODE.InternalServerError, {
          'Content-Type': 'application/json',
        });
        res.end(
          JSON.stringify({
            error: err.message ? err.message : 'Internal Server Error',
          })
        );
      }
    });
  };

  static getAllReminders = async (req: Request, res: Response) => {
    try {
      const reminderController = new ReminderController();
      const reminders = await reminderController.getAllReminders();
      res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(reminders));
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };

  static getReminderById = async (req: Request, res: Response) => {
    try {
      const { reminderId } = req.params;

      if (!reminderId) {
        res.writeHead(HTTP_CODE.BadRequest, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'Reminder ID is required' }));
        return;
      }
      const reminderController = new ReminderController();
      const reminder = await reminderController.getReminderById(reminderId);

      if (!reminder) {
        res.writeHead(HTTP_CODE.NotFound, {
          'Content-Type': 'application/json',
        });
        res.end(
          JSON.stringify({ message: `Reminder ${reminderId} not found` })
        );
      } else {
        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(reminder));
      }
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };
  static getUserReminders = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.writeHead(HTTP_CODE.BadRequest, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'User ID is required' }));
        return;
      }
      const reminderController = new ReminderController();
      const reminders = await reminderController.getUserReminders(userId);

      if (!reminders) {
        res.writeHead(HTTP_CODE.NotFound, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ message: `Reminders not found` }));
      } else {
        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(reminders));
      }
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };

  static addPastTrail = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const pastTrailData = req.body;
      const images = req.files as Express.Multer.File[];

      console.log(images);

      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'images',
      });

      for (const file of images) {
        const existingFile = await bucket
          .find({ filename: file.filename })
          .toArray();
        if (existingFile && existingFile.length > 0) {
          continue;
        }

        const uploadStream = bucket.openUploadStream(file.filename);
        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);
      }

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const trailController = new PastTrailsController();
      const result = await trailController.addPastTrail(
        userId,
        pastTrailData,
        images
      );
      res.status(200).json(result);
    } catch (error) {
      console.error('Error adding past trail:', error);
      res.status(500).json({ error: 'Failed to add past trail' });
    }
  };

  static getPastTrailImage = async (req: Request, res: Response) => {
    try {
      const { imageId } = req.params;
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'images',
      });

      const file = await bucket.find({ filename: imageId }).toArray();

      if (!file || file.length === 0) {
        return res.status(404).send('Image not found');
      }

      res.set('Access-Control-Allow-Origin', '*');

      res.contentType('image/png');

      const downloadStream = bucket.openDownloadStreamByName(imageId);
      downloadStream.pipe(res);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };

  static removePastTrail = async (req: Request, res: Response) => {
    try {
      const { userId, trailId } = req.params;
      const trailController = new PastTrailsController();
      await trailController.removePastTrail(userId, trailId);

      res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Past trail removed successfully' }));
    } catch (error) {
      console.error('Error removing past trail:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Failed to remove past trail' }));
    }
  };

  static getPastTrails = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const userController = new PastTrailsController();
      const trails = await userController.getPastTrails(userId);
      res.status(HTTP_CODE.OK).json({ trails: trails });
    } catch (error) {
      console.error('Error reading past trails:', error);
      res
        .status(HTTP_CODE.InternalServerError)
        .json({ error: 'Failed to read past trails' });
    }
  };

  static getSinglePastTrail = async (req: Request, res: Response) => {
    try {
      const { userId, trailId } = req.params;
      const trailController = new PastTrailsController();
      const trail = await trailController.getSingleTrail(userId, trailId);

      if (!trail) {
        res
          .status(HTTP_CODE.NotFound)
          .json({ message: `Trail ${trailId} not found` });
      } else {
        res.status(HTTP_CODE.OK).json(trail);
      }
    } catch (error) {
      console.error('Error retrieving single past trail:', error);
      res
        .status(HTTP_CODE.InternalServerError)
        .json({ error: 'Failed to retrieve past trail' });
    }
  };

  static getAllTrails = async (req: Request, res: Response) => {
    try {
      const trailController = new TrailController();
      const trails = await trailController.getAllTrails();
      res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(trails));
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };

  static getTrail = async (req: Request, res: Response) => {
    try {
      const trailId = req.url?.split('/')[2];
      if (!trailId) {
        res.writeHead(HTTP_CODE.BadRequest, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'User ID is required' }));
        return;
      }
      const trailController = new TrailController();
      const trail = await trailController.getTrailById(trailId);
      if (!trail) {
        res.writeHead(HTTP_CODE.NotFound, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ message: `Trail ${trailId} not found` }));
      } else {
        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(trail));
      }
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };

  static getTrailByName = async (req: Request, res: Response) => {
    try {
      const urlParts = req.url?.split('/');
      const trailName = urlParts && urlParts.length >= 4 ? urlParts[3] : '';

      if (!trailName) {
        res.writeHead(HTTP_CODE.BadRequest, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'Trail name is required' }));
        return;
      }
      const trailController = new TrailController();
      const trail = await trailController.getTrailByName(trailName);
      if (!trail) {
        res.writeHead(HTTP_CODE.NotFound, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ message: `Trail ${trailName} not found` }));
      } else {
        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(trail));
      }
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };

  static deleteTrail = async (req: Request, res: Response) => {
    try {
      const trailId = req.url?.split('/')[2];
      if (!trailId) {
        res.writeHead(HTTP_CODE.BadRequest, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'Trail ID is required' }));
        return;
      }
      const trailController = new TrailController();
      await trailController.deleteTrail(trailId);

      res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ message: `Trail ${trailId} deleted successfully` })
      );
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };

  static createTrail = async (req: Request, res: Response) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', async () => {
      try {
        const trailObj: any = JSON.parse(data);

        const trailController = new TrailController();
        const result = await trailController.createTrail(trailObj);

        res.writeHead(HTTP_CODE.Created, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify(result));
      } catch (err: any) {
        console.log(new Error(err).message);

        res.writeHead(err?.code ? err?.code : HTTP_CODE.InternalServerError, {
          'Content-Type': 'application/json',
        });
        res.end(
          JSON.stringify({
            error: err.message ? err.message : 'Internal Server Error',
          })
        );
      }
    });
  };
  static updateTrail = async (req: Request, res: Response) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', async () => {
      try {
        const trailId = req.params.trailId;
        const updatedFields = JSON.parse(data);
        if (!trailId) {
          res.writeHead(HTTP_CODE.BadRequest, {
            'Content-Type': 'application/json',
          });
          res.end(JSON.stringify({ error: 'Trail ID is required' }));
          return;
        }
        const trailController = new TrailController();
        const result = await trailController.updateTrail(
          trailId,
          updatedFields
        );
        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err: any) {
        console.log(new Error(err).message);
        res.writeHead(err?.code ? err?.code : HTTP_CODE.InternalServerError, {
          'Content-Type': 'application/json',
        });
        res.end(
          JSON.stringify({
            error: err.message ? err.message : 'Internal Server Error',
          })
        );
      }
    });
  };

  static rateAndReviewTrail = async (req: Request, res: Response) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', async () => {
      try {
        const trailId = req.params.trailId;
        const userId = req.params.userId;
        const { rating, comment } = JSON.parse(data);
        if (!trailId || !userId || !rating || !comment) {
          res.writeHead(HTTP_CODE.BadRequest, {
            'Content-Type': 'application/json',
          });
          res.end(
            JSON.stringify({
              error: 'Trail ID, User ID, Rating, and Comment are required',
            })
          );
          return;
        }
        const trailController = new TrailController();
        const result = await trailController.rateAndReviewTrail(
          trailId,
          userId,
          rating,
          comment
        );
        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error) {
        console.error('Error:', error);
        res.writeHead(HTTP_CODE.InternalServerError, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      }
    });
  };

  static updateRateAndReviewTrail = async (req: Request, res: Response) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', async () => {
      try {
        const trailId = req.params.trailId;
        const userId = req.params.userId;
        const { rating, comment } = JSON.parse(data);
        if (!trailId || !userId || !rating || !comment) {
          res.writeHead(HTTP_CODE.BadRequest, {
            'Content-Type': 'application/json',
          });
          res.end(
            JSON.stringify({
              error: 'Trail ID, User ID, Rating, and Comment are required',
            })
          );
          return;
        }
        const trailController = new TrailController();
        const result = await trailController.updateRateAndReviewTrail(
          trailId,
          userId,
          rating,
          comment
        );
        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error) {
        console.error('Error:', error);
        res.writeHead(HTTP_CODE.InternalServerError, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      }
    });
  };

  static deleteReviewTrail = async (req: Request, res: Response) => {
    try {
      const { userId, trailId } = req.params;
      const trailController = new TrailController();
      await trailController.deleteReview(trailId, userId);
      res.status(HTTP_CODE.OK).json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Error deleting review:', error);
      res
        .status(HTTP_CODE.InternalServerError)
        .json({ error: 'Failed to delete review' });
    }
  };

  static getAllReviews = async (req: Request, res: Response) => {
    try {
      const trailId = req.params.trailId;
      const trailController = new TrailController();
      const reviews = await trailController.getAllReivews(trailId);
      res.status(HTTP_CODE.OK).json(reviews);
    } catch (error) {
      console.error('Error:', error);
      res
        .status(HTTP_CODE.InternalServerError)
        .json({ error: 'Internal Server Error' });
    }
  };

  static getHikeBuddies = async (req: Request, res: Response) => {
    try {
      const userController = new UserController();
      const users = await userController.getAllHikeBuddies();
      res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users));
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };

  static searchHikeBuddies = async (req: Request, res: Response) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', async () => {
      try {
        const { fullName, location, skillLevel, gender } = JSON.parse(data);

        const userController = new UserController();
        const hikeBuddies = await userController.searchForHikeBuddies({
          fullName,
          location,
          skillLevel,
          gender,
        });

        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(hikeBuddies));
      } catch (error) {
        console.error('Error:', error);
        res.writeHead(HTTP_CODE.InternalServerError, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      }
    });
  };

  // Import your models

  static getAllEventsByTrailId = async (req: Request, res: Response) => {
    try {
      const { trailId } = req.params;
      const { mode } = req.query; // Accessing the mode query parameter
      const objectIdTrailId = new mongoose.Types.ObjectId(trailId);
      let events: any = [];
      const currentDate = new Date();

      // const descendQuery: any = { date: -1 };
      const ascendQuery: any = { date: 1 };

      switch (mode) {
        case 'incoming':
          events = await EventModel.find({
            trail: objectIdTrailId,
            date: { $gte: currentDate },
          })
            .populate('creator').populate('trail')
            .sort(ascendQuery);
          break;
        case 'past':
          events = await EventModel.find({
            trail: objectIdTrailId,
            date: { $lt: currentDate },
          })
            .populate('creator').populate('trail')
            .sort(ascendQuery);
          break;
        default:
          events = await EventModel.find({ trail: objectIdTrailId })
            .populate('creator').populate('trail')
            .sort(ascendQuery);
          break;
      }

      res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(events));
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };

  static getAllEvents = async (req: Request, res: Response) => {
    try {
      //-1 is desc / 1 is asc

      const allEvents = await EventModel.find()
        .populate('creator', 'firstName lastName')
        .populate('trail')
        .sort({ date: -1 });

      res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(allEvents));
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };

  static getEventById = async (req: Request, res: Response) => {
    try {
      const eventId = req.params.eventId;
      if (!eventId) {
        res.writeHead(HTTP_CODE.BadRequest, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'Event ID is required' }));
        return;
      }
      const eventController = new EventController();
      const event = await eventController.getEventById(eventId);

      if (!event) {
        res.writeHead(HTTP_CODE.NotFound, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'Event not found' }));
        return;
      }

      res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(event));
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };
  static saveEvent = async (req: Request, res: Response) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', async () => {
      try {
        const trailId = req.params.trailId;
        const creatorId = req.params.creatorId;
        const eventObj: any = JSON.parse(data);

        const eventController = new EventController();
        const result = await eventController.saveEvent(
          eventObj,
          trailId,
          creatorId
        );

        res.writeHead(HTTP_CODE.Created, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify(result));
        res
          .status(HTTP_CODE.Created)
          .json({ message: 'Event saved successfully', result });
      } catch (err: any) {
        console.log(new Error(err).message);

        // res.writeHead(err?.code ? err?.code : HTTP_CODE.InternalServerError, {
        //   'Content-Type': 'application/json',
        // });
        // res.end(
        //   JSON.stringify({
        //     error: err.message ? err.message : 'Internal Server Error',
        //   })
        // );
      }
    });
  };
  static deleteEventById = async (req: Request, res: Response) => {
    try {
      const { eventId, creatorId } = req.params;
      const eventController = new EventController();
      const event = await EventModel.findById(eventId);

      if (!event) {
        res.status(HTTP_CODE.NotFound).json({ error: 'Event not found' });
        return;
      }

      if (event.creator.toString() !== creatorId.toString()) {
        res
          .status(HTTP_CODE.Forbidden)
          .json({ error: 'You are not authorized to delete this event' });
        return;
      }
      await eventController.deleteEvent(eventId, creatorId);
      res.status(HTTP_CODE.OK).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res
        .status(HTTP_CODE.InternalServerError)
        .json({ error: 'Internal Server Error' });
    }
  };

  static updateEventById = async (req: Request, res: Response) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', async () => {
      try {
        const { eventId, creatorId } = req.params;
        const updatedFields = JSON.parse(data);
        if (!eventId) {
          res.writeHead(HTTP_CODE.BadRequest, {
            'Content-Type': 'application/json',
          });
          res.end(JSON.stringify({ error: 'Event ID is required' }));
          return;
        }
        if (!creatorId) {
          res.writeHead(HTTP_CODE.BadRequest, {
            'Content-Type': 'application/json',
          });
          res.end(JSON.stringify({ error: 'Creator ID is required' }));
          return;
        }
        const eventController = new EventController();
        const result = await eventController.updateEvent(
          updatedFields,
          eventId,
          creatorId
        );
        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err: any) {
        console.log(new Error(err).message);
        res.writeHead(err?.code ? err?.code : HTTP_CODE.InternalServerError, {
          'Content-Type': 'application/json',
        });
        res.end(
          JSON.stringify({
            error: err.message ? err.message : 'Internal Server Error',
          })
        );
      }
    });
  };
  static joinEvent = async (req: Request, res: Response) => {
    try {
      const { eventId, userId } = req.params;
      const eventController = new EventController();
      await eventController.joinEvent(eventId, userId);
      res
        .status(HTTP_CODE.OK)
        .json({ message: 'User joined event successfully' });
    } catch (error) {
      console.error('Error joining to event:', error);
      res
        .status(HTTP_CODE.InternalServerError)
        .json({ error: 'Failed to join event' });
    }
  };
  static leaveEvent = async (req: Request, res: Response) => {
    try {
      const { eventId, userId } = req.params;
      const eventController = new EventController();
      await eventController.leaveEvent(eventId, userId);
      res
        .status(HTTP_CODE.OK)
        .json({ message: 'User left event successfully' });
    } catch (error) {
      console.error('Error leaving event:', error);
      res
        .status(HTTP_CODE.InternalServerError)
        .json({ error: 'Failed to leave event' });
    }
  };

  static saveBlog = async (req: Request, res: Response) => {
    try {
      const { authorId } = req.params;
      const blogData = req.body;
      const images = req.files as Express.Multer.File[];

      if (!authorId) {
        return res.status(400).json({ error: 'Author ID is required' });
      }

      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'images',
      });

      for (const file of images) {
        const existingFile = await bucket
          .find({ filename: file.filename })
          .toArray();
        if (existingFile && existingFile.length > 0) {
          continue;
        }

        const uploadStream = bucket.openUploadStream(file.filename);
        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);
      }

      const blogController = new BlogsController();
      const result = await blogController.saveBlog(authorId, blogData, images);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error adding blog post:', error);
      res.status(500).json({ error: 'Failed to add blog post' });
    }
  };
  static getAllBlogs = async (req: Request, res: Response) => {
    try {
      const blogsController = new BlogsController();
      const blogs = await blogsController.getBlogs();
      res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(blogs));
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };
  static getBlogsById = async (req: Request, res: Response) => {
    try {
      const blogId = req.url?.split('/')[2];
      if (!blogId) {
        res.writeHead(HTTP_CODE.BadRequest, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'Blog ID is required' }));
        return;
      }
      const blog = await BlogsModel.findById(blogId);

      if (!blog) {
        res.writeHead(HTTP_CODE.NotFound, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ message: `Blog ${blogId} not found` }));
      } else {
        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(blog));
      }
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };

  static getBlogsByUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      console.log('User ID :', userId);
      const blogsController = new BlogsController();
      const blogs = await blogsController.getBlogsByUser(userId);
      console.log('USERS BLOGS :', blogs);
      res.status(HTTP_CODE.OK).json({ blogs: blogs });
    } catch (error) {
      console.error('Error reading past trails:', error);
      res
        .status(HTTP_CODE.InternalServerError)
        .json({ error: 'Failed to read past trails' });
    }
  };

  static updateBlog = async (req: Request, res: Response) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', async () => {
      try {
        const blogId = req.params.blogId;
        const updatedFields = JSON.parse(data);
        if (!blogId) {
          res.writeHead(HTTP_CODE.BadRequest, {
            'Content-Type': 'application/json',
          });
          res.end(JSON.stringify({ error: 'User ID is required' }));
          return;
        }
        const blogsController = new BlogsController();
        const result = await blogsController.updateBlog(blogId, updatedFields);
        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err: any) {
        console.log('AFTER THIS ERROR SHOULD APPEAR');
        console.log(new Error(err).message);

        res.writeHead(err?.code ? err?.code : HTTP_CODE.InternalServerError, {
          'Content-Type': 'application/json',
        });
        res.end(
          JSON.stringify({
            error: err.message ? err.message : 'Internal Server Error',
          })
        );
      }
    });
  };

  static deleteBlogById = async (req: Request, res: Response) => {
    try {
      const { blogId, authorId } = req.params;
      const blog = await BlogsModel.findById(blogId);
      const blogsController = new BlogsController();

      if (!blog) {
        res.status(HTTP_CODE.NotFound).json({ error: 'Blog not found' });
        return;
      }

      if (blog.author.toString() !== authorId.toString()) {
        res
          .status(HTTP_CODE.Forbidden)
          .json({ error: 'You are not authorized to delete this blog' });
        return;
      }
      await blogsController.deleteBlog(blogId, authorId);
      res.status(HTTP_CODE.OK).json({ message: 'Blog deleted successfully' });
    } catch (error) {
      console.error('Error deleting blog:', error);
      res
        .status(HTTP_CODE.InternalServerError)
        .json({ error: 'Internal Server Error' });
    }
  };

  static getAllReviewsComponent = async (req: Request, res: Response) => {
    try {
      const reviewController = new ReviewController();
      const reviews = await reviewController.getReviews();
      res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(reviews));
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };

  static getAllReviewsById = async (req: Request, res: Response) => {
    try {
      const reviewId = req.url?.split('/')[2];
      if (!reviewId) {
        res.writeHead(HTTP_CODE.BadRequest, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'Review ID is required' }));
        return;
      }
      const blog = await BlogsModel.findById(reviewId);

      if (!blog) {
        res.writeHead(HTTP_CODE.NotFound, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ message: `Review ${reviewId} not found` }));
      } else {
        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(blog));
      }
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };

  static saveReviews = async (req: Request, res: Response) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', async () => {
      try {
        const reviewsObj: any = JSON.parse(data);
        const reviewController = new ReviewController();
        const result = await reviewController.saveReview(reviewsObj);

        res.writeHead(HTTP_CODE.Created, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify(result));
      } catch (err: any) {
        console.log('AFTER THIS ERROR SHOULD APPEAR');
        console.log(new Error(err).message);

        res.writeHead(err?.code ? err?.code : HTTP_CODE.InternalServerError, {
          'Content-Type': 'application/json',
        });
        res.end(
          JSON.stringify({
            error: err.message ? err.message : 'Internal Server Error',
          })
        );
      }
    });
  };

  static deleteReview = async (req: Request, res: Response) => {
    try {
      const { reviewId, authorId } = req.params;
      const review = await ReviewsModel.findById(reviewId);
      const reviewController = new ReviewController();

      if (!review) {
        res.status(HTTP_CODE.NotFound).json({ error: 'Review not found' });
        return;
      }

      if (review.author.toString() !== authorId.toString()) {
        res
          .status(HTTP_CODE.Forbidden)
          .json({ error: 'You are not authorized to delete this review' });
        return;
      }
      await reviewController.deleteReview(reviewId, authorId);
      res.status(HTTP_CODE.OK).json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Error deleting blog:', error);
      res
        .status(HTTP_CODE.InternalServerError)
        .json({ error: 'Internal Server Error' });
    }
  };

  static updateReview = async (req: Request, res: Response) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', async () => {
      try {
        const reviewId = req.params.reviewId;
        const updateReview = JSON.parse(data);
        if (!reviewId) {
          res.writeHead(HTTP_CODE.BadRequest, {
            'Content-Type': 'application/json',
          });
          res.end(
            JSON.stringify({ error: 'Review ID is required or miss typed' })
          );
          return;
        }
        const reviewController = new ReviewController();
        const result = await reviewController.updateReview(
          reviewId,
          updateReview
        );
        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err: any) {
        console.log('AFTER THIS ERROR SHOULD APPEAR');
        console.log(new Error(err).message);

        res.writeHead(err?.code ? err?.code : HTTP_CODE.InternalServerError, {
          'Content-Type': 'application/json',
        });
        res.end(
          JSON.stringify({
            error: err.message ? err.message : 'Internal Server Error',
          })
        );
      }
    });
  };

  static uploadProfilePicture = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const image = req.file as Express.Multer.File;

      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'images',
      });

      const uploadStream = bucket.openUploadStream(image.filename);
      const readableStream = new Readable();
      readableStream.push(image.buffer);
      readableStream.push(null);

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const userController = new UserController();
      const result = await userController.uploadProfilePicture(userId, image);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error handling profile picture upload:', error);
      res
        .status(500)
        .json({ error: 'Failed to handle profile picture upload' });
    }
  };

  static readImageFromBucket = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const filename = req.params.filename;
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'images',
    });

    const downloadStream = bucket.openDownloadStreamByName(filename);
    console.log(downloadStream);

    let imageData = Buffer.from([]);

    downloadStream.on('data', (chunk) => {
      imageData = Buffer.concat([imageData, chunk]);
    });

    downloadStream.on('end', () => {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Content-Type', 'image/jpeg');
      res.send(imageData);
    });

    downloadStream.on('error', (error) => {
      console.error('Error reading image from GridFS:', error);
      res.status(500).json({ error: 'Failed to read image' });
    });
  };

  static getAllChatRooms = async (req: Request, res: Response) => {
    try {
      const chatRoomController = new ChatRoomController();
      const chatRooms = await chatRoomController.getAllChatRooms();
      res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(chatRooms));
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };

  static getChatRoomById = async (req: Request, res: Response) => {
    try {
      const { chatRoomId } = req.params;
      
      if (!chatRoomId) {
        res.writeHead(HTTP_CODE.BadRequest, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'Chat Room ID is required' }));
        return;
      }
      const chatRoomController = new ChatRoomController();
      const chatRoom = await chatRoomController.getChatRoomById(chatRoomId);
      
      if (!chatRoom) {
        res.writeHead(HTTP_CODE.NotFound, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ message: `Chat Room ${chatRoom} not found` }));
      } else {
        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(chatRoom));
      }
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };
  static sendMessage = async (req: Request, res: Response) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', async () => {
      try {
        const { chatRoomId, senderId } = req.params;
        const messageObject = JSON.parse(data);
        const message = messageObject.message;
        if (!chatRoomId || !senderId || !message) {
          res.status(HTTP_CODE.BadRequest).json({ error: 'Chat Room ID, Sender Id, and message are required' });
          return;
        }
  
        const chatMessagesController = new ChatMessagesContoller();
        const result = await chatMessagesController.sendMessage(chatRoomId, senderId, message);
  
        res.status(HTTP_CODE.OK).json(result);
      } catch (error) {
        console.error('Error:', error);
        res.status(HTTP_CODE.InternalServerError).json({ error: 'Internal Server Error' });
      }
    });
  };
  

  static getAllMessagesInAChatRoom = async (req: Request, res: Response) => {
    try {
      const { chatRoomId } = req.params;

      if (!chatRoomId) {
          res.status(HTTP_CODE.BadRequest).json({ error: 'Chat Room ID is required' });
          return;
      }

      const chatMessagesController = new ChatMessagesContoller();
      const messages = await chatMessagesController.getAllMessagesInRoom(chatRoomId);

      res.status(HTTP_CODE.OK).json(messages);
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(HTTP_CODE.InternalServerError).json({ error: 'Internal Server Error' });
    }
  }
}
