const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'leaderboard',
    description: 'En yüksek coin miktarına sahip kullanıcıları gösterir.',
    async execute(message, args, db) {
        db.all('SELECT userId, coins, level FROM users ORDER BY coins DESC LIMIT 10', [], (err, rows) => {
            if (err) {
                console.error('Lider tablosu sorgulama hatası:', err.message);
                message.channel.send('Lider tablosu bilgileri alınamadı.');
                return;
            }

            const leaderboardEmbed = new EmbedBuilder()
                .setTitle('Lider Tablosu')
                .setColor('#00ff00');

            rows.forEach((row, index) => {
                leaderboardEmbed.addFields(
                    { name: `#${index + 1}`, value: `<@${row.userId}> - Coins: ${row.coins} - Level: ${row.level}` }
                );
            });

            message.channel.send({ embeds: [leaderboardEmbed] });
        });
    }
};