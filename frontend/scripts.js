var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var speechWords = [];

let textInput = document.getElementById("textinput");
let studyButton = document.getElementById("studybutton");
let resultDiv = document.getElementById("resultdiv");
let recordButton = document.getElementById("recordbutton");

let init = false;

let isRecording = false;

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

studyButton.addEventListener("click", ()=>{ //Button Clicked
    resultDiv.innerHTML = "";
    if(!init){
        val = [];
        let text = textInput.value;
        textInput.value = "";
    
        arr = text.split(" ");

        speechWords = arr.slice()
            .reduce((p, n) => 
                p.concat(
                    n.replace(/[^\w\s]/gm, ' ')
                    .split(/\s+/gm)
                    .filter(e=>e)
                ), 
                []
            );
        var grammar = '#JSGF V1.0; grammar speechWords; public <word> = ' + speechWords.join(' | ') + ' ;';
        var recognition = new SpeechRecognition();
        var speechRecognitionList = new SpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1);

        recognition.grammars = speechRecognitionList;

        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        for(let i = 0; i < arr.length; i++){
            val.push(i);
        }

        shuffleArray(val);
    
        blankWords = [];
        k = 1;

        for(let i = 0; i < k; i++){
            blankWords.push(arr[val[0]]);
            arr.splice(val[0], 1, "█████");
            val.shift();
        }
    
        let paragraph = document.createElement("p");
        paragraph.innerText = arr.join(" ");
    
        resultDiv.appendChild(paragraph);
        init = true;
    } else if(init){

        k++;//Difficulty Modifier
    
        for(let i = 0; i < k; i++){
            blankWords.push(arr[val[0]]);
            arr.splice(val[0], 1, "█████");
            val.shift();
        }
    
        let paragraph = document.createElement("p");
        paragraph.innerText = arr.join(" ");
    
        resultDiv.appendChild(paragraph);

    }
});

var grammar = '#JSGF V1.0; grammar speechWords; public <word> = ' + speechWords.join(' | ') + ' ;';
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);

recognition.grammars = speechRecognitionList;

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recordButton.addEventListener("click", ()=>{
    if(init && !isRecording){
        isRecording = true;
        console.log("record");
        recognition.start();
    } else if(isRecording){
        console.log("record done")
        recognition.stop();
        isRecording = false;
    }
});

var speech = [];

recognition.onresult = function(event) {
    let result = event.results[event.resultIndex]
    if (result.isFinal) {
        speech = result[0].transcript;
        let speechSplit = [];
        let temp;
        for(let i = 0; i < speech.length; i++){
            if(speech[i] == " "){
                speechSplit.push(temp);
                temp = "";
            } else{
                temp = temp + speech[i];
            }
        }
        console.log(compare(speechSplit, speechWords) + "%");
    }

}

function compare(arr1, arr2) {
    let total = Math.max(arr1.length, arr2.length);
    let amount = 0;
    
    for(let i = 0; i < Math.min(arr1.length, arr2.length); i++){
        total = total + 1;
        if(arr1[i].toLowerCase() == arr2[i].toLowerCase()){
            amount = amount + 1;
        }

        console.log(arr1[i] + " " + arr2[i]);
    }

    return (amount/total)*100;
}