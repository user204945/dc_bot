const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'k',
  description: 'Bir kullanıcıyı kayıt eder.',
  args: true,
  usage: '<kullanıcı_id> <isim> <yaş>',
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
    if (!member) {
      return message.reply('Bu kullanıcı sunucuda bulunmuyor veya ID geçersiz.');
    }

    
    const firstName = args[1];
    const age = args[2];

    if (!firstName) {
      return message.reply('Birinci isim bilgisi gerekli.');
    }

    
    if (!age) {
      return message.reply('Yaş bilgisi belirtilmeldidir.');
    }

    
    const ageNumber = parseInt(age.trim(), 10);

    if (isNaN(ageNumber) || ageNumber <= 0 || ageNumber > 120) {
      return message.reply('Yaş bilgisi geçerli bir pozitif sayı olmalıdır ve 1 ile 120 arasında olmalıdır.');
    }

    try {
      
      const nickname = `${firstName.charAt(0).toUpperCase()}${firstName.slice(1)} (${ageNumber})`;
      await member.setNickname(nickname);

      
      const role = message.guild.roles.cache.find(r => r.id === config.registeredRoleId);
      if (role) {
        await member.roles.add(role);

        
        const unregisteredRole = message.guild.roles.cache.find(r => r.id === config.unregisteredRoleId);
        if (unregisteredRole) {
          await member.roles.remove(unregisteredRole);
        }

        
        const embed = new EmbedBuilder()
          .setColor('#00FF00') 
          .setTitle('Kayıt İşlemi Başarılı')
          .setDescription(`${member.user.tag} başarıyla kaydedildi.`)
          .addFields(
            { name: 'İsim', value: firstName },
            { name: 'Yaş', value: age }
          )
          .setTimestamp();

        
        const logChannel = message.guild.channels.cache.get(config.registerLogChannelId);
        if (logChannel) {
          logChannel.send({ embeds: [embed] });
        }

        message.channel.send({ embeds: [embed] });
      } else {
        message.reply('Kayıt rolü bulunamadı.');
      }
    } catch (error) {
      console.error(error);
      message.channel.send('Bu kullanıcıya rol verirken bir sorun oluştu.');
    }
  },
};