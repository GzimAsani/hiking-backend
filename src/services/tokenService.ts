import * as jwt from "jsonwebtoken";
import  { get as getConfig } from "config";

export class TokenService {
  generatePasswordResetToken = (email: string): string => {
    const appSecret = getConfig("app_secret") as string;
    return jwt.sign({ email: email }, appSecret, {
      expiresIn: getConfig("token_expire"),
    });
  };

  generateLoginToken = (email: string): string => {
    const appSecret = getConfig("app_secret") as string;
    return jwt.sign({ email: email }, appSecret, {
      expiresIn: getConfig("token_expire"),
    });
  };

  verifyToken = (token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, getConfig("app_secret"), (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });
  };
}
