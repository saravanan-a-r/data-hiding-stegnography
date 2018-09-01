const Encode = require("./encode-stegno");
const Decoder = require("./decode-stegno");

var secretPath = "secret.txt";
var sourceImg = "image.png";
var outputName = "output-image";
var outputImage = "output.png";

// var encoderPromise = new Encode()
//     .setSourceImage(sourceImg)
//     .setSecretFile(secretPath)
//     .setOutputName(outputName)
//     .encode();

var decoderPromise = new Decoder()
    .setSourceImage(outputImage)
    .decode();