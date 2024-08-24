const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'patla',
  description: 'Sunucuyu patlat',
  async execute(message) {
    
    const countdownEmbed = new EmbedBuilder()
      .setColor('#FF0000') 
      .setTitle('Geri Sayım Başlıyor!')
      .setDescription('10\n9\n8\n7\n6\n5\n4\n3\n2\n1')
      .setTimestamp();

    
    const sentMessage = await message.channel.send({ embeds: [countdownEmbed] });

    
    for (let i = 10; i > 0; i--) {
      setTimeout(async () => {
        const updatedEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('Geri Sayım Başlıyor!')
          .setDescription(`${i}`)
          .setTimestamp();
        
        
        try {
          await sentMessage.edit({ embeds: [updatedEmbed] });
        } catch (error) {
          console.error('Mesaj güncellenirken bir hata oluştu:', error);
        }
      }, (10 - i) * 1000); 
    }

    
    setTimeout(async () => {
      const finalEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Patla!')
        .setDescription('Şuan patladı!')
        .setTimestamp();
      
      try {
        await sentMessage.edit({ embeds: [finalEmbed] });
        
        setTimeout(async () => {
          try {
            await sentMessage.delete();
          } catch (error) {
            console.error('Mesaj silinirken bir hata oluştu:', error);
          }
        }, 10000); 
      } catch (error) {
        console.error('Final mesajı güncellenirken bir hata oluştu:', error);
      }
    }, 10000); 
  },
};
