import * as http from 'http';
import { UserController } from '../controllers/user';
import { HTTP_CODE } from '../enums/http-status-codes';
import { Request, Response } from 'express';
import { stringify } from 'querystring';

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
    //   try {
          let data = '';
          req.on('data', chunk => {
              data += chunk;
          });
          req.on('end', async () => {
              try {
                  const userObj: any = JSON.parse(data);
  
                  const userController = new UserController();
                  const result = await userController.signup(userObj);
  
                  res.writeHead(HTTP_CODE.Created, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify(result));
              } catch (err:any) {
                console.log("AFTER THIS ERROR SHOULD APPEAR")
                console.log(new Error(err).message)
                
                  //console.error('Error:', error);
                  
                res.writeHead(err?.code ? err?.code : HTTP_CODE.InternalServerError, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message? err.message: "Internal Server Error"}));
              }
          });
    //   } catch (error) {
    //       console.error('Error:', error);
    //       res.writeHead(HTTP_CODE.InternalServerError, { 'Content-Type': 'application/json' });
    //       res.end(JSON.stringify({ error: 'Internal Server Error' }));
    //   }
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
        // try {
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
                } catch (err:any) {
                    console.log("AFTER THIS ERROR SHOULD APPEAR")
                    console.log(new Error(err).message)
                    
                      //console.error('Error:', error);
                      
                    res.writeHead(err?.code ? err?.code : HTTP_CODE.InternalServerError, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: err.message? err.message: "Internal Server Error"}));
                  }
            });
        // } catch (error) {
        //     console.error('Error:', error);
        //     res.writeHead(HTTP_CODE.InternalServerError, { 'Content-Type': 'application/json' });
        //     res.end(JSON.stringify({ error: 'Internal Server Error' }));
        // }
    }
}
