const { PermissionsBitField } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'unban',
  description: 'Bir kullanıcının yasaklanmasını kaldırır.',
  args: true,
  usage: '<kullanıcı_id>',
  async execute(message, args) {
    
    const banHammerRoleId = config.banHammerRoleId;
    if (!message.member.roles.cache.has(banHammerRoleId)) {
      return message.reply('Bu komutu kullanmak için gerekli role sahip değilsiniz.');
    }

    
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('Bu komutu kullanmak için yeterli izniniz yok.');
    }

    
    const userId = args[0];
    if (!userId) {
      return message.reply('Yasaklaması kaldırılacak kullanıcının ID\'sini belirtmelisiniz.');
    }

    try {
      
      await message.guild.bans.remove(userId);
      message.channel.send(`Kullanıcı (${userId}) başarıyla yasaklamadan kaldırıldı.`);
    } catch (error) {
      console.error('Yasaklamayı kaldırırken bir hata oluştu:', error);
      message.channel.send('Bu kullanıcıyı yasaklamadan kaldırırken bir sorun oluştu veya kullanıcı bulunamadı.');
    }
  },
};