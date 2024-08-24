const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'dm-gönder',
    description: 'Belirtilen kullanıcıya DM gönderir.',
    async execute(message, args) {
        
        if (message.author.id !== config.botOwnerId) {
            return message.reply('Bu komutu kullanma izniniz yok.');
        }

        
        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0])?.user;
        const dmMessage = args.slice(1).join(' ');

        
        if (!user) {
            return message.reply('Lütfen geçerli bir kullanıcı belirtin.');
        }

        if (!dmMessage) {
            return message.reply('Lütfen bir mesaj belirtin.');
        }

        try {
            
            await user.send(dmMessage);

            
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('DM Gönderildi')
                .setDescription(`Başarıyla ${user.tag} kullanıcısına DM gönderildi.`)
                .setTimestamp();

            await message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('DM gönderme sırasında bir hata oluştu:', error);
            message.reply('DM gönderilirken bir hata oluştu. Kullanıcının DM almayı kapatmış olabilir.');
        }
    },
};