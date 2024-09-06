const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: 'yardım',
    description: 'Yardım menüsünü gösterir.',
    async execute(message) {
        const embed = new EmbedBuilder()
            .setColor('#000000')
            .setTitle('Yardım Menüsü')
            .setDescription('Komut kategorilerini seçin.')
            .setTimestamp();

        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('eğlence')
                    .setLabel('Eğlence')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🎉'),
                new ButtonBuilder()
                    .setCustomId('yetkili')
                    .setLabel('Yetkili')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('🔒')
            );

        const sentMessage = await message.channel.send({ embeds: [embed], components: [buttonRow] });

        const filter = interaction => ['eğlence', 'yetkili'].includes(interaction.customId);
        const collector = sentMessage.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async interaction => {
            if (!interaction.isButton()) return;

            await interaction.deferUpdate();

            if (interaction.customId === 'eğlence') {
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

                await interaction.editReply({ embeds: [funEmbed], components: [] });
            }

            if (interaction.customId === 'yetkili') {
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

                await interaction.editReply({ embeds: [modEmbed], components: [] });
            }
        });

        collector.on('end', collected => {
            const disabledRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('eğlence')
                        .setLabel('Eğlence')
                        .setStyle(ButtonStyle.Success)
                        .setEmoji('🎉')
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('yetkili')
                        .setLabel('Yetkili')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒')
                        .setDisabled(true)
                );

            sentMessage.edit({ components: [disabledRow] });
        });
    },
};
