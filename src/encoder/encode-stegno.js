const SecretManager = require("./secret-manager");
const Jimp = require("jimp");
const keyUtil = require("../key-generation/key-util");

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
        return this;
    }

    setSecretFile(secretPath) {
        this.secretPath = secretPath;
        return this;
    }

    setOutputName(outputName) {
        this.outputName = outputName;
        return this;
    }

    setKeys(key1, key2) {
        keyUtil.setKeys(key1, key2);
        return this;
    }

    encode() {
        return new Promise( async(resolve, reject) => {
            let sourceImg = this.sourceImg;
            let image = await Jimp.read(sourceImg);
            let width = image.bitmap.width;
            let height = image.bitmap.height;
            
            let new_img = image.clone(); 
            let img_data = new_img.bitmap.data;

            await this.secretReader();

            let sBitLen = this.sBitLen;

            if(!this.canFit(img_data.length, sBitLen)) {
                reject("Your secret file <" + this.secretPath + "> is too big to fit!!!");
                return;
            }

            let b = 0, i = 0;

            let bits = '';
            while(i < sBitLen) {
                let bit = this.getNextBit();
                bits = bits + bit;
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
        let colorCode = this.getColor(b);
        let byte = img_data[b];
        let key1 = keyUtil.getKey1();
        let msb = this.getMSB(byte);
        let kr = (msb ^ key1);

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
        let key2 = keyUtil.getKey2();
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