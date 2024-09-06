const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'sil',
    description: 'Belirtilen sayıda mesajı siler.',
    async execute(message, args) {
        
        const amount = parseInt(args[0], 10);

        
        if (isNaN(amount) || amount <= 0 || amount > 100) {
            return message.reply('Lütfen 1 ile 100 arasında geçerli bir sayı belirtin.');
        }

        
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply('Bu komutu kullanmak için gerekli izinlere sahip değilsiniz.');
        }

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Mesajlar Silindi!')
            .setDescription(`Başarılı bir şekilde **${amount}** tane mesaj silindi.`)
            .setTimestamp();

        try {
            
            const messages = await message.channel.messages.fetch({ limit: amount });
            
            const filteredMessages = messages.filter(msg => !msg.pinned);
            
            await message.channel.bulkDelete(filteredMessages, true);
            
            const sentMessage = await message.channel.send({ embeds: [embed] });
            setTimeout(() => sentMessage.delete().catch(err => console.error('Yanıt mesajı silinirken bir hata oluştu:', err)), 5000);
        } catch (error) {
            console.error('Mesaj silme sırasında bir hata oluştu:', error);
            message.reply('Mesajlar silinirken bir hata oluştu.');
        }
    },
};