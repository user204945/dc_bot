const { EmbedBuilder } = require('discord.js');
const updateUserAndRole = require('../functions/updateUserAndRole');
const { getDatabase } = require('../functions/dbUtils');
const db = getDatabase();
const config = require('../config.json');

module.exports = {
    name: 'level-ekle',
    description: 'Bir kullanıcının seviyesini artırır.',
    async execute(message, args) {
        const authorizedRoleId = config.slashRoleId; 
        if (!message.member.roles.cache.has(authorizedRoleId)) {
            return message.reply('Bu komutu kullanmak için yeterli yetkiniz yok.');
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Lütfen bir kullanıcı etiketleyin.');
        }

        const levelToAdd = parseInt(args[1]);
        if (isNaN(levelToAdd) || levelToAdd <= 0) {
            return message.reply('Lütfen geçerli bir seviye miktarı girin.');
        }

        db.get(`SELECT * FROM users WHERE userId = ?`, [user.id], (err, row) => {
            if (err) {
                console.error('Kullanıcı bilgileri alınırken hata:', err.message);
                return message.reply('Bir hata oluştu.');
            }

            let newLevel = row ? row.level + levelToAdd : levelToAdd;
            let coins = row ? row.coins : 0;

            updateUserAndRole(message.client, user.id, coins, newLevel); 

            db.run(`INSERT OR REPLACE INTO users (userId, coins, level, experience, lastMessageTimestamp, voiceStartTimestamp) VALUES (?, ?, ?, ?, ?, ?)`,
                [user.id, coins, newLevel, row ? row.experience : 0, new Date().toISOString(), row ? row.voiceStartTimestamp : null],
                (err) => {
                    if (err) {
                        console.error('Level eklerken hata:', err.message);
                        return message.reply('Bir hata oluştu.');
                    }
                    console.log(`Eklenen seviye: ${user.username} - ${levelToAdd}`);
                    message.channel.send(`${user.username} kullanıcısının seviyesine ${levelToAdd} eklendi.`);
                }
            );
        });
    },
};