const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'dm-gönder',
    description: 'Belirtilen kullanıcıya DM gönderir.',
    async execute(message, args) {
        
        // Bot sahibi olup olmadığını kontrol et
        if (message.author.id !== config.botOwnerId) {
            return message.reply('Bu komutu kullanma izniniz yok.');
        }

        // ID ve mesaj al
        const userId = args[0];
        const dmMessage = args.slice(1).join(' ');

        // Kullanıcı ID'si ve mesajın kontrolü
        if (!userId) {
            return message.reply('Lütfen geçerli bir kullanıcı ID\'si belirtin.');
        }

        if (!dmMessage) {
            return message.reply('Lütfen bir mesaj belirtin.');
        }

        try {
            // Kullanıcıyı ID ile al
            const user = await message.client.users.fetch(userId);

            // Mesaj gönder
            await user.send(dmMessage);

            // Başarıyla gönderildiğini bildiren embed
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('DM Gönderildi')
                .setDescription(`Başarıyla ${user.tag} kullanıcısına DM gönderildi.`)
                .setTimestamp();

            await message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('DM gönderme sırasında bir hata oluştu:', error);
            message.reply('DM gönderilirken bir hata oluştu. Kullanıcının DM almayı kapatmış olabilir veya kullanıcı bulunamadı.');
        }
    },
};
