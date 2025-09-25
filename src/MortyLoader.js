class MortyLoader {
    static load(filePath, className) {
        const module = require(filePath);
        return module[className] || module;
    }
}

module.exports = MortyLoader;
