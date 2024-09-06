const { PermissionsBitField, EmbedBuilder, Embed } = require('discord.js');

module.exports = {
    name: 'slowmode',
    description: 'Kanalın yavaş modunu ayarlar.',
    async execute(message, args) {
        
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.reply('Bu komutu kullanmak için gerekli izne sahip değilsiniz.');
        }

        
        const duration = parseInt(args[0], 10);

        
        if (isNaN(duration) || duration < 0) {
            return message.reply('Lütfen geçerli bir süre (saniye cinsinden) belirtin.');
        }

        const embed = new EmbedBuilder()
            .setColor('#000000')
            .setTitle('Yavaş Mod Ayarlandı!')
            .setDescription(`Yavaş Mod **${duration}** saniye olarak ayarlandı.`)
            .setTimestamp();

        try {
            
            await message.channel.setRateLimitPerUser(duration);
            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Yavaş mod ayarlama sırasında bir hata oluştu:', error);
            message.reply('Yavaş mod ayarlanırken bir hata oluştu.');
        }
    },
};