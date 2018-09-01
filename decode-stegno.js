var KeyGen = require("./key-gen");
var SecretManager = require("./secret-manager");
const Jimp = require("jimp");

class DecodeStegno extends KeyGen {

    /* 
        @sourceImg -> image path on which we will hide secret data 
        @secretPath -> file system path to a file which contains secret data
    */
   constructor(sourceImg) {
        super();
        this.sourceImg = sourceImg;
    }

    setSourceImage(sourceImg) {
        this.sourceImg = sourceImg;
        return this;
    }

    decode() {
        return new Promise( async(resolve, reject) => {
            var sourceImg = this.sourceImg;
            var image = await Jimp.read(sourceImg);
            var img_data = image.bitmap.data;

            var sBitLen = this.getSecretLength(img_data);
            var i = 0, b = 32;
            var secretStr = "", byteBuffer = "";
            while(i < sBitLen) {
                byteBuffer = byteBuffer + this.processByte(img_data, b);
                if(byteBuffer.length === 8) {
                    secretStr = secretStr + String.fromCharCode(parseInt(byteBuffer, 2));
                    byteBuffer = "";
                }
                b++;
                i++;
            };  
            console.log("Your secret text : " + secretStr);
        });
    }

    getSecretLength(img_data) {
        var b = 0;
        var bitStr = "";
        while(b < 32) {
            bitStr = bitStr + this.processByte(img_data, b);
            b++;
        }
        return parseInt(bitStr, 2);
    }

    getColor(i) {
        return (i%4);
    }

    processByte(img_data, b) {
        var colorCode = this.getColor(b);
        var byte = img_data[b];
        var key1 = this.getKey1();
        var msb = this.getMSB(byte);
        var kr = (msb ^ key1);
        var bit = "";

        switch(colorCode) {

            //RED
            case 0:
                kr ? (bit = this.getBit(img_data[b+1])) : (bit = this.getBit(img_data[b+2]));
            break;

            //GREEN
            case 1: 
                kr ? (bit = this.getBit(img_data[b+1])) : (bit = this.getBit(img_data[b+2]));
            break;
            
            //BLUE
            case 2:
                kr ? (bit = this.getBit(img_data[b+1])) : (bit = this.getBit(img_data[b-2]));
            break;

            //ALPHA
            case 3:
                kr ? (bit = this.getBit(img_data[b-3])) : (bit = this.getBit(img_data[b-2]));
            break;
        }

        return bit;
    }

    getMSB(colorValue) {
        return ((colorValue >> 7) & 0x01);
    }

    getBit(byte) {
        var key2 = this.getKey2();
        return ((byte >> key2) & 0x01);
    }
}

module.exports = DecodeStegno;