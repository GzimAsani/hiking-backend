import { Request, Response } from 'express';
import UserModel from '../models/User';
import { HTTP_CODE } from '../enums/http-status-codes';

export class AdminController {
  static defineRole = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { role } = req.body;
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(HTTP_CODE.NotFound).json({ message: 'User not found' });
      }
      user.role = role;
      await user.save();
      res.json({ message: `Role for user ${userId} set to ${role}` });
    } catch (error) {
      console.error(error);
      res.status(HTTP_CODE.InternalServerError).json({ message: 'Internal server error' });
    }
  };

  static grantPermission = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { permission } = req.body;
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(HTTP_CODE.NotFound).json({ message: 'User not found' });
      }
      user.permissions.push(permission);
      await user.save();
      res.json({ message: `Permission ${permission} granted to user ${userId}` });
    } catch (error) {
      console.error(error);
      res.status(HTTP_CODE.InternalServerError).json({ message: 'Internal server error' });
    }
  };

  static revokePermission = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { permission } = req.body;
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(HTTP_CODE.NotFound).json({ message: 'User not found' });
      }
      user.permissions = user.permissions.filter((p: any) => p !== permission);
      await user.save();
      res.json({ message: `Permission ${permission} revoked from user ${userId}` });
    } catch (error) {
      console.error(error);
      res.status(HTTP_CODE.InternalServerError).json({ message: 'Internal server error' });
    }
  };

  static listPermissions = async (req: Request, res: Response) => {
    try {
      const permissions = await UserModel.find();
      res.json(permissions);
    } catch (error) {
      console.error(error);
      res.status(HTTP_CODE.InternalServerError).json({ message: 'Internal server error' });
    }
  };
}
