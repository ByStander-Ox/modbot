const util = require('../util.js');
const Discord = require('discord.js');
const GuildConfig = require('../GuildConfig');

const command = {};

command.description = 'Show the servers settings';

command.usage = '';

command.names = ['settings','options'];

command.execute = async (message, args, database, bot) => {
  //Permission check
  if (!message.member.hasPermission('MANAGE_GUILD')) {
    await message.channel.send('You need the "Manage Server" permission to use this command.');
    return;
  }

  let guild = await GuildConfig.get(message.guild.id);

  let moderation = '';
  moderation += `Log: ${guild.logChannel ? `<#${guild.logChannel}>` : 'disabled'} \n`;
  moderation += `Muted role: ${guild.mutedRole ? `<@&${guild.mutedRole}>` : 'disabled'} \n`;
  moderation += `Mod roles: ${guild.modRoles.length ? `<@&${guild.modRoles.join('>, <@&')}>` : 'none'} \n`;

  let support = '';
  support += `Playlist: ${guild.playlist ? `https://www.youtube.com/playlist?list=${guild.playlist}` : 'disabled'} \n`;
  support += `Helpcenter: ${guild.helpcenter ? `https://${guild.helpcenter}.zendesk.com/` : 'disabled'} \n`;

  let automod = '';
  automod += `Invites: ${guild.invites === false ? 'forbidden' : 'allowed'} \n`;
  automod += `Link cooldown: ${guild.linkCooldown > 0 ? util.secToTime(guild.linkCooldown) : 'disabled'} \n`;
  automod += `Caps: ${guild.caps === true ? 'enabled' : 'disabled'} \n`;

  let embed = new Discord.MessageEmbed()
  .setTitle(`Settings | Prefix: ${guild.prefix}`)
  .addFields(
      /** @type {any} */ {name: 'Moderation', value: moderation, inline: false},
      /** @type {any} */ {name: 'Support', value: support, inline: false},
      /** @type {any} */ {name: 'Automod', value: automod, inline: false }
  );

  await message.channel.send(embed);
};

module.exports = command;
