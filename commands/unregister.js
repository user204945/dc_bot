const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'k-sil',
  description: 'Bir kullanıcının kaydını siler.',
  args: true,
  usage: '<kullanıcı_id>',
  async execute(message, args) {
    
    if (message.channel.id !== config.registerChannelId) {
      return message.reply('Bu komut sadece kayıt kanalında kullanılabilir.');
    }

    
    const authorizedRoleId = config.registerAuthorizedRoleId;
    if (!message.member.roles.cache.has(authorizedRoleId)) {
      return message.reply('Bu komutu kullanmak için gerekli role sahip değilsiniz.');
    }

    
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return message.reply('Bu komutu kullanmak için yeterli izniniz yok.');
    }

    
    const userId = args[0];
    if (!userId || isNaN(userId)) {
      return message.reply('Geçerli bir kullanıcı ID\'si belirtmelisiniz.');
    }

    
    const member = message.guild.members.cache.get(userId);
    if (member) {
      try {
        
        const registeredRole = message.guild.roles.cache.find(r => r.id === config.registeredRoleId);
        if (registeredRole) {
          await member.roles.remove(registeredRole);
        }

        
        const unregisteredRole = message.guild.roles.cache.find(r => r.id === config.unregisteredRoleId);
        if (unregisteredRole) {
          await member.roles.add(unregisteredRole);
        }

        
        const nickname = `(Unregistered)`;
        await member.setNickname(nickname);

        
        const embed = new EmbedBuilder()
          .setColor('#FF0000') 
          .setTitle('Kayıt Silme İşlemi Başarılı')
          .setDescription(`${member.user.tag} başarıyla kayıttan silindi.`)
          .setTimestamp();

        
        const logChannel = message.guild.channels.cache.get(config.registerLogChannelId);
        if (logChannel) {
          logChannel.send({ embeds: [embed] });
        }

        message.channel.send({ embeds: [embed] });
      } catch (error) {
        console.error('Bu kullanıcıdan rol alırken veya ismini güncellerken bir sorun oluştu:', error);
        message.channel.send('Bu kullanıcıdan rol alırken veya ismini güncellerken bir sorun oluştu.');
      }
    } else {
      message.reply('Bu kullanıcı sunucuda bulunmuyor.');
    }
  },
};