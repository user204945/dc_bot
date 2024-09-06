const { Client, Events, GatewayIntentBits, Collection, EmbedBuilder, ActivityType } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus } = require("@discordjs/voice");
const path = require('path');
const fs = require('fs');
const config = require('./config.json');
const updateUserAndRole = require('./functions/updateUserAndRole');
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, 'esek.db');

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Sunucu ${port} numaralı portta yürütülüyor.`);
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Veritabanı bağlantı hatası:', err.message);
    } else {
        console.log('SQLite veritabanına bağlanıldı.');
    }
});

db.run(`CREATE TABLE IF NOT EXISTS users (
    userId TEXT PRIMARY KEY,
    coins INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    lastMessageTimestamp TEXT,
    voiceStartTimestamp TEXT
)`);

const prefix = config.prefix;
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

let totalCommands = 0;
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    try {
        const command = require(filePath);
        if (command.name && typeof command.execute === 'function') {
            client.commands.set(command.name, command);
            console.log(`Komut yüklendi: ${command.name}`);
        } else {
            console.error(`Komut dosyası hatalı: ${file}`);
        }
        totalCommands++;
    } catch (error) {
        console.error(`Komut dosyası yüklenirken bir hata oluştu: ${file}`, error);
    }
}

console.log("Yüklenen toplam komutlar:", totalCommands);

async function logToChannel(title, description) {
    const logChannel = client.channels.cache.get(config.logChannelId);
    if (logChannel) {
        const embed = new EmbedBuilder()
            .setColor('#000000')
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();

        try {
            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Log kanalına mesaj gönderilirken bir hata oluştu:', error);
        }
    } else {
        console.error('Log kanalı bulunamadı.');
    }
}

async function sendRegisterMessage(channel, member) {
    const title = 'Hoşgeldin!';
    const description = `🎉 ${member.user.tag} sunucuya hoşgeldin! Kayıt olmak için ismini ve yaşını yaz. En yakın sürede yetkililer seni kayıt edecektir.`;

    const role = member.guild.roles.cache.get(config.registerAuthorizedRoleId);

    if (!role) {
        console.error("Belirtilen rol bulunamadı.");
        return;
    }

    const roleMention = `<@&${role.id}>`;

    const embed = {
        color: 0x00FF00,
        title: title,
        description: description,
        timestamp: new Date(),
    };

    try {
        await channel.send(roleMention);
        await channel.send({ embeds: [embed] });
        console.log(`Register mesajı ${channel.name} kanalına gönderildi.`);
    } catch (error) {
        console.error('Hoş geldin mesajı gönderilirken bir hata oluştu:', error);
    }
}

const activities = [
    { name: 'discord.gg/esek', type: ActivityType.Streaming, url: 'https://www.youtube.com/watch?v=5v5w8hLDECc' },
    { name: '.yardım', type: ActivityType.Streaming, url: 'https://www.youtube.com/watch?v=5v5w8hLDECc' }
];

let currentIndex = 0;

function updatePresence() {
    client.user.setPresence({
        activities: [activities[currentIndex]],
        status: 'online'
    });
    currentIndex = (currentIndex + 1) % activities.length;
}

async function giveRole(member, roleName) {
    const role = member.guild.roles.cache.find(r => r.name === roleName);
    if (role) {
        await member.roles.add(role);
    } else {
        console.error(`Rol bulunamadı: ${roleName}`);
    }
}

async function removeRole(member, roleName) {
    const role = member.guild.roles.cache.find(r => r.name === roleName);
    if (role) {
        await member.roles.remove(role);
    } else {
        console.error(`Rol bulunamadı: ${roleName}`);
    }
}

client.once('ready', () => {
    console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);
    const guild = client.guilds.cache.get(config.guildId);

    setInterval(updatePresence, 10000);

    if (guild) {
        const voiceChannel = guild.channels.cache.get(config.voiceChannelId);

        if (voiceChannel) {
            try {
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: guild.id,
                    adapterCreator: guild.voiceAdapterCreator,
                });

                connection.on(VoiceConnectionStatus.Ready, () => {
                    console.log(`Başarıyla ${voiceChannel.name} sesli kanalına bağlandım!`);
                });

                connection.on(VoiceConnectionStatus.Disconnected, () => {
                    console.log(`Sesli kanaldan bağlantı kesildi.`);
                });

                connection.on('error', (error) => {
                    console.error('Sesli kanala bağlanırken hata oluştu:', error);
                });
            } catch (error) {
                console.error('Sesli kanala bağlanırken bir hata oluştu:', error);
            }
        } else {
            console.error('Belirtilen sesli kanal bulunamadı.');
        }
    } else {
        console.error('Belirtilen sunucu bulunamadı.');
    }
});

client.on('error', error => {
    console.error('Botta bir hata oluştu:', error);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const prefix = config.prefix;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        command.execute(message, args, db);
    } catch (error) {
        console.error(`Komut işleme hatası: ${error.message}`);
        message.channel.send('Komut işlenirken bir hata oluştu.');
    }

    const now = new Date();
    db.get(`SELECT * FROM users WHERE userId = ?`, [message.author.id], (err, row) => {
        if (err) {
            console.error('Kullanıcı sorgulama hatası:', err.message);
            return;
        }

        const lastMessageTimestamp = row ? new Date(row.lastMessageTimestamp) : now;
        const timeDiff = Math.abs(now - lastMessageTimestamp) / 1000;
        let coins = row ? row.coins : 0;
        let experience = row ? row.experience : 0;
        let level = row ? row.level : 1;

        if (timeDiff > 30) {
            coins += 1;
        }

        experience += 1;
        const requiredXP = level * 100;
        if (experience >= requiredXP) {
            level += 1;
            experience = 0;
        }

        db.run(`INSERT OR REPLACE INTO users (userId, coins, level, experience, lastMessageTimestamp) VALUES (?, ?, ?, ?, ?)`,
            [message.author.id, coins, level, experience, now.toISOString()],
            (err) => {
                if (err) {
                    console.error('Veritabanı güncelleme hatası:', err.message);
                }
            }
        );
        updateUserAndRole(client, message.author.id, coins, level);
    });

    if (config.linkEngel && !message.author.bot) {
        const linkRegex = /https?:\/\/[^\s]+/g;
        if (linkRegex.test(message.content)) {
            message.delete();
            message.author.send('Link göndermeniz engellendi.');
        }
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    const roleIdMap = {
        'toggle_fortnite': config.roleSetup.fortniteRoleId,
        'toggle_valorant': config.roleSetup.valorantRoleId,
        'toggle_league': config.roleSetup.leagueOfLegendsRoleId,
        'toggle_zula': config.roleSetup.zulaRoleId,
        'toggle_gta5': config.roleSetup.gta5RoleId,
        'toggle_minecraft': config.roleSetup.minecraftRoleId,
        'toggle_csgo': config.roleSetup.csgoRoleId
    };

    const roleId = roleIdMap[interaction.customId];
    if (roleId) {
        const role = interaction.guild.roles.cache.get(roleId);
        if (role) {
            try {
                if (interaction.member.roles.cache.has(roleId)) {
                    await interaction.member.roles.remove(role);
                    await interaction.reply({ content: `Rolünüz ${role.name} kaldırıldı!`, ephemeral: true });
                } else {
                    await interaction.member.roles.add(role);
                    await interaction.reply({ content: `Rolünüz ${role.name} eklendi!`, ephemeral: true });
                }
            } catch (error) {
                console.error('Rol ekleme/kaldırma hatası:', error);
                await interaction.reply({ content: 'Bir hata oluştu!', ephemeral: true });
            }
        } else {
            await interaction.reply({ content: 'Rol bulunamadı!', ephemeral: true });
        }
    } else {
        await interaction.reply({ content: 'Geçersiz etkileşim!', ephemeral: true });
    }

    if (interaction.type === InteractionType.ApplicationCommand) {
        const command = client.commands.get(interaction.commandName);
        if (command) {
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Bir hata oluştu!', ephemeral: true });
            }
        }
    }

    if (interaction.isButton()) {
        const { customId } = interaction;

        if (customId === 'eğlence') {
            const funEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('Eğlence Komutları')
                .setDescription('Aşağıda eğlence ile ilgili komutları bulabilirsiniz.')
                .addFields(
                    { name: '.patla', value: 'Sahte patlama komutu.', inline: true },
                    { name: '.ip <kullanıcı>', value: 'Sahte IP adresi üretir.', inline: true },
                    { name: '.kaç-cm <kullanıcı>', value: 'Rastgele yarrak boyu üretir.', inline: true },
                    { name: '.sik <kullanıcı>', value: 'Belirtilen kişiyi siker.', inline: true }
                )
                .setTimestamp();

            await interaction.update({ embeds: [funEmbed], components: [] });
        } else if (customId === 'yetkili') {
            const modEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Yetkili Komutları')
                .setDescription('Aşağıda yetkili ile ilgili komutları bulabilirsiniz.')
                .addFields(
                    { name: '.ban <kullanıcı> <sebep>', value: 'Kullanıcıyı yasaklar.', inline: true },
                    { name: '.kick <kullanıcı> <sebep>', value: 'Kullanıcıyı sunucudan atar.', inline: true },
                    { name: '.jail <kullanıcı> <süre> <sebep>', value: 'Kullanıcıya jail atar.', inline: true },
                    { name: '.unjail <kullanıcı>', value: 'Kullanıcının jailini kaldırır.', inline: true },
                    { name: '.k <kullanıcı id> <isim> <yaş>', value: 'Kullanıcıyı kayıt eder.', inline: true },
                    { name: '.k-sil <kullanıcı id>', value: 'Kullanıcının kaydını siler.', inline: true },
                    { name: '.nuke', value: 'Mevcut kanalı siler ve aynısını tekrardan açar.', inline: true },
                    { name: '.sil <miktar>', value: 'Belirtilen miktarda mesajı siler.', inline: true },
                    { name: '.lock', value: 'Belirtilen kanalı kilitler.', inline: true }
                )
                .setTimestamp();

            await interaction.update({ embeds: [modEmbed], components: [] });
        }
    }
});


client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    const greetings = ['selam', 'sa', 'naber', 'merhaba'];
    const response = 'Aleyküm selam hoşgeldin!';

    if (greetings.includes(message.content.toLowerCase())) {
        message.reply(response);
    }

    if (message.content.toLowerCase().includes('nasılsın')) {
        message.reply('İyiyim eşşek ses kanalına geçte sunucu aktifliği artsın');
    }

    if (message.content.toLowerCase().includes('sen geç')) {
        message.reply('Hassiktir git lan amcık sunucu benim');
    }
});

client.on('messageDelete', async message => {
    const title = 'Mesaj Silindi';
    const description = `🗑️ Bir mesaj silindi:\n**Yazar:** ${message.author ? message.author.tag : 'Bilinmeyen Kullanıcı'}\n**Kanal:** ${message.channel.name}\n**İçerik:** ${message.content}`;
    logToChannel(title, description);
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (oldMessage.content === newMessage.content) return;
    const title = 'Mesaj Güncellendi';
    const description = `✏️ Bir mesaj güncellendi:\n**Yazar:** ${oldMessage.author.tag}\n**Kanal:** ${oldMessage.channel.name}\n**Önceki:** ${oldMessage.content}\n**Sonraki:** ${newMessage.content}`;
    logToChannel(title, description);
});

client.on('guildMemberAdd', async member => {
    if (config.botProtection.enabled && member.user.bot) {
        try {
            await member.ban({ reason: 'Bot Koruması Aktif' });

            const fetchAuditLogs = await member.guild.fetchAuditLogs({
                limit: 1,
                type: 2
            });

            const auditLogEntry = fetchAuditLogs.entries.first();
            const executor = auditLogEntry ? auditLogEntry.executor : 'Bilinmeyen';

            const logChannel = await client.channels.fetch(config.botProtection.logChannelId);
            if (logChannel && logChannel.isTextBased()) {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('Bot Koruma')
                    .setDescription(`${member.user.tag} **adlı BOT sunucuya katılmaya çalıştı ve yasaklandı.**`)
                    .addFields(
                        { name: 'Botu Ekleyen', value: executor.tag || 'Bilinmeyen' }
                    )
                    .setTimestamp();

                await logChannel.send({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Bot Koruma Hata:', error);
        }
    }

    const role = member.guild.roles.cache.get(config.unregisteredRoleId);
    if (role) {
        try {
            await member.roles.add(role);
            console.log(`Yeni üye ${member.user.tag} - "Unregistered" rolü eklendi.`);
        } catch (error) {
            console.error('Rol eklenirken bir hata oluştu:', error);
        }
    } else {
        console.error('Unregistered rolü bulunamadı.');
    }

    const welcomeChannel = member.guild.channels.cache.get(config.welcomeChannelId);
    if (!welcomeChannel) return;

    const totalMembers = member.guild.memberCount;

    welcomeChannel.send({
        content: `<a:giris:1275545014356803745> <@${member.user.id}> sunucuya katıldı! Şu anda **${totalMembers}** kişiyiz.`
    });

    const registerChannel = member.guild.channels.cache.get(config.registerChannelId);
    if (registerChannel) {
        await sendRegisterMessage(registerChannel, member);
    } else {
        console.error('Register kanalı bulunamadı.');
    }
});

client.on('guildMemberRemove', async member => {
    const welcomeChannel = member.guild.channels.cache.get(config.welcomeChannelId);
    if (!welcomeChannel) return;

    const totalMembers = member.guild.memberCount;

    welcomeChannel.send({
        content: `<a:cikis:1275545010778935478> <@${member.user.id}> sunucudan ayrıldı! Şu anda **${totalMembers}** kişiyiz.`
    });
});

client.on('roleCreate', async role => {
    const title = 'Rol Oluşturuldu';
    const description = `🆕 Yeni rol oluşturuldu:\n**Rol:** ${role.name}`;
    logToChannel(title, description);
});

client.on('roleDelete', async role => {
    const title = 'Rol Silindi';
    const description = `🗑️ Rol silindi:\n**Rol:** ${role.name}`;
    logToChannel(title, description);
});

client.on('roleUpdate', async (oldRole, newRole) => {
    const title = 'Rol Güncellendi';
    const description = `🔄 Rol güncellemesi:\n**Önceki Rol:** ${oldRole.name}\n**Yeni Rol:** ${newRole.name}`;
    logToChannel(title, description);
});

client.on('channelCreate', async channel => {
    const title = 'Kanal Oluşturuldu';
    const description = `📂 Yeni kanal oluşturuldu:\n**Kanal:** ${channel.name}\n**Tür:** ${channel.type}`;
    logToChannel(title, description);
});

client.on('channelDelete', async channel => {
    const title = 'Kanal Silindi';
    const description = `🗑️ Kanal silindi:\n**Kanal:** ${channel.name}\n**Tür:** ${channel.type}`;
    logToChannel(title, description);
});

client.on('channelUpdate', async (oldChannel, newChannel) => {
    const title = 'Kanal Güncellendi';
    const description = `🔄 Kanal güncellemesi:\n**Önceki Kanal:** ${oldChannel.name}\n**Yeni Kanal:** ${newChannel.name}\n**Tür:** ${newChannel.type}`;
    logToChannel(title, description);
});

client.on('emojiCreate', async emoji => {
    const title = 'Emoji Oluşturuldu';
    const description = `😀 Yeni emoji oluşturuldu:\n**Emoji:** ${emoji.name}`;
    logToChannel(title, description);
});

client.on('emojiDelete', async emoji => {
    const title = 'Emoji Silindi';
    const description = `❌ Emoji silindi:\n**Emoji:** ${emoji.name}`;
    logToChannel(title, description);
});

client.on('emojiUpdate', async (oldEmoji, newEmoji) => {
    const title = 'Emoji Güncellendi';
    const description = `🔄 Emoji güncellemesi:\n**Önceki Emoji:** ${oldEmoji.name}\n**Yeni Emoji:** ${newEmoji.name}`;
    logToChannel(title, description);
});

client.on('guildBanAdd', async (guild, user) => {
    const title = 'Üye Yasaklandı';
    const description = `🚫 ${user.tag} yasaklandı.`;
    logToChannel(title, description);
});

client.on('guildBanRemove', async (guild, user) => {
    const title = 'Yasaklama Kaldırıldı';
    const description = `✅ ${user.tag} yasaklamadan çıkarıldı.`;
    logToChannel(title, description);
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const oldRoles = oldMember.roles.cache.map(role => role.id);
    const newRoles = newMember.roles.cache.map(role => role.id);

    const addedRoles = newRoles.filter(role => !oldRoles.includes(role));
    const removedRoles = oldRoles.filter(role => !newRoles.includes(role));

    const addedRoleObjects = newMember.guild.roles.cache.filter(role => addedRoles.includes(role.id));
    const removedRoleObjects = oldMember.guild.roles.cache.filter(role => removedRoles.includes(role.id));

    if (addedRoleObjects.size > 0) {
        const title = 'Rol Verildi';
        const description = `✔️ ${newMember.user.tag} kullanıcısına rol verildi:\n${addedRoleObjects.map(role => `**${role.name}**`).join('\n')}\n**Zaman:** ${new Date().toLocaleString()}`;
        await logToChannel(title, description);
    }

    if (removedRoleObjects.size > 0) {
        const title = 'Rol Alındı';
        const description = `❌ ${newMember.user.tag} kullanıcısından rol alındı:\n${removedRoleObjects.map(role => `**${role.name}**`).join('\n')}\n**Zaman:** ${new Date().toLocaleString()}`;
        await logToChannel(title, description);
    }
});

client.on('guildUpdate', async (oldGuild, newGuild) => {
    const title = 'Sunucu Ayarları Güncellendi';
    const description = `🔄 Sunucu ayarları güncellendi:\n**Önceki Sunucu Adı:** ${oldGuild.name}\n**Yeni Sunucu Adı:** ${newGuild.name}\n**Zaman:** ${new Date().toLocaleString()}`;
    logToChannel(title, description);
});

client.on('userUpdate', async (oldUser, newUser) => {
    let changes = [];
    if (oldUser.username !== newUser.username) {
        changes.push(`**Kullanıcı Adı:** ${oldUser.username} → ${newUser.username}`);
    }
    if (oldUser.avatar !== newUser.avatar) {
        changes.push('**Avatar:** Güncellendi');
    }

    if (changes.length > 0) {
        const title = 'Kullanıcı Güncellendi';
        const description = `🔄 Kullanıcı güncellemeleri:\n**Kullanıcı:** ${oldUser.tag}\n${changes.join('\n')}\n**Zaman:** ${new Date().toLocaleString()}`;
        logToChannel(title, description);
    }
});

function addUser(userId, callback) {
    const stmt = db.prepare('INSERT INTO users (userId) VALUES (?)');
    stmt.run(userId, function (err) {
        if (err) {
            console.error('Kullanıcı ekleme hatası:', err.message);
        } else {
            console.log(`Kullanıcı eklendi: ${userId}`);
        }
        if (callback) callback(err);
    });
    stmt.finalize();
}

function updateUser(userId, coins, level, experience, callback) {
    const stmt = db.prepare('UPDATE users SET coins = ?, level = ?, experience = ? WHERE userId = ?');
    stmt.run(coins, level, experience, userId, function (err) {
        if (err) {
            console.error('Kullanıcı güncelleme hatası:', err.message);
        } else {
            console.log(`Kullanıcı güncellendi: ${userId}`);
        }
        if (callback) callback(err);
    });
    stmt.finalize();
}

function getUser(userId, callback) {
    db.get('SELECT * FROM users WHERE userId = ?', [userId], (err, row) => {
        if (err) {
            console.error('Kullanıcı sorgulama hatası:', err.message);
        } else {
            callback(row);
        }
    });
}

function addCoins(userId, amount, callback) {
    getUser(userId, (user) => {
        if (user) {
            const newCoins = user.coins + amount;
            const newExperience = user.experience + amount;
            let newLevel = user.level;

            while (newExperience >= 100 * newLevel) {
                newLevel += 1;
            }

            updateUser(userId, newCoins, newLevel, newExperience, callback);
        } else {
            console.log('Kullanıcı bulunamadı.');
            if (callback) callback(new Error('Kullanıcı bulunamadı.'));
        }
    });
}

client.login(process.env.TOKEN);
