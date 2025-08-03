🧨 Minesweeper Game

A modern Minesweeper game built with HTML5 Canvas, JavaScript, and Node.js (Express + SQLite). It features responsive design, a leaderboard system, and a safe first click — all designed for a smooth and fair gaming experience.

🎮 Features

  ✅ Safe First Click
  Mines are only generated after the first click, ensuring you never lose immediately.
  
  ⏱ Real-Time Timer
  Timer starts on your first click and stops when you win or lose.
  Time is recorded in HH:MM:SS format.
  
  🏆 Leaderboard (per difficulty)
  Top 10 fastest times saved per difficulty level (easy, medium, hard).
  Players can submit their name when they make it to the top 10.
  
  🚩 Flag Counter
  Displays remaining flags (equal to number of mines).
  Flags can be toggled via right-click.
  
  🎨 Responsive UI
  Canvas resizes dynamically to fit the window.
  Grid and UI elements are auto-centered.
  
  💥 Game Over + Replay Options
  Polished game over dialog with animations.
  Option to play again or return to the main menu.

⚙️ Local Setup

1. Clone the Repository
git clone https://github.com/SATWIK7770/minesweeper.git
cd minesweeper

2. Install Dependencies
Make sure you have Node.js installed, then run:
npm install express better-sqlite3

3. Initialize the Database
Run the provided setup script to automatically create the leaderboard.db and its table:
node private/setup.js
You should see:
Leaderboard table created.
This will create a db/leaderboard.db SQLite file (if it doesn’t already exist) and set up the necessary schema.

4. Start the Server
node private/server.js
Visit the game in your browser at:
👉 http://localhost:8010

🕹 Play the Game

Choose a difficulty level (Easy, Medium, Hard)

Click to reveal cells and avoid the mines

Use right-click to flag suspected mines

Win by clearing all non-mine cells

Submit your name if you make it to the Top 10

📁 Project Structure

├── db/
│   └── leaderboard.db         # SQLite database file (generated)
├── public/
│   ├── index.html             # Landing page
│   ├── game.html              # Game screen
│   └── script.js              # Game logic
├── server/
│   ├── server.js              # Express backend
│   └── setup.js               # Database initializer script
└── README.md

🧪 Tech Stack

Frontend: Vanilla JavaScript, HTML5 Canvas

Backend: Node.js + Express

Database: SQLite (better-sqlite3)

🔮 Potential Enhancements

Mobile/touch support

Keyboard accessibility

Dark mode or theme selector

Sound effects


