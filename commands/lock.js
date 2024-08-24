const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'lock',
    description: 'Bu komut kanalı kilitler veya kilidini açar.',
    async execute(message) {
        
        const channel = message.channel;

        
        const isLocked = !channel.permissionsFor(message.guild.roles.everyone).has(PermissionsBitField.Flags.SendMessages);

        
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.reply('Bu komutu kullanmak için `Kanalları Yönet` iznine sahip olmanız gerekiyor.');
        }

        try {
            if (isLocked) {
                
                await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                    SendMessages: true,
                    AddReactions: true
                });

                const embed = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('<:unlocked:1275825575923023945> Kanalın kilidi açıldı.')
                    .setDescription(' ');

                await message.reply({ embeds: [embed] });
            } else {
                
                await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                    SendMessages: false,
                    AddReactions: false
                });

                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('<:locked:1275825574220136578> Kanal kilitlendi.')
                    .setDescription(' ');

                await message.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error(error);
            await message.reply('Kanalı yönetirken bir hata oluştu!');
        }
    },
};