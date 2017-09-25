// const RobloxUser = require('./RobloxUser');
const Client = require('./Client');

let bot = new Client('username', 'passwrod');
bot.on('ready', async () => {
  let me = await bot.getUser('evaera');

  me.sendFriendRequest();
});

bot.on('friendRequest', user => {
  user.acceptFriendRequest();
});
