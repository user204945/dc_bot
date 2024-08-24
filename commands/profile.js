const { EmbedBuilder } = require('discord.js');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, '../esek.db');
const db = new sqlite3.Database(dbPath);
const config = require("../config.json");

module.exports = {
  name: 'profile',
  description: 'Kullanıcının profilini gösterir.',
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;

    db.get(`SELECT * FROM users WHERE userId = ?`, [user.id], (err, row) => {
      if (err) {
        console.error('Profil bilgileri alınırken hata:', err.message);
        return message.reply('Bir hata oluştu.');
      }

      if (!row) {
        return message.reply('Bu kullanıcı için profil bilgileri bulunamadı.');
      }

      const embed = new EmbedBuilder()
        .setColor('#000000')
        .setTitle(`${user.username}'ın Profili`)
        .setDescription(`**Coin ve Levellere özel roller:**
            
            **Coin'e Özel Roller**
            
            **1.000 Coin** - <@&${config.coinSystem.coinRoleIds.goldRoleId}>
            **500 Coin** - <@&${config.coinSystem.coinRoleIds.silverRoleId}>
            **100 Coin** - <@&${config.coinSystem.coinRoleIds.bronzeRoleId}>
            
            **Level'e Özel Roller**
            
            **20 Level** - <@&${config.coinSystem.levelRoleIds.wiseRoleId}>
            **10 Level** - <@&${config.coinSystem.levelRoleIds.masterRoleId}>
            **5 Level** - <@&${config.coinSystem.levelRoleIds.newbieRoleId}>
            
            **İstatistiklerin:**`)
        .addFields(
          { name: 'Coins', value: row.coins.toString(), inline: true },
          { name: 'Level', value: row.level.toString(), inline: true },
          { name: 'XP', value: row.experience.toString(), inline: true }
        )
        .setTimestamp();

      console.log(`Profil bilgileri: ${user.username} - Coins: ${row.coins}, Level: ${row.level}, Experience: ${row.experience}`);
      message.channel.send({ embeds: [embed] });
    });
  },
};