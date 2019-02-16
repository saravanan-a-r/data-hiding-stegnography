const Jimp = require("jimp");
const keyUtil = require("../key-generation/key-util.js");

class DecodeStegno {

    /* 
        @sourceImg -> image path on which we will hide secret data 
    */
   constructor(sourceImg) {
        this.sourceImg = sourceImg;
    }

    setSourceImage(sourceImg) {
        this.sourceImg = sourceImg;
        return this;
    }

    setKeys(key1, key2) {
        keyUtil.setKeys(key1, key2);
        return this;
    }

    decode() {
        return new Promise( async(resolve, reject) => {
            let sourceImg = this.sourceImg;
            let image = await Jimp.read(sourceImg);
            let img_data = image.bitmap.data;

            let sBitLen = this.getSecretLength(img_data);
            let i = 0, b = 32;
            let secretStr = "", byteBuffer = "";
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
        let b = 0;
        let bitStr = "";
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
        let colorCode = this.getColor(b);
        let byte = img_data[b];
        let key1 = keyUtil.getKey1();
        let msb = this.getMSB(byte);
        let kr = (msb ^ key1);
        let bit = "";

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
        let key2 = keyUtil.getKey2();
        return ((byte >> key2) & 0x01);
    }
}

module.exports = DecodeStegno;