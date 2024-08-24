const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const config = require('../config.json');

const db = new sqlite3.Database(config.dbPath);

async function updateUserAndRole(client, userId, coins, level) {
    const guild = client.guilds.cache.get(config.guildId); 

    
    db.run(`INSERT OR REPLACE INTO users (userId, coins, level, experience, lastMessageTimestamp, voiceStartTimestamp) VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, coins, level, 0, new Date().toISOString(), null],
        async (err) => {
            if (err) {
                console.error('Veritabanı güncellenirken hata:', err.message);
                return;
            }

            try {
                
                const member = await guild.members.fetch(userId);
                if (!member) {
                    console.error('Üye bulunamadı.');
                    return;
                }

                const roleNames = {
                    'Altın Eşek': config.coinSystem.coinRoleIds.goldRoleId,
                    'Gümüş Eşek': config.coinSystem.coinRoleIds.silverRoleId,
                    'Bronz Eşek': config.coinSystem.coinRoleIds.bronzeRoleId,
                    'Bilge Eşek': config.coinSystem.levelRoleIds.wiseRoleId,
                    'Usta Eşek': config.coinSystem.levelRoleIds.masterRoleId,
                    'Yeni Eşek': config.coinSystem.levelRoleIds.newbieRoleId,
                };

                const rolesToAdd = [];
                const rolesToRemove = [];

                
                if (coins >= 1000) rolesToAdd.push(roleNames['Altın Eşek']);
                if (coins >= 500) rolesToAdd.push(roleNames['Gümüş Eşek']);
                if (coins >= 100) rolesToAdd.push(roleNames['Bronz Eşek']);
                if (coins < 100) {
                    rolesToRemove.push(roleNames['Altın Eşek'], roleNames['Gümüş Eşek'], roleNames['Bronz Eşek']);
                }

                
                if (level >= 20) rolesToAdd.push(roleNames['Bilge Eşek']);
                if (level >= 10) rolesToAdd.push(roleNames['Usta Eşek']);
                if (level >= 5) rolesToAdd.push(roleNames['Yeni Eşek']);
                if (level < 5) {
                    rolesToRemove.push(roleNames['Bilge Eşek'], roleNames['Usta Eşek'], roleNames['Yeni Eşek']);
                }

                
                for (const roleId of rolesToAdd) {
                    const role = guild.roles.cache.get(roleId);
                    if (role && !member.roles.cache.has(roleId)) {
                        await member.roles.add(role);
                    }
                }

                
                for (const roleId of rolesToRemove) {
                    const role = guild.roles.cache.get(roleId);
                    if (role && member.roles.cache.has(roleId)) {
                        await member.roles.remove(role);
                    }
                }
            } catch (error) {
                console.error('Rol verme veya kaldırma işlemi sırasında hata:', error.message);
            }
        }
    );
}

module.exports = updateUserAndRole;