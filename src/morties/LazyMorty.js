class LazyMorty {
    constructor(numBoxes) {
        this.numBoxes = numBoxes;
    }

    leaveBoxes(rickGuess, portalBox) {
        const boxes = [...Array(this.numBoxes).keys()];
        const remaining = boxes.filter(b => b === portalBox || b === Math.min(...boxes.filter(x => x !== portalBox)));
        return remaining;
    }

    probabilitySwitch() {
        return 0.5;
    }

    probabilityStay() {
        return 1 / this.numBoxes;
    }
}

module.exports = { LazyMorty };
