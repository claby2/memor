let textInput = document.getElementById("textinput");
let studyButton = document.getElementById("studybutton");

let resultDiv = document.getElementById("resultdiv");

let init = false;

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
    
        arr = text.split(" ");

        for(let i = 0; i < arr.length; i++){
            val.push(i);
        }

        shuffleArray(val);
    
        blankWords = [];
        k = 1;

        for(let i = 0; i < k; i++){
            blankWords.push(arr[val[0]]);
            arr.splice(val[0], 1, "_____");
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
            arr.splice(val[0], 1, "_____");
            val.shift();
        }
    
        let paragraph = document.createElement("p");
        paragraph.innerText = arr.join(" ");
    
        resultDiv.appendChild(paragraph);

    }
});
