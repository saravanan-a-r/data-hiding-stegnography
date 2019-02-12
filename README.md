# Randomised data hiding method

This project explores a method by which we can attain high randomisation of data hiding in an image.

1) Generate two keys, key1 and key2. 
2) Key1 is a circular 1D array in which only 0 or 1 value is allowed. It is also forced that number of zero's and one's in key1 should be equal.
3) Key2 is a 1D array with 8 digits. We can enter digits between 0 and 6. Repetition of digits is allowed but two consecutive digits can't be same.
4) Take an element from key1 and XOR with MSB of the RED pixel. If the XORed value is 0, choose the Green pixel, else the Blue pixel.
5) Now, Take an element from key2 which denotes the bit position. Store a bit in that bit position of the chosen pixel( either Green or Blue)
6) Continue 4 and 5 step for all the Color Pixel.

# API Documentation

This module built using Builder design pattern. For more information about the Builder design pattern, [click here](https://medium.com/@sararavi14/builder-design-pattern-in-node-js-c942ac7354a9)

### Encoder
    1) <encode_instance>.setSourceImage(<path to an image>)
   This method **setSourceImage()** will set an image that we are going to process.

    2) <encoder_instance>.setSecretFile(<path to the secret file>)
   This method **setSecretFile()** will set a file which contains secret data that we are going to hide in an image.
 

    3) <encoder_instance>.setOutputName(<string>)

This method **setOutputName()** denotes the stegno-image name.
    
   
    4) <encoder_instance>.setKeys(<key1,key2>)

This method **setKeys()** will set key1 and key2.


    
   
    5) <encoder_instance>.encode()

This method **encode()** will start hiding the given secret in the given image and return Promise object.

### Decoder

    1) <decoder_instance>.decode()

This method **decode()** will start extracting the hidden data from the given image.


### Key generation 

	 1) <key_gen_instance>.generateKeys()

This method **generateKeys()** will return an object with two params key1 and key2.

# Example

Using Builder design pattern,

	const Encoder = require("./src/encoder/encode-stegno.js");
	const Decoder = require("./src/decoder/decode-stegno.js");
	const KeyGen = require("./src/key-generation/key-gen.js");
	var keyGen = new KeyGen().generateKeys();
	var secretPath = "./secret.txt";
	var sourceImg = "./image.png";
	var outputName = "output-image";
	var outputImage = "./output.png";
	
	//Encoding part
	var encoderPromise = new Encoder()
						.setSourceImage(sourceImg)
						.setSecretFile(secretPath)
						.setOutputName(outputName)
						.setKeys(keyGen.key1, keyGen.key2)
						.encode();
	await encoderPromise;
	
	//Decoding part
	var decoderPromise = new Decoder()
						.setSourceImage(outputImage)
						.setKeys(keyGen.key1, keyGen.key2)
						.decode()
	await decoderPromise;
