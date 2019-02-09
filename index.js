const Encoder = require("./src/encoder/encode-stegno.js");
const Decoder = require("./src/decoder/decode-stegno.js");
const KeyGen = require("./src/key-generation/key-gen.js");
var keyGen = new KeyGen().generateKeys();

(async function test () {
    var secretPath = "./secret.txt";
    var sourceImg = "./image.png";
    var outputName = "output-image";
    var outputImage = "./output.png";

    var encoderPromise = new Encoder()
                            .setSourceImage(sourceImg)
                            .setSecretFile(secretPath)
                            .setOutputName(outputName)
                            .setKeys(keyGen.key1, keyGen.key2)
                            .encode();

    await encoderPromise;

    var decoderPromise = new Decoder()
                            .setSourceImage(outputImage)
                            .setKeys(keyGen.key1, keyGen.key2)
                            .decode()    
    await decoderPromise;
})();