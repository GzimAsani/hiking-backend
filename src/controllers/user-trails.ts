import UserModel from '../models/User';

export class PastTrailsController {
  async addPastTrail(userId: string, pastTrailData: any) {
    try {
      const query = { _id: userId };
      const update = {
        $addToSet: { pastTrails: pastTrailData },
      };

      const options = { upsert: true };
      const response = await UserModel.updateOne(query, update, options);
      return response;
    } catch (error) {
      console.error('Error adding past trail:', error);
      throw new Error('Failed to add past trail');
    }
  }

  async removePastTrail(userId: string, trailId: string) {
    try {
      const query = { _id: userId };
      const update = {
        $pull: { pastTrails: { id: trailId } },
      };
      const response = await UserModel.updateOne(query, update);
      return response;
    } catch (error) {
      console.error('Error removing past trail:', error);
      throw new Error('Failed to remove past trail');
    }
  }

  async getPastTrails(userId: string) {
    const response = await UserModel.findById(userId);
    return response?.pastTrails;
  }
}
