const crypto = require('crypto');

class RandomKeyManager {
    static generateKey() {
        // 256-bit key
        return crypto.randomBytes(32).toString('hex');
    }
}

module.exports = RandomKeyManager;
