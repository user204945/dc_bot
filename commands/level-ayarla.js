const { EmbedBuilder } = require('discord.js');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const config = require('../config.json');
const updateUserAndRole = require('../functions/updateUserAndRole');

const db = new sqlite3.Database(config.dbPath);

module.exports = {
    name: 'level-ayarla',
    description: 'Kullanıcının seviyesini belirli bir sayıya ayarlar.',
    async execute(message, args) {
        
        const memberRoles = message.member.roles.cache.map(role => role.id);
        const allowedRole = config.slashRoleId; 
        const hasPermission = memberRoles.includes(allowedRole);

        if (!hasPermission) {
            return message.reply('Bu komutu kullanma izniniz yok.');
        }

        const user = message.mentions.users.first();
        const level = parseInt(args[1]);

        if (!user) {
            return message.reply('Lütfen bir kullanıcı etiketleyin.');
        }

        if (isNaN(level)) {
            return message.reply('Lütfen geçerli bir seviye girin.');
        }

        const userId = user.id;

        db.run(`INSERT OR REPLACE INTO users (userId, coins, level, experience, lastMessageTimestamp, voiceStartTimestamp) VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, 0, level, 0, new Date().toISOString(), null],
            function(err) {
                if (err) {
                    console.error('Veritabanı güncelleme hatası:', err.message);
                    return message.reply('Bir hata oluştu.');
                }

                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('Seviye Ayarlandı')
                    .setDescription(`${user.username} kullanıcısının seviyesi ${level} olarak ayarlandı.`)
                    .setTimestamp();

                message.channel.send({ embeds: [embed] });

                
                updateUserAndRole(message.client, userId, 0, level); 
            }
        );
    },
};