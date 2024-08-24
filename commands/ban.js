const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'ban',
    description: 'Bir kullanıcıyı yasaklar.',
    args: true,
    usage: '<kullanıcı> <sebep>',
    async execute(message, args) {
        
        const banHammerRoleId = config.banHammerRoleId;
        if (!message.member.roles.cache.has(banHammerRoleId)) {
            return message.reply('Bu komutu kullanmak için gerekli role sahip değilsiniz.');
        }

        
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply('Bu komutu kullanmak için gerekli izne sahip değilsiniz.');
        }

        
        const user = message.mentions.members.first();
        if (!user) return message.reply('Bir kullanıcı belirtmelisiniz.');
        if (user.id === message.author.id) return message.reply('Kendinizi yasaklayamazsınız.');

        const reason = args.slice(1).join(' ') || 'Neden belirtilmemiş';

        
        try {
            await user.ban({ reason });
            const embed = new EmbedBuilder()
                .setColor('#FF0000') 
                .setTitle('Kullanıcı Yasaklandı')
                .setDescription(`✔️ ${user.user.tag} kullanıcısı yasaklandı.\n**Sebep:** ${reason}\n**Zaman:** ${new Date().toLocaleString()}`)
                .setTimestamp();
            
            const logChannel = message.guild.channels.cache.get(config.logChannelId);
            if (logChannel) {
                await logChannel.send({ embeds: [embed] });
            }

            
            message.reply(`✔️ ${user.user.tag} kullanıcısı yasaklandı. Sebep: ${reason}`);
        } catch (error) {
            console.error('Yasaklama işlemi sırasında bir hata oluştu:', error);
            return message.reply('Yasaklama işlemi sırasında bir hata oluştu.');
        }
    },
};