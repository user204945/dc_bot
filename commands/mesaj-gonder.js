const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'mesaj-gönder',
    description: 'Belirtilen kanala mesaj gönderir.',
    async execute(message, args) {
        
        if (message.author.id !== config.botOwnerId) {
            return message.reply('Bu komutu kullanma izniniz yok.');
        }

        
        const channelId = args[0];
        const msgContent = args.slice(1).join(' ');

        
        if (!channelId || isNaN(channelId)) {
            return message.reply('Lütfen geçerli bir kanal ID\'si belirtin.');
        }

        
        if (!msgContent) {
            return message.reply('Lütfen bir mesaj belirtin.');
        }

        try {
            
            const channel = message.guild.channels.cache.get(channelId);

            if (!channel) {
                return message.reply('Belirtilen kanal bulunamadı.');
            }

            
            await channel.send(msgContent);

            
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('Mesaj Gönderildi')
                .setDescription(`Başarıyla <#${channelId}> kanalına mesaj gönderildi.`)
                .setTimestamp();

            await message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Mesaj gönderme sırasında bir hata oluştu:', error);
            message.reply('Mesaj gönderilirken bir hata oluştu. Kanal ID\'sini ve mesajı kontrol edin.');
        }
    },
};