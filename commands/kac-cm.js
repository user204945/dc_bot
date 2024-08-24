const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'kaç-cm',
    description: 'Kaç cm?',
    async execute(message, args) {
        // Kullanıcıyı belirtin
        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0])?.user;

        if (!user) {
            return message.reply('Lütfen geçerli bir kullanıcı belirtin.');
        }

        const randomCm = Math.floor(Math.random() * 50) + 1;
        let embed;
        let gifUrl;

        if (randomCm <= 10) {
            gifUrl = 'https://media1.tenor.com/m/FLUaxkYFsGIAAAAC/beans-taking-seeds-off.gif';
            embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Bamya yarraklı')
                .setDescription(`**${user.tag}** **${randomCm}** cm. Bu kadar büyük bir bamyayı saklamak için gayret göstermiyorsundur herhalde.`)
                .setImage(gifUrl)
                .setTimestamp();
        } else if (randomCm <= 15) {
            gifUrl = 'https://media1.tenor.com/m/JmZGCQwJg8MAAAAC/chinese-girl-handjob-gesture-hand-job.gif';
            embed = new EmbedBuilder()
                .setColor('#FF9900')
                .setTitle('Orta boy yarrak!')
                .setDescription(`**${user.tag}** **${randomCm}** cm. Geceleri biraz asıl kardeşim büyütürsün.`)
                .setImage(gifUrl)
                .setTimestamp();
        } else if (randomCm <= 30) {
            gifUrl = 'https://media1.tenor.com/m/28FCoR51U5AAAAAC/peen-meat.gif';
            embed = new EmbedBuilder()
                .setColor('#0099FF')
                .setTitle('Patlıcan Yarraklı!')
                .setDescription(`**${user.tag}** **${randomCm}** cm. Beraber Patlıcan Oturtma yapmayın. Yoksa bir bakmışsın patlıcana oturmuşsun.`)
                .setImage(gifUrl)
                .setTimestamp();
        } else if (randomCm <= 40) {
            gifUrl = 'https://media1.tenor.com/m/mvCCXfZ40zMAAAAC/cucumber-seductive.gif';
            embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('İnsanazor Yarrağı!')
            .setDescription(`**${user.tag}** **${randomCm}** cm. Çıkarda gölgesinde serinleyelim reis.`)
            .setImage(gifUrl)
            .setTimestamp();
        } else {
            gifUrl = 'https://media1.tenor.com/m/qaHda17olGoAAAAd/zencidu%C5%9F-tadashidesu.gif';
            embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Büyük Boy Siyahi Adam Yarrağı!')
                .setDescription(`**${user.tag}** **${randomCm}** cm. Bu Siyah Adam ile sakın aynı yatakta yatmayın yoksa gece hiç iyi şeyler olmaz.`)
                .setImage(gifUrl)
                .setTimestamp();
        }

        // Mesajı gönderin
        await message.reply({ embeds: [embed] });
    },
};