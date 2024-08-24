const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '../esek.db');

const db = new sqlite3.Database(dbPath);

function getDatabase() {
    return db;
}

module.exports = {
    getDatabase
};