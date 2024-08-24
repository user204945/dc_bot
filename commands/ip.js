const { EmbedBuilder } = require('discord.js');

function generateRandomIp() {
    
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
}

module.exports = {
    name: 'ip',
    description: 'Sahte bir IP adresi gösterir.',
    args: true,
    usage: '<kullanıcı>',
    async execute(message, args) {
        
        const user = message.mentions.members.first();
        if (!user) return message.reply('Bir kullanıcı belirtmelisiniz.');

        
        const fakeIp = generateRandomIp();

        
        const userTag = `<@${user.id}>`;

        
        const embed = new EmbedBuilder()
            .setColor('#000000') 
            .setTitle('Sahte IP Adresi')
            .setDescription(`🔍 ${userTag} için sahte IP adresi: ${fakeIp}`);

        
        message.reply({ embeds: [embed] });
    },
};