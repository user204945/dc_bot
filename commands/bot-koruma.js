const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../config.json');
const config = require(configPath);

module.exports = {
  name: 'bot-koruma',
  description: 'Bot koruma sistemini açıp kapatın.',
  async execute(message, args) {
    
    if (!config.botProtection.authorizedUserIds.includes(message.author.id)) {
      return message.reply('Bu komutu kullanma izniniz yok!');
    }

    const status = args[0];

    if (status === 'aç') {
      config.botProtection.enabled = true;
      await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2));
      await message.reply('Bot koruma açıldı.');
    } else if (status === 'kapat') {
      config.botProtection.enabled = false;
      await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2));
      await message.reply('Bot koruma kapatıldı.');
    } else {
      await message.reply('Geçersiz seçenek. Kullanım: `.bot-koruma aç` veya `.bot-koruma kapat`');
    }
  },
};