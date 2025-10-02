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

        // --- 1st provably fair random ---
        const fairRandom1 = new FairRandom(this.numBoxes);
        console.log(`Morty: HMAC1=${fairRandom1.getHMAC()}`);
        const rickValue1 = await this.askRickNumber(
            `Morty: Rick, enter your number [0,${this.numBoxes}) so you don’t whine later that I cheated, alright?`,
            0, this.numBoxes
        );
        const portalBox = fairRandom1.computeFinalValue(rickValue1);
        const secret1 = fairRandom1.mortyValue;
        const key1 = fairRandom1.key.toString("hex");

        // --- Rick's initial guess ---
        const rickGuess = await this.askRickNumber(
            `Morty: Okay, okay, I hid the gun. What’s your guess [0,${this.numBoxes})?`,
            0, this.numBoxes
        );

        // --- Morty leaves boxes ---
        let remainingBoxes;
        let fairRandom2, rickValue2, mortyValue2;

        if (this.morty.constructor.name === "ClassicMorty") {
            // --- ClassicMorty 2nd provably fair random ---
            fairRandom2 = new FairRandom(this.numBoxes - 1); // Morty's secret value + HMAC
            mortyValue2 = fairRandom2.mortyValue;
            console.log(`Morty: HMAC2=${fairRandom2.getHMAC()}`);

            // Rick input for collaborative randomness
            rickValue2 = await this.askRickNumber(
                `Morty: Rick, enter your number [0,${this.numBoxes - 1}) for collaborative randomness:`,
                0, this.numBoxes - 1
            );

            // Call leaveBoxes with both values
            remainingBoxes = this.morty.leaveBoxes(rickGuess, portalBox, rickValue2, mortyValue2);

        } else {
            // LazyMorty logic unchanged
            remainingBoxes = this.morty.leaveBoxes(rickGuess, portalBox);
        }

        remainingBoxes.sort((a, b) => a - b); // ascending

        // Show remaining boxes to Rick
        const otherBox = remainingBoxes.find(b => b !== rickGuess);
        console.log(`Morty: I'm keeping the box you chose, I mean ${rickGuess}, and the box ${otherBox}`);

        // --- Choice to switch or stay ---
        console.log(`Morty: You can switch your box (enter 0), or, you know, stick with it (enter 1).`);
        const stayOrSwitch = await this.askRickNumber(
            `Morty: Enter 1 to stay with your guess or 0 to switch:`,
            0, 2
        );

        const finalChoice = stayOrSwitch === 0 ? otherBox : rickGuess;
        const win = finalChoice === portalBox;

        console.log(
            win
                ? "Morty: Aww man, you won, Rick. Haha!"
                : `Morty: Aww man, you lost! The portal gun was in box ${portalBox}.`
        );

        // Update stats
        this.stats.addResult(stayOrSwitch === 0, stayOrSwitch === 1, win);


        // --- Show fairness ---
        console.log(`Morty: 1st secret = ${secret1}, KEY1=${key1}`);
        console.log(`Morty: 1st fair number = (${rickValue1} + ${secret1}) % ${this.numBoxes} = ${portalBox}`);

        if (this.morty.constructor.name === "ClassicMorty") {
            const key2 = fairRandom2.key.toString("hex");
            console.log(`Morty: 2nd secret = ${mortyValue2}, KEY2=${key2}`);
            let display2;
            if (rickGuess === portalBox) {
                // Rick right guess
                display2 = (rickValue2 + mortyValue2) % remainingBoxes.length;
            } else {
                // Rick wrong guess
                display2 = remainingBoxes.indexOf(portalBox);
            }
            console.log(`Morty: 2nd fair number = (${rickValue2} + ${mortyValue2}) % ${remainingBoxes.length} = ${display2}`);
        }

        console.log(`Morty: So the portal gun ${win ? "is in your box!" : `stays in box ${portalBox}.`}`);

        // Ask to play again
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


