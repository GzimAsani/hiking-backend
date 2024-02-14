import * as http from 'http'
import * as fs from 'fs';
import { HTTP_CODE } from '../enums/http-status-codes';

export class HttpRequestHandlers {
    data = async (req: any, res: any) => {
        const user = new UserRepo()
        const useri = await user.getUser();
    
        res.writeHead(HTTP_CODE.OK, { "Content-Type": "application/json" });
        res.write(JSON.stringify(useri));
        res.end();
      }
    
      login = async (req: any, res: any) => { 
        const user = new UserRepo()
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
          const userRepo = new UserRepo();
          userRepo.saveUser(userObj).then((result: string) => {
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
        const userRepo = new UserRepo
        if (req.user) {
          userRepo.getUserByEmail(req.user).then((user) => {
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