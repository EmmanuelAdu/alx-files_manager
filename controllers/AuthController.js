import sha1 from 'sha1';
import { v4 } from 'uuid';
import { redisClient } from '../utils/redis';
import { dbClient } from '../utils/db';
import {
  AuthHeader, getToken, decodeToken, getUserCredentials,
} from '../utils/utils';

export default class AuthController {
  static async getConnect(req, res) {
    const header = AuthHeader(req);
    if (!header) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }

    const token = getToken(header);
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }

    const decodedTok = decodeToken(token);
    if (!decodedTok) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }

    const { email, password } = getUserCredentials(decodedTok);
    const user = await (await dbClient.usersCollection()).findOne({ email });
    if (!user || user.password !== sha1(password)) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    const uid = v4();
    await redisClient.set(`auth_${uid}`, user._id.toString('utf-8'), 60 * 60 * 24);
    res.status(200).json({ token: uid });
    res.end();
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }

    await redisClient.del(`auth_${token}`);
    res.status(200).end();
  }
}
