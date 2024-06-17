import sha1 from 'sha1';

const { dbClient } = require('../utils/db');

export default class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      res.end();
      return;
    }

    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      res.end();
      return;
    }

    const userExist = await (await dbClient.usersCollection()).findOne({ email });
    if (userExist) {
      res.status(400).json({ error: 'Already exist' });
      res.end();
      return;
    }

    const user = await (await dbClient.usersCollection())
      .insertOne({ email, password: sha1(password) });
    const id = `${user.insertedId}`;
    res.status(201).json({ id, email });
    res.end();
  }
}
