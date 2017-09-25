const rbx = require('../lib');
const RobloxUser = require('./RobloxUser');

/**
 * A RobloxUser seen by a Client. Includes many logged-in-only methods.
 * @class ClientRobloxUser
 * @extends {RobloxUser}
 */
class ClientRobloxUser extends RobloxUser {
  /**
   * Removes this user as a friend from Client.
   * @returns {Promise}
   */
  async removeFriend () {
    this.ensureAuth('removeFriend');
    return rbx.removeFriend(this.id, this.jar);
  }

  /**
   * Accepts a friend request from this server.
   * @returns {Promise}
   * @memberof ClientRobloxUser
   */
  async acceptFriendRequest () {
    this.ensureAuth('acceptFriendRequest');
    return rbx.acceptFriendRequest(this.id, this.jar);
  }

  /**
   * Decline a friend request from this user.
   * @returns {Promise}
   * @memberof ClientRobloxUser
   */
  async declineFriendRequest () {
    this.ensureAuth('declineFriendRequest');
    return rbx.declineFriendRequest(this.id, this.jar);
  }

  /**
   * Sends a friend request to this user from the Client.
   * @returns {Promise}
   * @memberof ClientRobloxUser
   */
  async sendFriendRequest () {
    this.ensureAuth('sendFriendRequest');
    return rbx.sendFriendRequest(this.id, this.jar);
  }

  /**
   * Blocks this user.
   * @returns {Promise}
   * @memberof ClientRobloxUser
   */
  async block () {
    this.ensureAuth('block');
    return rbx.block(this.id, this.jar);
  }

  /**
   * Unblocks this user.
   * @returns {Promise}
   * @memberof ClientRobloxUser
   */
  async unblock () {
    this.ensureAuth('unblock');
    return rbx.unblock(this.id, this.jar);
  }

  /**
   * Follows this user.
   * @returns {Promise}
   * @memberof ClientRobloxUser
   */
  async follow () {
    this.ensureAuth('follow');
    return rbx.follow(this.id, this.jar);
  }

  /**
   * Unfollows this user.
   * @returns {Promise}
   * @memberof ClientRobloxUser
   */
  async unfollow () {
    this.ensureAuth('unfollow');
    return rbx.unfollow(this.id, this.jar);
  }

  /**
   * Sends a private message to this user from the Client.
   * @param {string} subject The subject line for the message
   * @param {string} body The message body
   * @returns {Promise}
   * @memberof ClientRobloxUser
   */
  async sendMessage (subject, body) {
    this.ensureAuth('sendMessage');
    return rbx.message(this.id, subject, body, this.jar);
  }
}

module.exports = ClientRobloxUser;
