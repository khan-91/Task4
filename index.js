const path = require("path");
const Game = require("./src/Game");
const MortyLoader = require("./src/MortyLoader");

// Process command-line arguments
const args = process.argv.slice(2);

if (args.length < 3) {
    console.log("Usage: node index.js <numBoxes> <MortyPath> <MortyClass>");
    console.log("Example: node index.js 3 ./src/morties/ClassicMorty.js ClassicMorty");
    process.exit(1);
}

const numBoxes = parseInt(args[0], 10);
if (isNaN(numBoxes) || numBoxes < 3) {
    console.error("Error: <numBoxes> must be an integer >= 3");
    process.exit(1);
}

const mortyPath = path.resolve(args[1]);
const mortyClassName = args[2];

let MortyClass;
try {
    MortyClass = MortyLoader.load(mortyPath, mortyClassName);
} catch (err) {
    console.error("Error loading Morty class:", err.message);
    process.exit(1);
}

// Start the game
const game = new Game(numBoxes, MortyClass);
game.playRound();
