import * as http from 'http';
import { UserController } from '../controllers/user';
import { HTTP_CODE } from '../enums/http-status-codes';
import { Request, Response } from 'express';

export class HttpRequestHandlers {
    static data = async (req: Request, res: Response) => {
        try {
            const userController = new UserController();
            const users = await userController.getUsers();
            res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(users));
        } catch (error) {
            console.error('Error:', error);
            res.writeHead(HTTP_CODE.InternalServerError, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    }

    static getUser = async (req: Request, res: Response) => {
        try {
            const userId = req.url?.split('/')[2];
            if (!userId) {
                res.writeHead(HTTP_CODE.BadRequest, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'User ID is required' }));
                return;
            }
            const userController = new UserController();
            const user = await userController.getUserById(userId);
            if (!user) {
                res.writeHead(HTTP_CODE.NotFound, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: `User ${userId} not found` }));
            } else {
                res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(user));
            }
        } catch (error) {
            console.error('Error:', error);
            res.writeHead(HTTP_CODE.InternalServerError, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    }

    static signup = async (req: Request, res: Response) => {
      try {
          let data = '';
          req.on('data', chunk => {
              data += chunk;
          });
          req.on('end', async () => {
              try {
                  console.log('Received data:', data); // Log the received data
                  const userObj: any = JSON.parse(data);
                  console.log('Parsed user object:', userObj); // Log the parsed user object
  
                  const userController = new UserController();
                  const result = await userController.signup(userObj);
                  console.log('Signup result:', result); // Log the signup result
  
                  res.writeHead(HTTP_CODE.Created, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify(result));
              } catch (error) {
                  console.error('Error:', error);
                  res.writeHead(HTTP_CODE.InternalServerError, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Internal Server Error' }));
              }
          });
      } catch (error) {
          console.error('Error:', error);
          res.writeHead(HTTP_CODE.InternalServerError, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
      }
  }

    static deleteUser = async (req: Request, res: Response) => {
        try {
            const userId = req.url?.split('/')[2];
            if (!userId) {
                res.writeHead(HTTP_CODE.BadRequest, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'User ID is required' }));
                return;
            }
            const userController = new UserController();
            await userController.deleteUser(userId);
            res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: `User ${userId} deleted successfully` }));
        } catch (error) {
            console.error('Error:', error);
            res.writeHead(HTTP_CODE.InternalServerError, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    }

    static getUserByEmail = async (req: Request, res: Response) => {
        try {
            const urlParts = req.url?.split('/');
            const userEmail = urlParts && urlParts.length >= 4 ? urlParts[3] : '';
            
            if (!userEmail) {
                res.writeHead(HTTP_CODE.BadRequest, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'User email is required' }));
                return;
            }
            const userController = new UserController();
            const user = await userController.getUserByEmail(userEmail);
            if (!user) {
                res.writeHead(HTTP_CODE.NotFound, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: `User ${userEmail} not found` }));
            } else {
                res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(user));
            }
        } catch (error) {
            console.error('Error:', error);
            res.writeHead(HTTP_CODE.InternalServerError, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    }
    

    static login = async (req: Request, res: Response) => {
        try {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                try {
                    const { email, password } = JSON.parse(data);
                    const userController = new UserController();
                    const result = await userController.login(email, password);
                    res.writeHead(result.statusCode, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result.data));
                } catch (error) {
                    console.error('Error:', error);
                    res.writeHead(HTTP_CODE.InternalServerError, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                }
            });
        } catch (error) {
            console.error('Error:', error);
            res.writeHead(HTTP_CODE.InternalServerError, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    }
}
