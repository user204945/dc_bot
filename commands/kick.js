const { PermissionsBitField } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'kick',
  description: 'Bir kullanıcıyı sunucudan atar.',
  async execute(message, args) {
    
    const kickHammerRoleId = config.kickHammerRoleId; 
    if (!message.member.roles.cache.has(kickHammerRoleId)) {
      return message.reply('Bu komutu kullanmak için gerekli role sahip değilsiniz.');
    }

    
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply('Bu komutu kullanmak için yeterli izniniz yok.');
    }

    
    const username = args[0];
    const reason = args.slice(1).join(' ') || 'Belirtilmemiş'; 

    if (!username) {
      return message.reply('Atılacak bir kullanıcı adı belirtmelisiniz.');
    }

    
    const member = message.guild.members.cache.find(m => m.user.username === username);
    if (member) {
      try {
        await member.kick(reason);
        message.channel.send(`${member.user.tag} başarıyla sunucudan atıldı. Neden: ${reason}`);
      } catch (error) {
        console.error(error);
        message.channel.send('Bu kullanıcıyı sunucudan atarken bir sorun oluştu.');
      }
    } else {
      message.reply('Bu kullanıcı sunucuda bulunmuyor.');
    }
  },
};