const EventEmitter = require('events');
const rbx = require('../lib');

/**
 * A class representing a Roblox user.
 * @class RobloxUser
 * @extends {EventEmitter}
 */
class RobloxUser extends EventEmitter {
  /**
   * Creates an instance of RobloxUser. 
   * Not ready to use. Wait for `ready` to be emitted, use ready or await RobloxUser.new
   * @param {UserResolvable} userResolvable The username or id of the user
   */
  constructor (userResolvable, client) {
    super();

    this.isReady = false;

    if (client != null) {
      this.jar = client.jar;
    }

    if (typeof userResolvable === 'string') {
      this.username = userResolvable;
    } else if (typeof userResolvable === 'number') {
      this.id = userResolvable;
    } else {
      throw new TypeError('userResolvable expected to be a string or number');
    }

    this.prepare();
  }

  /**
   * Creates an instance of RobloxUser, and returns a promise that resolves with the
   * user once the user has been fully prepared.
   * @static
   * @param {UserResolvable} userResolvable The username or id of the user
   * @returns {RobloxUser} The new user
   * @memberof RobloxUser
   */
  static new (userResolvable, client) {
    return new Promise(resolve => {
      let robloxUser = new RobloxUser(userResolvable, client);
      robloxUser.once('ready', () => {
        resolve(robloxUser);
      });
    });
  }

  /**
   * Fetches a user's ID from their username
   * @static
   * @param {string} username The username
   * @returns {int} The user id
   * @memberof RobloxUser
   */
  static async getIdFromUsername (username) {
    return rbx.getIdFromUsername(username);
  }

  /**
   * Fetches a user's username from their ID
   * @static
   * @param {int} id The user id
   * @returns {string} The username
   * @memberof RobloxUser
   */
  static async getUsernameFromId (id) {
    return rbx.getUsernameFromId(id);
  }

  /**
   * Returns a promise that resolves once this instance is ready to be used.
   * Instantly resolves if the user is already ready.
   * @returns {RobloxUser} The promise resolves with the user itself
   * @memberof RobloxUser
   */
  async ready () {
    return new Promise(resolve => {
      if (this.isReady) resolve(this);
      this.once('ready', () => {
        resolve(this);
      });
    });
  }

  /**
   * Performs network operations to prepare the instance for use.
   * @private
   * @memberof RobloxUser
   */
  async prepare () {
    if (this.username && !this.id) {
      try {
        this.id = await rbx.getIdFromUsername(this.username);
      } catch (e) {
        throw new Error('Invalid username');
      }
    } else if (!this.username && this.id) {
      try {
        this.username = await rbx.getUsernameFromId(this.id);
      } catch (e) {
        throw new Error('Invalid user id');
      }
    }

    this.isReady = true;
    this.emit('ready');
  }

  /**
   * Returns the user's username if it is available.
   * If the username isn't available, it returns "User#1234" where 1234 is the user id.
   * @returns {string} String representation of RobloxUser
   * @memberof RobloxUser
   */
  toString () {
    return this.username || `User#${this.id}`;
  }

  /**
   * Ensures the user is ready before running any actions. 
   * Throws an error if it is not ready.
   * @private
   * @memberof RobloxUser
   */
  ensureReady () {
    if (!this.id || !this.isReady) {
      throw new Error("RobloxUser isn't redy, use await RobloxUser.new");
    }
  }

  /**
   * Ensure this user is being interacted with by an authorized user.
   * Throws an error if not.
   * @param {string} method A name to refer to the function calling this method (debug)
   * @private
   * @memberof RobloxUser
   */
  ensureAuth (method) {
    this.ensureReady();

    if (!this.jar) {
      throw new Error(`${method} requires you to be logged in; use client.getUser`);
    }
  }

  /**
   * Returns the user's blurb (bio) from their profile.
   * @returns {string} The user's blurb
   * @memberof RobloxUser
   */
  async getBlurb () {
    this.ensureReady();
    return rbx.getBlurb(this.id);
  }

  /**
   * Gets the user's friends.
   * @param {any} [page] Which page of friends to get (each page is 200 users)
   * @param {any} [limit] Maximum number of users to get
   * @returns {Set<RobloxUser>} A set of roblox users
   * @todo Make return value correct
   * @memberof RobloxUser
   */
  async getFriends (page, limit) {
    this.ensureReady();
    return rbx.getFriends(this.id, 'AllFriends', page, limit, this.jar);
  }

  /**
   * Gets the user's status from their profile
   * @returns {string} The status
   * @memberof RobloxUser
   */
  async getStatus () {
    this.ensureReady();
    return rbx.getStatus(this.id);
  }
}

module.exports = RobloxUser;

/**
 * @typedef {(int|string)} UserResolvable
 * Either a Roblox user id (integer) or a Roblox username (string)
 */
