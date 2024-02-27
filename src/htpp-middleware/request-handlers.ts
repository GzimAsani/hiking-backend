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

  static uploadProfileImg = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const profileImage = req.file;

      if (!userId) {
        res.writeHead(HTTP_CODE.BadRequest, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'User ID is required' }));
        return;
      }
      const result = await UserController.uploadProfileImg(userId, profileImage);
      res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (error) {
      console.error('Error uploading the image:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };

  static getAllReminders = async (req: Request, res: Response) => {
    try {
      const {trailId} = req.params;
      const reminderController = new ReminderController();
      const reminders = await reminderController.getAllReminders(trailId);
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

  static getAReminder = async (req:Request, res: Response) => {
    try {
      const {trailId, reminderId} = req.params;
      const reminderController = new ReminderController();
      const reminder = await reminderController.getAReminder(trailId, reminderId);
      res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(reminder));
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  }

  static deleteReminder = async (req: Request, res: Response) => {
    try {
      const {trailId, reminderId} = req.params;
      if (!trailId) {
        res.writeHead(HTTP_CODE.BadRequest, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'Trail ID is required' }));
        return;
      }
      if (!reminderId) {
        res.writeHead(HTTP_CODE.BadRequest, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'Reminder ID is required' }));
        return;
      }
      const reminderController = new ReminderController();
      reminderController.deleteReminder(trailId, reminderId);
      res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ message: `Reminder ${reminderId} deleted successfully` })
      );
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
        const { trailId } = req.params;
        const reminderData = JSON.parse(data);
        const reminderController = new ReminderController();
        const result = await reminderController.saveReminder(trailId, reminderData);
        res.writeHead(HTTP_CODE.Created, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify(result));

      } catch (err:any) {
        res.writeHead(err?.code ? err?.code : HTTP_CODE.InternalServerError, {
          'Content-Type': 'application/json',
        });
        res.end(
          JSON.stringify({
            error: err.message ? err.message : 'Internal Server Error',
          })
        );
      }
    })

  }
  static updateReminder = async (req: Request, res: Response) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', async () => {
      try {
        const { trailId, reminderId } = req.params;
        const reminderData = JSON.parse(data);
        const { userId } = reminderData;
        const reminderController = new ReminderController();
        await reminderController.joinReminder(reminderId, userId);
        const result = await reminderController.updateReminder(trailId, reminderId, reminderData);
        res.writeHead(HTTP_CODE.Created, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify(result));

      } catch (err:any) {
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
}


  static addPastTrail = async (req: Request, res: Response) => {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', async () => {
      try {
        const { userId } = req.params;
        const pastTrailData = JSON.parse(data);
        console.log(pastTrailData);
        const trailController = new PastTrailsController();
        await trailController.addPastTrail(userId, pastTrailData);

        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Past trail added successfully' }));
      } catch (error) {
        console.error('Error adding past trail:', error);
        res.writeHead(HTTP_CODE.InternalServerError, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'Failed to add past trail' }));
      }
    });
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

  static getTrailByName = async (req: Request, res: Response) => {
    try {
      const urlParts = req.url?.split('/');
      const trailName = urlParts && urlParts.length >= 4 ? urlParts[3] : '';
      
      if (!trailName) {
        res.writeHead(HTTP_CODE.BadRequest, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Trail name is required' }));
        return;
      }
      const trailController = new TrailController();
      const trail = await trailController.getTrailByName(trailName);
      if (!trail) {
        res.writeHead(HTTP_CODE.NotFound, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `Trail ${trailName} not found` }));
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
          res.writeHead(HTTP_CODE.BadRequest, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Trail ID, User ID, Rating, and Comment are required' }));
          return;
        }
        const trailController = new TrailController();
        const result = await trailController.rateAndReviewTrail(trailId, userId, rating, comment);
        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error) {
        console.error('Error:', error);
        res.writeHead(HTTP_CODE.InternalServerError, { 'Content-Type': 'application/json' });
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
          res.writeHead(HTTP_CODE.BadRequest, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Trail ID, User ID, Rating, and Comment are required' }));
          return;
        }
        const trailController = new TrailController();
        const result = await trailController.updateRateAndReviewTrail(trailId, userId, rating, comment);
        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error) {
        console.error('Error:', error);
        res.writeHead(HTTP_CODE.InternalServerError, { 'Content-Type': 'application/json' });
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
      res.status(HTTP_CODE.InternalServerError).json({ error: 'Failed to delete review' });
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
      res.status(HTTP_CODE.InternalServerError).json({ error: 'Internal Server Error' });
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
        const hikeBuddies = await userController.searchForHikeBuddies({ fullName, location, skillLevel, gender });

        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(hikeBuddies));
      } catch (error) {
        console.error('Error:', error);
        res.writeHead(HTTP_CODE.InternalServerError, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      }
    });
  };


}
function joinReminder(reminderId: string, userId: any) {
  throw new Error('Function not implemented.');
}

