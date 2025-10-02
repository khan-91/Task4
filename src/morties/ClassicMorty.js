class ClassicMorty {
    constructor(numBoxes) {
        this.numBoxes = numBoxes;
        this.lastOtherBox = null; // Game.js-এ দেখানোর জন্য
    }

    /**
     * Decide which boxes remain after Morty "leaves" boxes
     * @param {number} rickGuess - Rick's initial guess
     * @param {number} portalBox - Box where the portal gun is hidden
     * @param {number} rickValue2 - Rick's input for collaborative randomness
     * @param {number} mortyValue2 - Morty's secret number from FairRandom
     * @returns {number[]} - Remaining boxes
     */
    leaveBoxes(rickGuess, portalBox, rickValue2, mortyValue2) {
        const boxes = [...Array(this.numBoxes).keys()];
        console.log(`boxes: ${boxes}`);
        let otherBox;

        if (rickGuess === portalBox) {
            // Rick ঠিক guess করলে: 2nd random number ব্যবহার করে অন্য box নির্বাচন
            const candidates = boxes.filter(b => b !== portalBox);
            const finalIndex = (rickValue2 + mortyValue2) % candidates.length;
            otherBox = candidates[finalIndex];
            console.log(`Candidates: ${candidates}`);
            console.log(`Final index: ${finalIndex}`);
            console.log(`OtherBox: ${otherBox}`);
        } else {
            // Rick ভুল guess করলে: portalBox + Rick's guessed box রাখা
            otherBox = rickGuess;
            console.log(`OtherBox: ${otherBox}`);
        }

        this.lastOtherBox = otherBox;
        return [portalBox, otherBox];
    }

    probabilitySwitch() {
        return (this.numBoxes - 1) / this.numBoxes; // theoretical
    }

    probabilityStay() {
        return 1 / this.numBoxes;
    }
}

module.exports = { ClassicMorty };
