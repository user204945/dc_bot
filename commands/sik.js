const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'sik',
    description: 'Sikmek istediğin kullanıcıyı etiketle.',
    async execute(message, args) {
        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);

        if (!user) {
            return message.reply('Lütfen geçerli bir kullanıcı belirtin.');
        }
        
        const userTag = `<@${user.id}>`;
        const authorizedUserId = '1068833827532849213';
        const herobrineUserId = '1258352376251940936';

        if (user.id === herobrineUserId && message.author.id === authorizedUserId) {
            const gifUrls = [
                'https://media1.tenor.com/m/0kTFTmi9nN0AAAAC/bi%C5%9Fi.gif',
                'https://media1.tenor.com/m/d2AfqwLZ8YkAAAAC/recep-ivedik.gif'
            ];

            const randomIndex = Math.floor(Math.random() * gifUrls.length);
            const selectedGifUrl = gifUrls[randomIndex];

            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Sikiş başlasın!')
                .setDescription(`${userTag} adlı kişiyi sikti!`)
                .setImage(selectedGifUrl)
                .setTimestamp();

            try {
                await message.channel.send({ embeds: [embed] });
            } catch (error) {
                console.error('Sikiş mesajı gönderilirken bir hata oluştu:', error);
            }
        } else if (user.id === authorizedUserId) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Sikiş Başarısız!')
                .setDescription(`${userTag} adlı kişiyi SİKEMEZSİN!`)
                .setImage("https://media1.tenor.com/m/pv-D91JGxWIAAAAd/homelander-n0.gif")
                .setTimestamp();
            try {
                await message.channel.send({ embeds: [embed] });
            } catch (error) {
                console.error("Sikiş mesajı gönderilirken hata oluştu:", error);
            }
        } else if (user.id === herobrineUserId) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Sikiş Başarısız!')
                .setDescription(`${userTag} adlı kişiyi sadece ben SİKEBİLİRİM!`)
                .setImage("https://media1.tenor.com/m/pv-D91JGxWIAAAAd/homelander-n0.gif")
                .setTimestamp();
            try {
                await message.channel.send({ embeds: [embed] });
            } catch (error) {
                console.error("Sikiş mesajı gönderilirken bir hata oluştu:", error);
            }
        } else {
            const gifUrls = [
                'https://media1.tenor.com/m/0kTFTmi9nN0AAAAC/bi%C5%9Fi.gif',
                'https://media1.tenor.com/m/d2AfqwLZ8YkAAAAC/recep-ivedik.gif'
            ];

            const randomIndex = Math.floor(Math.random() * gifUrls.length);
            const selectedGifUrl = gifUrls[randomIndex];

            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Sikiş başlasın!')
                .setDescription(`${userTag} adlı kişiyi sikti!`)
                .setImage(selectedGifUrl)
                .setTimestamp();

            try {
                await message.channel.send({ embeds: [embed] });
            } catch (error) {
                console.error('Sikiş mesajı gönderilirken bir hata oluştu:', error);
            }
        }
    },
};