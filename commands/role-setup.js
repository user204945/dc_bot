const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'rol-setup',
    description: 'Rol seçimi için embed mesajı gönderir.',
    async execute(message) {
        const embed = new EmbedBuilder()
            .setTitle('Rol Seçimi')
            .setDescription('Lütfen bir veya daha fazla oyun rolü seçin:');
        
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('toggle_fortnite')
                    .setLabel('Fortnite')
                    .setStyle('Secondary'),
                new ButtonBuilder()
                    .setCustomId('toggle_valorant')
                    .setLabel('Valorant')
                    .setStyle('Secondary'),
                new ButtonBuilder()
                    .setCustomId('toggle_league')
                    .setLabel('League of Legends')
                    .setStyle('Secondary')
                new ButtonBuilder()
                    .setCustomId('toggle_csgo')
                    .setLabel('Counter-Strike 2')
                    .setStyle('Secondary')
                new ButtonBuilder()
                    .setCustomId('toggle_gta5')
                    .setLabel('GTA V')
                    .setStyle('Secondary')
                new ButtonBuilder()
                    .setCustomId('toggle_minecraft')
                    .setLabel('Minecraft')
                    .setStyle('Secondary')
                new ButtonBuilder()
                    .setCustomId('toggle_zula')
                    .setLabel('Zula')
                    .setStyle('Secondary')
            );
        
        await message.channel.send({ embeds: [embed], components: [row] });
    }
};
