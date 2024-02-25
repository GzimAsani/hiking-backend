import * as http from 'http';
import { UserController } from '../controllers/user';
import { HTTP_CODE } from '../enums/http-status-codes';
import { Request, Response } from 'express';
import { stringify } from 'querystring';
import ReminderModel from '../models/Reminder';
import { ReminderController } from '../controllers/reminder';
import { PastTrailsController } from '../controllers/user-trails';
import { TrailController } from '../controllers/trail';

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
      const allReminders = await ReminderModel.find();
      res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(allReminders));
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };

  static saveReminder = async (req: Request, res: Response) => {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', async () => {
      try {
        const reminderObj: any = JSON.parse(data);

        const reminderController = new ReminderController();
        const result = await reminderController.saveReminder(reminderObj);

        res.writeHead(HTTP_CODE.Created, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify(result));
      } catch (err: any) {
        console.error('An error occurred while saving reminder:', err);

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

  static updateReminder = async (req: Request, res: Response) => {
    const Reminder = require('../models/Reminder');
    try {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', async () => {
        try {
          const { id, date, time, location, description } = JSON.parse(data);

          const existingReminder = await Reminder.findById(id);

          if (!existingReminder) {
            res.writeHead(HTTP_CODE.NotFound, {
              'Content-Type': 'application/json',
            });
            res.end(JSON.stringify({ error: 'Reminder not found' }));
            return;
          }

          existingReminder.date = date;
          existingReminder.time = time;
          existingReminder.location = location;
          existingReminder.description = description;

          const updatedReminder = await existingReminder.save();

          res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(updatedReminder));
        } catch (error) {
          console.error('Error:', error);
          res.writeHead(HTTP_CODE.InternalServerError, {
            'Content-Type': 'application/json',
          });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
      });
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };

  static deleteReminder = async (req: Request, res: Response) => {
    try {
      const reminderId = req.url?.split('/')[2];
      if (!reminderId) {
        res.writeHead(HTTP_CODE.BadRequest, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'Reminder ID is required' }));
        return;
      }
      const reminderController = new ReminderController();
      await reminderController.deleteReminder(reminderId);
      if (!reminderController) {
        res.writeHead(HTTP_CODE.NotFound, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'Reminder not found' }));
        return;
      }
      res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `Reminder deleted successfully` }));
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
      const trailController = new PastTrailsController();
      await trailController.addPastTrail(userId, pastTrailData);
      res
        .status(HTTP_CODE.OK)
        .json({ message: 'Past trail added successfully' });
    } catch (error) {
      console.error('Error adding past trail:', error);
      res
        .status(HTTP_CODE.InternalServerError)
        .json({ error: 'Failed to add past trail' });
    }
  };

  static removePastTrail = async (req: Request, res: Response) => {
    try {
      const { userId, trailId } = req.params;
      const trailController = new PastTrailsController();
      await trailController.removePastTrail(userId, trailId);
      res
        .status(HTTP_CODE.OK)
        .json({ message: 'Past trail removed successfully' });
    } catch (error) {
      console.error('Error removing past trail:', error);
      res
        .status(HTTP_CODE.InternalServerError)
        .json({ error: 'Failed to remove past trail' });
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

  static getAllTrails = async (req: Request, res: Response) => {
    try {
      const trailController = new TrailController();
      const trails = await trailController.getAllTrails();
      res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(trails));
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  }

  static getTrail = async (req: Request, res: Response) => {
    try {
      const trailId = req.url?.split('/')[2];
      if (!trailId) {
        res.writeHead(HTTP_CODE.BadRequest, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'User ID is required' }));
        return;
      }
      const trailController = new TrailController();
      const trail = await trailController.getTrailById(trailId);
      if (!trail) {
        res.writeHead(HTTP_CODE.NotFound, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `Trail ${trailId} not found` }));
      } else {
        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(trail));
      }
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  }

  static deleteTrail = async (req: Request, res: Response) => {
    try {
      const trailId = req.url?.split('/')[2];
      if (!trailId) {
        res.writeHead(HTTP_CODE.BadRequest, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Trail ID is required' }));
        return;
      }
      const trailController = new TrailController();
      await trailController.deleteTrail(trailId);

      res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `Trail ${trailId} deleted successfully` }));
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  }

  static createTrail = async (req: Request, res: Response) => {

    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', async () => {
      try {
        const trailObj: any = JSON.parse(data);

        const trailController = new TrailController();
        const result = await trailController.createTrail(trailObj);

        res.writeHead(HTTP_CODE.Created, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err: any) {
        console.log(new Error(err).message)

        res.writeHead(err?.code ? err?.code : HTTP_CODE.InternalServerError, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message ? err.message : "Internal Server Error" }));
      }
    });
  }
  static updateTrail = async (req: Request, res: Response) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', async () => {
      try {
        const trailId = req.params.trailId;
        const updatedFields = JSON.parse(data);
        if (!trailId) {
          res.writeHead(HTTP_CODE.BadRequest, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Trail ID is required' }));
          return;
        }
        const trailController = new TrailController();
        const result = await trailController.updateTrail(trailId, updatedFields);
        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err: any) {
        console.log(new Error(err).message)
        res.writeHead(err?.code ? err?.code : HTTP_CODE.InternalServerError, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message ? err.message : "Internal Server Error" }));
      }
    });
  }
}
