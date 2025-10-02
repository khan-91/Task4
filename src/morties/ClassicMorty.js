class ClassicMorty {
    constructor(numBoxes) {
        this.numBoxes = numBoxes;
        this.lastOtherBox = null;
    }

    leaveBoxes(rickGuess, portalBox, rickValue2, mortyValue2) {
        const boxes = [...Array(this.numBoxes).keys()];
        let otherBox;

        if (rickGuess === portalBox) {
            // Rick right guess 
            const candidates = boxes.filter(b => b !== portalBox);
            const finalIndex = (rickValue2 + mortyValue2) % candidates.length;
            otherBox = candidates[finalIndex];
        } else {
            // Rick wrong guess 
            otherBox = rickGuess;
        }

        this.lastOtherBox = otherBox;
        return [portalBox, otherBox];
    }

    probabilitySwitch() {
        return (this.numBoxes - 1) / this.numBoxes;
    }

    probabilityStay() {
        return 1 / this.numBoxes;
    }
}

module.exports = { ClassicMorty };
