const KeyGen = require("./key-gen.js");

class KeyUtil {

    constructor() {
        this.k1 = 0;
        this.k2 = 0;

        this.key1 = []; //Equal no of 1's and 0's
        this.key2 = [];
    }

    setKeys(key1, key2) {
        this.k1 = 0;
        this.k2 = 0;
        this.key1 = key1;
        this.key2 = key2;
        return this;
    }

    getKey1() {
        var key1 = this.key1; //caching to minimize property access
        this.k1++;
        if(this.k1 >= key1.length) {
            this.k1 = 0;
        }
        return key1[this.k1];
    }

    getKey2() {
        var key2 = this.key2;
        this.k2++;
        if(this.k2 >= key2.length) {
            this.k2 = 0;
        }
        return key2[this.k2];
    }
}

// KeyUtil instance is in singleton design pattern
module.exports = new KeyUtil;