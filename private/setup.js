const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, '../db/leaderboard.db'));

db.prepare(`
    CREATE TABLE IF NOT EXISTS leaderboard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        time INTEGER NOT NULL,
        level TEXT NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`).run();

console.log("Leaderboard table created.");
