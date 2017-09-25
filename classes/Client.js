const rbx = require('../lib');
const request = require('request-promise');
const ClientRobloxUser = require('./ClientRobloxUser');

/**
 * A logged in RobloxUser. You do actions on the website as this user.
 * 
 * @class Client
 * @extends {ClientRobloxUser}
 */
class Client extends ClientRobloxUser {
  /**
   * Creates an instance of RobloxUser. 
   * Not ready to use. Wait for `ready` to be emitted, use getReadyPromise or await Client.new
   * @param {string} username The username of the client user
   * @param {string} password The password of the client user
   */
  constructor (username, password) {
    super(username);

    this.password = password;
    this.jar = request.jar();

    this.listeners = {
      friendRequest: false,
      message: false,
      notification: false
    };

    this.on('newListener', async event => {
      if (typeof this.listeners[event] === 'undefined') return;

      await this.ready();

      if (this.listeners[event] === false) {
        switch (event) {
          case 'friendRequest':
            rbx.onFriendRequest(this.jar).on('data', async userId => {
              this.emit('friendRequest', await this.getUser(userId));
            }).on('error', e => console.log(e));
            this.listeners.friendRequest = true;
            break;
          case 'message':
            rbx.onMessage(this.jar).on('data', message => {
              this.emit('message', message);
            });
            this.listeners.message = true;
            break;
          case 'notification':
            rbx.onNotification(this.jar).on('data', (name, message) => {
              this.emit('notification', name, message);
            });
            this.listeners.notification = true;
            break;
        }
      }
    });
  }

  /**
   * @event friendRequest
   * @desc Fired when the client user receives a friend request
   * @type {ClientRobloxUser}
   * @memberof Client
   */

  /**
   * @event message
   * @desc Fired when the client user receives a message
   * @type {Object}
   * @todo wrap & doc
   * @memberof Client
   */

  /**
   * @event notification
   * @desc Fired when the client user receives a notification
   * @type {Object}
   * @todo wrap & doc
   * @memberof Client
   */

  /**
   * Performs network operations to prepare the instance for use.
   * @private
   * @override
   * @memberof Client
   */
  async prepare () {
    if (this.username && !this.id) {
      try {
        this.id = await rbx.getIdFromUsername(this.username);
      } catch (e) {
        throw new Error('Invalid username');
      }
    }

    try {
      await rbx.login(this.username, this.password, this.jar);
    } catch (e) {
      throw new Error("Couldn't log in");
    }

    this.isReady = true;
    this.emit('ready');
  }

  /**
   * Gets a ClientRobloxUser as this Client
   * 
   * @param {UserResolvable} userResolvable The user to fetch
   * @returns {ClientRobloxUser} A ClientRobloxUser instance representing the user.
   * @memberof Client
   */
  async getUser (userResolvable) {
    return ClientRobloxUser.new(userResolvable, this);
  }

  /**
   * Returns this client's messages
   * @param {int} page Page
   * @param {int} limit Limit
   * @param {any} tab Tab name
   * @returns {Object} Messages
   * @todo wrap & doc
   * @memberof Client
   */
  async getMessages (page, limit, tab) {
    return rbx.getMessages(page, limit, tab, this.jar);
  }

  /**
   * Returns pending friend requests
   * 
   * @param {int} page Page
   * @param {int} limit Limit
   * @returns {Object} Friend requests
   * @todo wrap & doc
   * @memberof Client
   */
  async getFriendRequests (page, limit) {
    this.ensureAuth('getFriendRequests');
    return rbx.getFriends(this.id, 'FriendRequests', page, limit, this.jar);
  }
}

module.exports = Client;
