let textInput = document.getElementById("textinput");
let studyButton = document.getElementById("studybutton");

let resultDiv = document.getElementById("resultdiv");

let init = false;

studyButton.addEventListener("click", ()=>{ //Button Clicked
    resultDiv.innerHTML = "";
    if(!init){
        let text = textInput.value;
    
        arr = text.split(" ");
    
        blankWords = [];
    
        k = 1;//Difficulty Modifier
    
        let n = Math.floor(Math.random()*arr.length);
        blankWords.push(arr[n]);
        arr.splice(n, 1, "_____");
    
        let paragraph = document.createElement("p");
        paragraph.innerText = arr.join(" ");
    
        resultDiv.appendChild(paragraph);
        init = true;
    } else if(init){

        k++;//Difficulty Modifier
    
        for(let i = 0; i < k; i++){
            let n = Math.floor(Math.random()*arr.length);
            if(arr[n] != "_____"){
                blankWords.push(arr[n]);
                arr.splice(n, 1, "_____");
            } else{
                i--;
            }
        }
    
        let paragraph = document.createElement("p");
        paragraph.innerText = arr.join(" ");
    
        resultDiv.appendChild(paragraph);

    }
});
