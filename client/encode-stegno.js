var SecretManager = require("./secret-manager");
const Jimp = require("jimp");
var keyUtil = require("./key-util");

class EncodeStegno extends SecretManager{
    
    /*
        @sourceImg -> image path on which we will hide secret data 
        @secretPath -> file system path to a file which contains secret data
    */
    constructor(sourceImg, secretPath) {
        super(sourceImg, secretPath);
        this.sourceImg = sourceImg;
        this.secretPath = secretPath;
    }

    //Object building function
    setSourceImage(sourceImg) {
        this.sourceImg = sourceImg;
        this.secretManager.sourceImg = sourceImg;
        return this;
    }

    setSecretFile(secretPath) {
        this.secretPath = secretPath;
        this.secretManager.secretPath = secretPath;
        return this;
    }

    setOutputName(outputName) {
        this.outputName = outputName;
        return this;
    }

    encode() {
        return new Promise( async(resolve, reject) => {
            var sourceImg = this.sourceImg;
            var image = await Jimp.read(sourceImg);
            var width = image.bitmap.width;
            var height = image.bitmap.height;
            
            var new_img = image.clone(); 
            var img_data = new_img.bitmap.data;

            await this.secretReader();

            var sBitLen = this.sBitLen;

            if(!this.canFit(img_data.length, sBitLen)) {
                reject("Your secret file <" + this.secretPath + "> is too big to fit!!!");
                return;
            }

            var b = 0, i = 0;

            while(i < sBitLen) {
                let bit = this.getNextBit();
                this.processByte(img_data, b, bit);
                b++;
                i++;
            }

            await new_img.writeAsync("output.png");
            resolve();
        });
    }

    canFit(ibyteLen, sBitLen) {
        return (ibyteLen >= sBitLen);
    }

    getColor(i) {
        return (i%4);
    }

    processByte(img_data, b, bit) {
        var colorCode = this.getColor(b);
        var byte = img_data[b];
        var key1 = keyUtil.getKey1();
        var msb = this.getMSB(byte);
        var kr = (msb ^ key1);

        switch(colorCode) {

            //RED
            case 0:
                kr ? (img_data[b+1] = this.storeBit(img_data[b+1], bit)) : (img_data[b+2] = this.storeBit(img_data[b+2], bit));
            break;

            //GREEN
            case 1: 
                kr ? (img_data[b+1] = this.storeBit(img_data[b+1], bit)) : (img_data[b+2] = this.storeBit(img_data[b+2], bit));
            break;
            
            //BLUE
            case 2:
                kr ? (img_data[b+1] = this.storeBit(img_data[b+1], bit)) : (img_data[b-2] = this.storeBit(img_data[b-2], bit));
            break;

            //ALPHA
            case 3:
                kr ? (img_data[b-3] = this.storeBit(img_data[b-3], bit)) : (img_data[b-2] = this.storeBit(img_data[b-2], bit));
            break;
        }
    }

    getMSB(colorValue) {
        return ((colorValue >> 7) & 0x01);
    }

    storeBit(byte, bit) {
        var key2 = keyUtil.getKey2();
        if(((byte >> key2) & 0x01) !== bit) {
            if(bit) {
                byte = (byte | (1 << key2));
            }
            else {
                byte = (byte & (~(1 << key2)));
            }
        }
        return byte;
    }
}

module.exports = EncodeStegno;