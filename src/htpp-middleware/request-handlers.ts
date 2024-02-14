import * as http from 'http'
import * as fs from 'fs';
import { HTTP_CODE } from '../enums/http-status-codes';
import User from '../models/User';

export class HttpRequestHandlers {
    data = async (req: any, res: any) => {
        const user = new User()
        const useri = await user.getUser(req, res);
    
        res.writeHead(HTTP_CODE.OK, { "Content-Type": "application/json" });
        res.write(JSON.stringify(useri));
        res.end();
      }
    
      login = async (req: any, res: any) => { 
        const user = new User()
        user.login(req, res);
      }
    
      noResponse = (req: any, res: any) => {
        fs.readFile("./src/404.html", "utf8", (error, content) => {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end(content, "utf-8");
        });
      };
      signup = (
        req: http.ClientRequest,
        res: http.ServerResponse,
        reqUrl: any
      ): void => {
        req.on("data", (data: any) => {
          const userObj: any = JSON.parse(data);
          const user = new User();
          user.saveUser(userObj).then((result: string) => {
            res.writeHead(HTTP_CODE.OK);
            res.write(JSON.stringify(result));
            res.end();
          }).catch((err: string) => {
            res.writeHead(500);
            res.write(err);
            res.end();
          })
        })
    
      }
      getLogedUser = (req: any, res: http.ServerResponse): void => {
        const User = new User
        if (req.user) {
          User.getUserByEmail(req.user).then((user) => {
            res.writeHead(HTTP_CODE.OK);
            if (!user) {
              res.write(
                JSON.stringify({ message: `user ${req.user} could not be found` })
              );
            } else {
              res.write(JSON.stringify(user));
            }
            res.end();
          })    
        } else {
          res.writeHead(HTTP_CODE.Unauthorized);
          res.end();
        }
      };
}