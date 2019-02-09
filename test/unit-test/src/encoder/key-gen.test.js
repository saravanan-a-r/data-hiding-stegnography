const mocha = require("mocha");
const chai = require("chai");
const expect = chai.expect;
const KeyGen = require("../key-gen.js");

describe("key-gen.js", () => {
    context("generateKey1()", () => {
        it("Should produce equal number of 1's and 0's in this.key1", () => {
            let keyGen = new KeyGen();
            keyGen.generateKey1();
            let key1 = keyGen.key1;

            expect(key1).to.not.equal(null);
            expect(key1).to.exist;
            expect(key1.length).greaterThan(0);

            let keyLen = key1.length;
            let oneCount = 0;
            let zeroCount = 0;
            for(let i = 0; i<keyLen; i++) {
                if(key1[i]) {
                    oneCount++;
                }
                else {
                    zeroCount++;
                }
            }

            expect(oneCount).greaterThan(0);
            expect(zeroCount).greaterThan(0);
            expect(oneCount).to.be.equal(zeroCount);
        });
    });
});