const util = require('../lib/util.js');
const Discord = require('discord.js');

exports.command = async (message, args, database, bot) => {
  if(!await util.isMod(message.member) && !message.member.hasPermission('KICK_MEMBERS')) {
    await message.react(util.icons.error);
    return;
  }

  let userId = util.userMentionToId(args.shift());
  if (!userId) {
    await message.react(util.icons.error);
    await message.channel.send("Please provide a user (@Mention or ID)!");
    return;
  }

  let member = await message.guild.members.fetch(userId);
  if (!member) {
    await message.react(util.icons.error);
    await message.channel.send("User not found or not in guild!");
    return;
  }

  if (member.user.bot) {
    await message.react(util.icons.error);
    await message.channel.send("You cant interact with bots!");
    return;
  }


  //highest role check
  if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0 || await util.isMod(member)){
    await message.react(util.icons.error);
    await message.channel.send("You dont have the Permission to kick that Member!");
    return;
  }

  let reason = args.join(' ') || 'No reason provided.';
  let now = Math.floor(Date.now()/1000);

  let insert = await database.queryAll("INSERT INTO moderations (guildid, userid, action, created, reason, moderator, active) VALUES (?,?,?,?,?,?,?)",[message.guild.id, userId, 'kick', now, reason, message.author.id,false]);

  try {
    await member.send(`You were kicked from \`${message.guild.name}\` | ${reason}`);
  } catch (e) {
  }
  await member.kick(`${message.author.username}#${message.author.discriminator} | `+reason);

  const responseEmbed = new Discord.MessageEmbed()
  .setDescription(`**${member.user.username}#${member.user.discriminator} has been kicked | ${reason}**`)
  .setColor(0x1FD78D)
  await message.channel.send(responseEmbed);
  const embed = new Discord.MessageEmbed()
  .setColor(0xF62451)
  .setAuthor(`Case ${insert.insertId} | Kick | ${member.user.username}#${member.user.discriminator}`, member.user.avatarURL())
  .addFields(
    { name: "User", value: `<@${member.user.id}>`, inline: true},
    { name: "Moderator", value: `<@${message.author.id}>`, inline: true},
    { name: "Reason", value: reason, inline: true}
  )
  .setFooter(`ID: ${member.user.id}`)
  .setTimestamp()
  await util.logMessageEmbed(message, "", embed);
}

exports.names = ['kick'];
