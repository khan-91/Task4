const readline = require("readline");
const FairRandom = require("./FairRandom");
const Statistics = require("./Statistics");

class Game {
    constructor(numBoxes, MortyClass) {
        this.numBoxes = numBoxes;
        this.morty = new MortyClass(numBoxes);
        this.stats = new Statistics();

        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    // Ask Rick for a number input
    async askRickNumber(prompt, min, max) {
        while (true) {
            console.log(prompt);
            process.stdout.write("Rick: ");
            const answer = await new Promise(resolve => this.rl.once("line", resolve));
            const value = parseInt(answer.trim(), 10);
            if (!isNaN(value) && value >= min && value < max) return value;
            console.log(`Morty: Oops, Rick, that’s not valid! Enter a number between ${min} and ${max - 1}.`);
        }
    }

    // Ask Rick for yes/no input
    async askRickYesNo(prompt) {
        while (true) {
            console.log(prompt);
            process.stdout.write("Rick: ");
            const answer = await new Promise(resolve => this.rl.once("line", resolve));
            const lower = answer.trim().toLowerCase();
            if (lower === "y" || lower === "n") return lower;
            console.log("Morty: Oops, Rick, that’s not valid! Enter y or n.");
        }
    }

    async playRound() {
        console.log(`\nMorty: Oh geez, Rick, I'm gonna hide your portal gun in one of the ${this.numBoxes} boxes, okay?`);

        // --- First Fair Random Protocol ---
        const fairRandom1 = new FairRandom(this.numBoxes);
        console.log(`Morty: HMAC1=${fairRandom1.getHMAC()}`);
        const rickValue1 = await this.askRickNumber(
            `Morty: Rick, enter your number [0,${this.numBoxes}) so you don’t whine later that I cheated, alright?`,
            0, this.numBoxes
        );

        const mortyValue1 = fairRandom1.mortyValue;
        const key1 = fairRandom1.key.toString("hex");
        const finalValue1 = fairRandom1.computeFinalValue(rickValue1);

        // --- Rick guesses the box ---
        const rickValue2 = await this.askRickNumber(
            `Morty: Okay, okay, I hid the gun. What’s your guess [0,${this.numBoxes})?`,
            0, this.numBoxes
        );

        // --- Second Fair Random Protocol ---
        const remainingBoxes = this.morty.leaveBoxes(rickValue2, finalValue1);
        const fairRandom2 = new FairRandom(remainingBoxes.length);
        console.log("Morty: Let’s, uh, generate another value now, I mean, to select a box to keep in the game.");
        console.log(`Morty: HMAC2=${fairRandom2.getHMAC()}`);
        const rickValue3 = await this.askRickNumber(
            `Morty: Rick, enter your number [0,${remainingBoxes.length}), and, uh, don’t say I didn’t play fair, okay?`,
            0, remainingBoxes.length
        );

        const mortyValue2 = fairRandom2.mortyValue;
        const key2 = fairRandom2.key.toString("hex");
        const finalValue2 = fairRandom2.computeFinalValue(rickValue3);

        console.log(`Morty: Aww man, my 1st random value is ${mortyValue1}.`);
        console.log(`Morty: KEY1=${key1}`);
        console.log(`Morty: So the 1st fair number is (${rickValue1} + ${mortyValue1}) % ${this.numBoxes} = ${finalValue1}.`);

        console.log(`Morty: Aww man, my 2nd random value is ${mortyValue2}.`);
        console.log(`Morty: KEY2=${key2}`);
        console.log(`Morty: Uh, okay, the 2nd fair number is (${rickValue3} + ${mortyValue2}) % ${remainingBoxes.length} = ${finalValue2}.`);

        console.log(`Morty: I'm keeping the box you chose, I mean ${rickValue2}, and the box ${remainingBoxes.find(b => b !== rickValue2)}.`);
        console.log("Morty: You can switch your box (enter 0), or, you know, stick with it (enter 1).");
        const stayOrSwitch = await this.askRickNumber("", 0, 2);

        let finalChoice = rickValue2;
        if (stayOrSwitch === 0) finalChoice = remainingBoxes.find(b => b !== rickValue2);

        const win = finalChoice === finalValue1;
        console.log(win ? "Morty: Aww man, you won, Rick. Haha!" : "Morty: Aww man, you lost, Rick. Now we gotta go on one of *my* adventures!");

        this.stats.addResult(stayOrSwitch === 0, stayOrSwitch === 1, win);

        const again = await this.askRickYesNo("Morty: D-do you wanna play another round (y/n)?");
        if (again === "y") {
            await this.playRound();
        } else {
            this.rl.close();
            console.log("Morty: Okay… uh, bye!");
            this.stats.print(this.morty);
        }
    }
}

module.exports = Game;


