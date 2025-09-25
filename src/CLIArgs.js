class CLIArgs {
    static parse(argv) {
        if (argv.length < 4) {
            console.error('Usage: node index.js <numBoxes> <MortyPath> <MortyClass>');
            process.exit(1);
        }

        const numBoxes = parseInt(argv[2]);
        const mortyPath = argv[3];
        const mortyClassName = argv[4];

        if (isNaN(numBoxes) || numBoxes < 2) {
            console.error('Number of boxes must be an integer greater than 1.');
            process.exit(1);
        }

        if (!mortyPath || !mortyClassName) {
            console.error('You must provide a Morty implementation path and class name.');
            process.exit(1);
        }

        return { numBoxes, mortyPath, mortyClassName };
    }
}

module.exports = CLIArgs;
