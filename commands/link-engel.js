const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../config.json');
const config = require(configPath);

module.exports = {
    name: 'link-engel',
    description: 'Link engelleme yönetimi.',
    async execute(message, args) {
        
        if (!message.member.roles.cache.has(config.slashRoleId)) {
            return message.reply('Bu komutu kullanmak için gerekli izniniz yok.');
        }

        if (args.length === 0) {
            return message.reply('Lütfen bir alt komut belirtin: `aç` veya `kapat`.');
        }

        const subCommand = args[0];
        let configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

        if (subCommand === 'aç') {
            configData.linkEngel = true;
            fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
            message.reply('Link engelleme açık hale getirildi.');
        } else if (subCommand === 'kapat') {
            configData.linkEngel = false;
            fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
            message.reply('Link engelleme kapatıldı.');
        } else {
            message.reply('Geçersiz alt komut! Kullanabileceğiniz alt komutlar: `aç`, `kapat`.');
        }
    }
};