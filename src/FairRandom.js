const crypto = require("crypto");

class FairRandom {
    constructor(range) {
        this.range = range;
        this.key = crypto.randomBytes(32); // 256-bit key
        this.mortyValue = crypto.randomInt(0, range); // Morty's secret value
        this.hmac = crypto.createHmac("sha3-512", this.key)
            .update(Buffer.from([this.mortyValue]))
            .digest("hex");
    }

    getHMAC() {
        return this.hmac;
    }

    computeFinalValue(rickValue) {
        // Provably fair: (mortyValue + rickValue) % range
        return (this.mortyValue + rickValue) % this.range;
    }
}

module.exports = FairRandom;
