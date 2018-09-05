const Encode = require("./encode-stegno");
const KeyGen = require("./key-gen");
var keys = new KeyGen().generateKeys();

sendKeys();

// var secretPath = "secret.txt";
// var sourceImg = "image.png";
// var outputName = "output-image";
// var outputImage = "output.png";

// var encoderPromise = new Encode()
//     .setSourceImage(sourceImg)
//     .setSecretFile(secretPath)
//     .setOutputName(outputName)
//     .encode();


function sendKeys() {
    return new Promise( (resolve, reject) => {
        var formData = new FormData();
        var json = {
            key1 : keys.key1,
            key2 : keys.key2
        };
        formData.append("keys", JSON.stringify(json));
        networkRequest("POST", formData);
    });
}

function networkRequest(method, formData) {
    return new Promise( (resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open(method, "https://localhost:3000/key");
        xhr.send(formData);
        xhr.onload = function() {
            resolve(this.response);
        }
        xhr.onerror = function() {
            reject(this.error);
        }
    });
}
