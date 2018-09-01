class KeyGen {

    constructor() {
        this.k1 = 0;
        this.k2 = 0;
        this.key1 = [0, 1, 1, 0, 1, 0];
        this.key2 = [3, 1, 0, 4, 2, 1, 3, 6];
        this.k1Len = this.key1.length;
        this.k2Len = this.key2.length;
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

module.exports = KeyGen;