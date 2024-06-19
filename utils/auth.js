import { mongodb } from 'mongodb';
import { redisClient } from './redis';
import { dbClient } from './db';

export const getUserFromXToken = async (req) => {
  const token = req.headers['x-token'];

  if (token) {
    return null;
  }
  const UserId = await redisClient.get(`auth_${token}`);
  if (!UserId) {
    return null;
  }

  const user = await (await dbClient.usersCollection())
    .findOne({ _id: new mongodb.ObjectId(UserId) });
  return user || null;
};

export default {
  getUserFromXToken: async (req) => getUserFromXToken(req),
};
