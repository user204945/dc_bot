const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'unjail',
    description: 'Bir kullanıcıyı jail durumundan çıkarır.',
    args: true,
    usage: '<kullanıcı>',
    async execute(message, args) {
        
        const jailHammerRoleId = config.jailHammerRoleId;
        if (!message.member.roles.cache.has(jailHammerRoleId)) {
            return message.reply('Bu komutu kullanmak için gerekli role sahip değilsiniz.');
        }

        
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return message.reply('Bu komutu kullanmak için gerekli izne sahip değilsiniz.');
        }

        
        const user = message.mentions.members.first();
        if (!user) return message.reply('Bir kullanıcı belirtmelisiniz.');
        if (user.id === message.author.id) return message.reply('Kendinizi jail\'dan çıkaramazsınız.');

        
        const jailRole = message.guild.roles.cache.get(config.jailRoleId);
        if (!jailRole) return message.reply('Jail rolü bulunamadı. Lütfen config.json dosyasındaki rol ID\'sini kontrol edin.');

        
        const jailLogChannel = message.guild.channels.cache.get(config.jailLogChannelId);
        if (!jailLogChannel) return message.reply('Jail log kanalı bulunamadı. Lütfen config.json dosyasındaki kanal ID\'sini kontrol edin.');

        
        try {
            await user.roles.remove(jailRole);
            const embed = new EmbedBuilder()
                .setColor('#00FF00') 
                .setTitle('Jail Kaldırıldı')
                .setDescription(`✔️ ${user.user.tag} kullanıcısının jail durumu kaldırıldı.\n**Zaman:** ${new Date().toLocaleString()}`)
                .setTimestamp();
            await jailLogChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Jail rolü kaldırılırken bir hata oluştu:', error);
            return message.reply('Jail rolü kaldırılırken bir hata oluştu.');
        }

        
        const embed = new EmbedBuilder()
            .setColor('#00FF00') 
            .setTitle('Jail Kaldırıldı')
            .setDescription(`✔️ ${user.user.tag} kullanıcısının jail durumu kaldırıldı.\n**Zaman:** ${new Date().toLocaleString()}`)
            .setTimestamp();
        await message.reply({ embeds: [embed] });
    },
};