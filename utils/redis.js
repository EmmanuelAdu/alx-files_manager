import { createClient } from 'redis';
import { promisify } from 'util';

/**
 * Represents a Redis client
 */
class RedisClient {
  constructor() {
    this.isClient = createClient();
    this.isConnected = true;
    this.isClient.on('error', (err) => {
      console.error('Redis failed to connect:', err.message || err.toString);
    });
    this.isClient.on('connect', () => {
      this.isConnected = true;
    });
  }

  /**
   * checks if redis client is connected
   * @returns {boolean}
   */
  isAlive() {
    return this.isConnected;
  }

  /**
   * Retrieves the redis value of a given key
   * @param {string} key
   * @returns {string} Redis Key
   */
  async get(key) {
    return promisify(this.isClient.GET).bind(this.isClient)(key);
  }

  /**
   * Stores a key and its value within a duration
   * @param {*string} key
   * @param {*string} value
   * @param {*integer} duration
   */
  async set(key, value, duration) {
    await promisify(this.isClient.SETEX)
      .bind(this.isClient)(key, duration, value);
  }

  /**
   * Removes the value of a given key
   * @param {*String} key - The key of the item to be removed
   */
  async del(key) {
    await promisify(this.isClient.DEL).bind(this.isClient)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
