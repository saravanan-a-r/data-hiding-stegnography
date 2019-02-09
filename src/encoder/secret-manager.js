const {createReadStream} = require("fs");

class SecretManager {
    
    constructor() {
        this.chunkBuffer = []; //Array of buffer array
        this.buffer = []; //A single buffer array
        this.byte = undefined; //A single byte
        this.pos = 7; //Bit position
        this.sBitLen = 0; //Length of the secret file in bit
    }

    secretReader() {
        return new Promise( (resolve, reject) => {
            var reader = createReadStream(this.secretPath);
            reader.on("data", (chunk) => {
                this.sBitLen = this.sBitLen + chunk.byteLength;
                this.chunkBuffer.push(chunk);
            });
            reader.on("end", () => {
                this.sBitLen = (this.sBitLen * 8);
                var sBitLen = this.sBitLen;
                var len = [(sBitLen >> 24) & 0x000000FF, (sBitLen >> 16) & 0x000000FF, (sBitLen >> 8) & 0x000000FF, sBitLen & 0x000000FF];
                this.chunkBuffer.unshift(len);
                this.sBitLen = this.sBitLen + 32;
                resolve();
            });
            reader.on("error", (err) => {
                reject(err);
            });
        });
    }

    getNextBit() {
        var byte = this.byte;
        if(typeof byte === "undefined") {
            byte = this.addByte();
            if(!byte && byte !== 0) {
                return null;
            }
        }

        var bit = ((byte >> this.pos--) & 0x01);
        if(this.pos < 0) {
            this.pos = 7;
            this.byte = undefined;
        }

        return bit;
    }

    addByte() {
        var buffer = this.buffer;
        if(!buffer.length) {
            buffer = this.addBuffer();
            if(!buffer) {
                return buffer;
            }
        }

        this.byte = buffer.shift();
        return this.byte;
    }

    addBuffer() {
        var chunkBuffer = this.chunkBuffer;
        if(!chunkBuffer.length) {
            return null;
        }
        this.buffer = this.toArray(chunkBuffer.shift());
        return this.buffer;
    }

    toArray(buffer) {
        var arr = [];
        var len = buffer.byteLength || buffer.length;
        for(let i = 0; i < len; i++) {
            arr[i] = buffer[i];
        }
        return arr;
    }
}

module.exports = SecretManager;