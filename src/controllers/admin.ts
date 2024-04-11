import UserModel from '../models/User';

export const AdminController = {
  defineRole: async (userId: string, role: string) => {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      user.role = role;
      await user.save();
      return `Role for user ${userId} set to ${role}`;
    } catch (error) {
      console.error(error);
      throw new Error('Internal server error');
    }
  },

  listPermissions: async () => {
    try {
      const users = await UserModel.find();
      const permissions: string[] = [];
      users.forEach((user) => {
        user.permissions.forEach((permission: string) => {
          if (!permissions.includes(permission)) {
            permissions.push(permission);
          }
        });
      });
      return permissions;
    } catch (error) {
      console.error(error);
      throw new Error('Internal server error');
    }
  },

  grantPermission: async (userId: string, permission: string) => {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      console.log("test")
      user.permissions.push(permission);
      await user.save();
      return `Permission ${permission} granted to user ${userId}`;
    } catch (error) {
      console.error(error);
      throw new Error('Internal server error');
    }
  },

  revokePermission: async (userId: string, permission: string) => {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      user.permissions = user.permissions.filter((p: any) => p !== permission);
      await user.save();
      return `Permission ${permission} revoked from user ${userId}`;
    } catch (error) {
      console.error(error);
      throw new Error('Internal server error');
    }
  }
};
