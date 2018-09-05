class KeyGen {

    constructor() {
        this.key1 = this.generateKey1();
        this.key2 = this.generateKey2();
    }

    generateKeys() {
        this.generateKey1();
        this.generateKey2();
        return this;
    }

    generateKey1() {
        var keyLen = this.getRandomKey1Len();
        var key1 = this.key1;
        var half = keyLen/2;
        var oneCount = 0;
        var zeroCount = 0;
        
        for(let i = 0; i<half; i++) {
            var binary = this.getRandomBinary();
            binary ? oneCount++ : zeroCount++;
            key1.push(binary);
        }

        var bCount = 0, b;
        if(oneCount < zeroCount) {
            bCount = zeroCount - oneCount;
            b = 1;
        }
        if(zeroCount < oneCount) {
            bCount = oneCount - zeroCount;
            b = 0;
        }
        for(let i = 0; i<bCount; i++) {
            key1.push(b);
        }

        for(let i = key1.length; i<keyLen; i+=2) {
            key1.push(0);
            key1.push(1);
        }
    }
    
    generateKey2() {
        return [3, 1, 0, 4, 2, 1, 3, 6];
    }

    getRandomBinary() {
        var min = 0; //inclusive
        var max = 2; //exclusive
        return Math.floor(Math.random() * (max - min) + min);
    }

    getRandomKey1Len() {
        var min = 16;
        var max = 56;
        var len = Math.floor(Math.random() * (max - min) + min);
        if(len%2) {
            len++;
        }
        return len;
    }
}

module.exports = KeyGen;