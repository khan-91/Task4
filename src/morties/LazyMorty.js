class LazyMorty {
    constructor(numBoxes) {
        this.numBoxes = numBoxes;
    }

    leaveBoxes(rickGuess, portalBox) {
        const boxes = [...Array(this.numBoxes).keys()];

        if (rickGuess === portalBox) {
            // Rick guess right
            const removable = boxes.filter(b => b !== rickGuess);
            const removedBox = Math.min(...removable);
            const remaining = boxes.filter(b => b !== removedBox);
            this.lastRemovedBox = removedBox; 
            return remaining;
        } else {
            // Rick guess wrong
            const removable = boxes.filter(b => b !== portalBox && b !== rickGuess);
            const removedBox = Math.min(...removable);
            const remaining = boxes.filter(b => b !== removedBox);
            this.lastRemovedBox = removedBox; 
            return remaining;
        }
    }

    probabilitySwitch() {
        return (this.numBoxes - 1) / this.numBoxes;
    }

    probabilityStay() {
        return 1 / this.numBoxes;
    }
}

module.exports = { LazyMorty };
