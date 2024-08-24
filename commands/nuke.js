const { PermissionsBitField } = require('discord.js');
const config = require("../config.json");

module.exports = {
    name: 'nuke',
    description: 'Mevcut kanalı siler ve aynı isimle ve izinlerle tekrar oluşturur.',
    async execute(message, args) {

        if (!message.member.roles.cache.has(config.slashRoleId)) {
            return message.reply('Bu komutu kullanmak için gerekli izne sahip değilsiniz.');
        }

        const channel = message.channel;

        try {
            
            const permissions = channel.permissionOverwrites.cache.map(permission => ({
                id: permission.id,
                allow: permission.allow.toArray(),
                deny: permission.deny.toArray()
            }));

            
            await channel.delete();

            
            const newChannel = await channel.guild.channels.create({
                name: channel.name,
                type: channel.type,
                permissionOverwrites: permissions,
                parent: channel.parentId, 
                topic: channel.topic, 
                nsfw: channel.nsfw, 
                rateLimitPerUser: channel.rateLimitPerUser, 
            });
        } catch (error) {
            console.error('Kanal silme sırasında bir hata oluştu:', error);
            if (message.channel) {
                message.channel.send('Kanal silinirken bir hata oluştu.');
            }
        }
    },
};