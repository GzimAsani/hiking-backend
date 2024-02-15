import * as http from 'http';
import * as fs from 'fs';
import { HTTP_CODE } from '../enums/http-status-codes';
import { UserController } from '../controllers/user';

export class HttpRequestHandlers {
    data = async (req: any, res: any) => {
        try {
            const userController = new UserController();
            const user = await userController.getUsers(req, res);

            if (!res.headersSent) {
                res.writeHead(HTTP_CODE.OK, { "Content-Type": "application/json" });
                res.write(JSON.stringify(user));
                res.end();
            }
        } catch (error) {
            console.error('Error:', error);
            if (!res.headersSent) {
                res.writeHead(HTTP_CODE.InternalServerError);
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
        }
    }

    login = async (req: any, res: any) => {
        try {
            const userController = new UserController();
            await userController.login(req, res);
        } catch (error) {
            console.error('Error:', error);
            res.writeHead(HTTP_CODE.InternalServerError);
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    }

    noResponse = (req: any, res: any) => {
        fs.readFile("./src/404.html", "utf8", (error, content) => {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end(content, "utf-8");
        });
    }

    signup = (req: http.ClientRequest, res: http.ServerResponse, reqUrl: any): void => {
        req.on("data", async (data: any) => {
            try {
                const userObj: any = JSON.parse(data);
                const userController = new UserController();
                const result = await userController.saveUser(userObj);
                res.writeHead(HTTP_CODE.OK, { "Content-Type": "application/json" });
                res.write(JSON.stringify(result));
                res.end();
            } catch (error) {
                console.error('Error:', error);
                res.writeHead(HTTP_CODE.InternalServerError);
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
        });
    }

    getLogedUser = (req: any, res: http.ServerResponse): void => {
        try {
            const useController = new UserController();
            if (req.user) {
                const user = useController.getUserByEmail(req.user);
                res.writeHead(HTTP_CODE.OK);
                if (!user) {
                    res.write(JSON.stringify({ message: `User ${req.user} could not be found` }));
                } else {
                    res.write(JSON.stringify(user));
                }
                res.end();
            } else {
                res.writeHead(HTTP_CODE.Unauthorized);
                res.end();
            }
        } catch (error) {
            console.error('Error:', error);
            res.writeHead(HTTP_CODE.InternalServerError);
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    }
}