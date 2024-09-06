const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const ms = require('ms');
const config = require('../config.json');

module.exports = {
    name: 'jail',
    description: 'Bir kullanıcıyı belirli bir süre için jail durumuna alır.',
    args: true,
    usage: '<kullanıcı> <süre> <sebep>',
    async execute(message, args) {
        
        const jailHammerRoleId = config.jailHammerRoleId; 
        if (!message.member.roles.cache.has(jailHammerRoleId)) {
            return message.reply("Bu komutu kullanmak için gerekli rolünüz bulunmuyor.");
        }

        
        const user = message.mentions.members.first();
        if (!user) return message.reply("Bir kullanıcı belirtmelisiniz.");
        if (user.id === message.author.id) return message.reply("Kendinizi cezaevine alamazsınız.");

        
        const duration = args[1];
        if (!duration) return message.reply("Bir süre belirtmelisiniz. Örneğin: `1d`");

        const reason = args.slice(2).join(' ');
        if (!reason) return message.reply("Bir sebep belirtmelisiniz.");

        
        const jailDuration = ms(duration);
        if (!jailDuration) return message.reply("Geçersiz süre formatı.");

        
        const jailRole = message.guild.roles.cache.get(config.jailRoleId);
        if (!jailRole) return message.reply("Jail rolü bulunamadı. Lütfen config.json dosyasındaki rol ID'sini kontrol edin.");

        
        const jailLogChannel = message.guild.channels.cache.get(config.jailLogChannelId);
        if (!jailLogChannel) return message.reply("Jail log kanalı bulunamadı. Lütfen config.json dosyasındaki kanal ID'sini kontrol edin.");

        
        try {
            await user.roles.add(jailRole);
        } catch (error) {
            console.error('Jail rolü eklenirken bir hata oluştu:', error);
            return message.reply("Jail rolü eklenirken bir hata oluştu.");
        }

        
        setTimeout(async () => {
            try {
                await user.roles.remove(jailRole);
                const embed = new EmbedBuilder()
                    .setColor('#FF0000') 
                    .setTitle('Jail Süresi Doldu')
                    .setDescription(`✔️ ${user.user.tag} jail süresi doldu ve serbest bırakıldı.\n**Zaman:** ${new Date().toLocaleString()}`)
                    .setTimestamp();
                await jailLogChannel.send({ embeds: [embed] });
            } catch (error) {
                console.error('Jail süresi dolduğunda rol kaldırılırken bir hata oluştu:', error);
            }
        }, jailDuration);

        
        const embed = new EmbedBuilder()
            .setColor('#FF0000') 
            .setTitle('Jail Uygulandı')
            .setDescription(`✔️ ${user.user.tag} kullanıcısı ${duration} süreyle jail durumuna alındı.\n**Sebep:** ${reason}\n**Zaman:** ${new Date().toLocaleString()}`)
            .setTimestamp();
        await jailLogChannel.send({ embeds: [embed] });

        
        message.reply(`✔️ ${user.user.tag} kullanıcısı ${duration} süreyle jail durumuna alındı. Sebep: ${reason}`);
    },
};