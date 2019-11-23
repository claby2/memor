require('dotenv').config({path: __dirname + '/.env'});
let AWS = require('aws-sdk');
let vision = require('@google-cloud/vision');
let vclient = new vision.ImageAnnotatorClient();
let comprehend = new AWS.Comprehend();
let fs = require('fs');


// shut up
let stopwords = ['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now'];

let stopRemove = str => str.split(/\s+/gm).filter(e => !stopwords.includes(e)).join(' ');


/*
 * Turns a note into a list of tokens.
 * @param first: The first piece of notes, in text.
 */
let tokens = (first) => {
    console.log(first, typeof first);
    if(typeof first !== 'string'){
        return Promise.reject("wrong data type");
    }
    /* Let's be real, the user's not putting in more than 25k words. */
    if(first.length / 5000 > 25){
        return Promise.reject("too long");
    }
    // First one.
    let params = {
        LanguageCode: "en", // English - for now
        //              Maximum length of each is 5000.               Gets 5000 characters _after_ i.
        TextList: Array(Math.ceil(first.length / 5000)).fill('').map((e, i) => first.substr(i, 5000))
    };
    return comprehend.batchDetectKeyPhrases(params).promise()
        .then(data => {
            if(data.ErrorList.length) return Promise.reject({ error: data.ErrorList.map(e => "Index " + e.Index + " suffered error " + e.ErrorCode + ":" + e.ErrorMessage ) });
            // Concats into a list of unique tokens.
            return [... new Set(data.ResultList.reduce((p, n) => p.concat(n.KeyPhrases.filter(x => x.Score >= 0.5).map(x => stopRemove(x.Text))), []))];
        });
};

/*
 * Compares two token lists.
 * @param user: USER tokens.
 * @param other: OTHER tokens.
 */
let tokenCompare = (user, other) => {
    // Find similar tokens.
    let sim = user.filter(e => other.includes(e));
    // The final value - percentage similarity ( multiplied by 100.)
    return Math.floor((100 * (sim.length))/(other.length));
};

/*
 * Returns the list of text objects in the encoded image.
 * @param encoded: a base64-encoded image.
 */
let ocr = encoded => {
    return vclient.annotateImage({ 
        image: { content: Buffer.from(encoded, 'base64') },
        features: [{ type: 'TEXT_DETECTION' }]
    }).then(obj => obj[0].textAnnotations);
};

module.exports = {
    tokenize: tokens,
    ocr: ocr,
    tokenCompare: tokenCompare
};

// test code
ocr(fs.readFileSync('./testimg.jpg').toString('base64'));
