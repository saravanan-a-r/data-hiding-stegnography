class KeyGen {

    constructor() {
        this.key1 = [];
        this.key2 = [];
    }

    generateKeys() {
        this.generateKey1();
        this.generateKey2();
        this.key1 = [1, 0, 1, 0, 1, 0, 1, 0, 0, 1];
        this.key2 = this.generateKey2();
        return this;
    }

    /* ---
        Key1 Generation algorithm.
        We know that there should be an equal number of 1's and 0's in Key1.
        1) Get a random number between 16 and 52.
            Let say the random number is 'n'
        2) Create an array and push a random number in [0, 1] for the 'n' number of times.
        3) Analyse the array and calculate 0's count and 1's count.
        4) If 0's count is less than 1's count, append 0 to make them equal.
        5) If 1's count is less than 0's count, append 1 to make them equal.

        So, the final array has a length between n and 2n
    --- */
    generateKey1() {
        let keyLen = this.getRandomKey1Len();
        let key1 = this.key1;
        let oneCount = 0;
        let zeroCount = 0;
        
        for(let i = 0; i<keyLen; i++) {
            let binary = this.getRandomBinary();
            binary ? oneCount++ : zeroCount++;
            key1.push(binary);
        }

        let bCount = 0, b;
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
    }
    
    generateKey2() {
        return [3, 1, 0, 4, 2, 1, 3, 6];
    }

    getRandomBinary() {
        let min = 0; //inclusive
        let max = 2; //exclusive
        return Math.floor(Math.random() * (max - min) + min);
    }

    getRandomKey1Len() {
        let min = 16;
        let max = 56;
        let len = Math.floor(Math.random() * (max - min) + min);
        if(len%2) {
            len++;
        }
        return len;
    }
}

module.exports = KeyGen;