import jwt from "jsonwebtoken";
import { config } from "../config";

export class TokenService {
  generatePasswordResetToken = (email: string): string => {
    return jwt.sign({ email: email }, config.app_secret, {
      expiresIn: config.token_expire,
    });
  };

  generateVerifyEmailToken = (email: string): string => {
    return jwt.sign({ email: email }, config.app_secret, {
      expiresIn: config.token_expire,
    });
  };

  generateLoginToken = (userId: string): string => {
    return jwt.sign({ userId: userId }, config.app_secret, {
      expiresIn: config.token_expire,
    });
  };

  verifyToken = (token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.app_secret, (err, decoded) => {
        if (err) resolve(false);
        else resolve(decoded);
      });
    });
  };
}