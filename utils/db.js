import mongodb from 'mongodb';
import Collection from 'mongodb/lib/collection';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'files_manager';
    const dbUrl = `mongodb://${host}:${port}/${database}`;

    this.isClient = new mongodb.MongoClient(dbUrl, { useUnifiedTopology: true });
    this.isClient.connect();
  }

  /**
   * Checks if client's collection to the MongoDB server is active
   * @returns {boolean}
   */
  isAlive() {
    return this.isClient.isConnected();
  }

  /**
   * Retrieves the number of users in the database
   * @returns {Promise<number>}
   */
  async nbUsers() {
    return this.isClient.db().collection('users').countDocuments();
  }

  /**
   * Retrieves the number of files in the database
   * @returns {Promise<number>}
   */
  async nbFiles() {
    return this.isClient.db().collection('files').countDocuments();
  }

  /**
   * Retrieves a reference to the user's database
   * @returns {Promise<Collection>}
   */
  async usersCollection() {
    return this.isClient.db().collection('users');
  }

  /**
   * Retrieves a reference to the files collection
   * @returns {Promise<Collection>}
   */
  async filesCollection() {
    return this.isClient.db().collection('files');
  }
}

export const dbClient = new DBClient();
export default dbClient;
