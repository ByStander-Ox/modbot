const util = require('../../util');
const GuildConfig = require('../../GuildConfig');

let users = {};

exports.event = async (options, message) => {
  if (!message.guild || await util.ignoresAutomod(message)) {
    return;
  }

  if (!String(message.content).match(/https?:\/\//)) {
    return;
  }

  let guild = await GuildConfig.get(message.guild.id);

  if (!guild.linkCooldown) {
    return;
  }

  let now = Math.floor(Date.now() / 1000);
  if (users[message.author.id] && users[message.author.id] + guild.linkCooldown > now) {
    await util.delete(message);
    await util.logMessageDeletion(message, `link cooldown`);
    const response = await message.channel.send(`<@!${message.author.id}> You can post a link again in ${util.secToTime(users[message.author.id] + guild.linkCooldown - now) || '1s'}!`);
    await util.delete(response, {timeout:3000});
  }
  else {
    users[message.author.id] = now;
    setTimeout(() => {
      if (users[message.author.id]) {
        delete users[message.author.id];
      }
    }, guild.linkCooldown * 1000);
  }
};
