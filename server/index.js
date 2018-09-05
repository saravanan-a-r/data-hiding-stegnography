const express = require("express");
const app = express();

const Decoder = require("./decode-stegno");
const keyUtil = require("./key-util");

app.post("/key", (response, request) => {
    debugger;
    keyUtil.setKeys(key1, key2);
});

app.post("/image", (request, response) => {
    debugger;
    var decoderPromise = new Decoder()
        .setSourceImage("output.png")
        .decode();
});

app.listen(3000, (err) => {
    if(!err) {
        console.log("Server listening at 3000");
    }
});
