import { Request, Response } from 'express';
import UserModel from '../models/User';

export const AccessController = {
  async defineRole(req: Request, res: Response) {
    const { userId } = req.params;
    const { role } = req.body;
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      user.role = role;
      await user.save();
      res.json({ message: `Role for user ${userId} set to ${role}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async grantPermission(req: Request, res: Response) {
    const { userId } = req.params;
    const { permission } = req.body;
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      user.permissions.push(permission);
      await user.save();
      res.json({ message: `Permission ${permission} granted to user ${userId}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async revokePermission(req: Request, res: Response) {
    const { userId } = req.params;
    const { permission } = req.body;
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      user.permissions = user.permissions.filter((p: any) => p !== permission);
      await user.save();
      res.json({ message: `Permission ${permission} revoked from user ${userId}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};
