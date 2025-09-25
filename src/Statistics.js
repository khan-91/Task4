const Table = require("cli-table3");

class Statistics {
    constructor() {
        this.switchedRounds = 0;
        this.stayedRounds = 0;
        this.switchedWins = 0;
        this.stayedWins = 0;
    }

    addResult(switched, stayed, win) {
        if (switched) {
            this.switchedRounds++;
            if (win) this.switchedWins++;
        } else if (stayed) {
            this.stayedRounds++;
            if (win) this.stayedWins++;
        }
    }

    print(morty) {
        const estimateSwitched = this.switchedRounds ? (this.switchedWins / this.switchedRounds).toFixed(3) : "0.000";
        const estimateStayed = this.stayedRounds ? (this.stayedWins / this.stayedRounds).toFixed(3) : "0.000";

        const exactSwitched = morty.probabilitySwitch().toFixed(3);
        const exactStayed = morty.probabilityStay().toFixed(3);

        const table = new Table({
            head: ["Game results", "Rick switched", "Rick stayed"]
        });

        table.push(
            ["Rounds", this.switchedRounds, this.stayedRounds],
            ["Wins", this.switchedWins, this.stayedWins],
            ["P (estimate)", estimateSwitched, estimateStayed],
            ["P (exact)", exactSwitched, exactStayed]
        );

        console.log("                  GAME STATS");
        console.log(table.toString());
    }
}

module.exports = Statistics;
