require('dotenv').config({path: __dirname + '/.env'});
let AWS = require('aws-sdk');

let comprehend = new AWS.Comprehend();


// shut up
let stopwords = ['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now'];

let stopRemove = str => str.split(/\s+/gm).filter(e => !stopwords.includes(e)).join(' ');


/*
 * Returns a similarity "score", from 0 to 100.
 * @param first: The first piece of notes, in text.
 * @param second: The second notes, in text.
 * PLEASE NOTE THAT THIS FUNCTION WILL RETURN DIFFERENT RESULTS IF YOU PUT THE ARGUMENTS IN A DIFFERENT ORDER.
 * Put the user's thing in first.
 */
let textCompare = (first, second) => {
    if(typeof first !== 'string' || typeof second !== 'string'){
        return ({ error: "wrong data type" });
    }
    /* Let's be real, the user's not putting in more than 25k words. */
    if(first.length / 5000 > 25 || second.length / 5000 > 25){
        return ({ error: "too long" });
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
            return [... new Set(data.ResultList.reduce((p, n) => p.concat(n.KeyPhrases.filter(x => x.Score >= 0.5).map(x => x.Text)), []))];
        }).then(parsed => {
            // Second one.
            return comprehend.batchDetectKeyPhrases({
                LanguageCode: "en",
                TextList: Array(Math.ceil(second.length / 5000)).fill('').map((e, i) => second.substr(i, 5000))
            }).promise()
                .then(data => {
                    if(data.ErrorList.length) return Promise.reject({ error: dataErrorList.map(e => JSON.stringify(e)).join(',') });
                    // Unique tokens.
                    return [... new Set(data.ResultList.reduce((p, n) => p.concat(n.KeyPhrases.filter(x => x.Score >= 0.5).map(x => x.Text)), []))];
                }).then(secparsed => ({ first: parsed.map(e => stopRemove(e)), second: secparsed.map(e => stopRemove(e)) }));
        }).then(data => {
            // Find similar tokens.
            let sim = data.first.filter(e => data.second.includes(e));
            // The final value - percentage similarity ( multiplied by 100.)
            return { similarity: Math.floor((100 * (sim.length))/(data.second.length)) };
        });
};

let ocr = img => {
// TODO: Implement
};

module.exports = {
    compareNotes: textCompare,
    ocr: ocr
};

/* Test code */
textCompare(`p-adic numbers were first described by Kurt Hensel in 1897, though, with hindsight, some of Ernst Kummer's earlier work can be interpreted as implicitly using p-adic numbers. The p-adic numbers were motivated primarily by an attempt to bring the ideas and techniques of power series methods into number theory. Their influence now extends far beyond this. For example, the field of p-adic analysis essentially provides an alternative form of calculus.`,
`In mathematics, the p-adic number system for any prime number p extends the ordinary arithmetic of the rational numbers in a different way from the extension of the rational number system to the real and complex number systems. The extension is achieved by an alternative interpretation of the concept of "closeness" or absolute value. In particular, p-adic numbers are considered to be close when their difference is divisible by a high power of p: the higher the power, the closer they are. This property enables p-adic numbers to encode congruence information in a way that turns out to have powerful applications in number theory – including, for example, in the famous proof of Fermat's Last Theorem by Andrew Wiles.`).then(console.log);
