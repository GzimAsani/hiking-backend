import UserModel from '../models/User';

export class PastTrailsController {
  async addPastTrail(userId: string, pastTrailData: any, images: any[]) {
    try {
      const imageObjects = images.map((image) => ({
        name: image.filename,
        type: image.mimetype,
      }));

      const query = { _id: userId };
      const update = {
        $addToSet: {
          pastTrails: {
            ...pastTrailData,
            images: imageObjects,
          },
        },
      };

      const options = { upsert: true };

      const response = await UserModel.updateOne(query, update, options);

      if (response.modifiedCount === 1) {
        const user = await UserModel.findById(userId);

        if (user) {
          const newTrail = user.pastTrails.find(
            (trail) => trail.name === pastTrailData.name
          );

          return newTrail;
        } else {
          throw new Error('User not found');
        }
      } else {
        throw new Error('Failed to add past trail');
      }
    } catch (error) {
      console.error('Error adding past trail:', error);
      throw new Error('Failed to add past trail');
    }
  }

  async removePastTrail(userId: string, trailId: string) {
    try {
      const query = { _id: userId };
      const update = {
        $pull: { pastTrails: { _id: trailId } },
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

  async getSingleTrail(userId: string, trailId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const trail = user.pastTrails.find(
      (trail) => String(trail._id) === trailId
    );
    if (!trail) {
      throw new Error('Trail not found');
    }

    return trail;
  }
}
