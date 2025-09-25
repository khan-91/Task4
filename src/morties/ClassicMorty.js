class ClassicMorty {
    constructor(numBoxes) {
        this.numBoxes = numBoxes;
    }

    leaveBoxes(rickGuess, portalBox) {
        // Keep the portal box and one other (simplest implementation)
        const boxes = [...Array(this.numBoxes).keys()];
        const remaining = boxes.filter(b => b === portalBox || b === rickGuess);
        return remaining;
    }

    probabilitySwitch() {
        return 0.5; // example probability
    }

    probabilityStay() {
        return 1 / this.numBoxes;
    }
}

module.exports = { ClassicMorty };
