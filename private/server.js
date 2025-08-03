const express = require("express");
const app = express();
const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, '../db/leaderboard.db'));

port = 8010;

app.use(express.json());
app.use("/" , express.static(path.join(__dirname, ".." , "public")));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.post('/submitTime', (req, res) => {
  const { name, level, time } = req.body;
  if (!name || !level || !time) return res.status(400).send("Missing fields");

  db.prepare(`INSERT INTO leaderboard (name, level, time) VALUES (?, ?, ?)`)
    .run(name, level, time);

  res.status(200).send("Score added");
});

app.get("/leaderboard", (req, res) => {
    const level = req.query.level;
    const stmt = db.prepare("SELECT name, time FROM leaderboard WHERE level = ? ORDER BY time ASC LIMIT 10");
    const results = stmt.all(level);
    res.json(results);
});

app.listen(port , () => {console.log("server is running")});
