let textInput = document.getElementById("textinput");
let studyButton = document.getElementById("studybutton");

let resultDiv = document.getElementById("resultdiv");

studyButton.addEventListener("click", ()=>{ //Button Clicked
    let text = textInput.value;

    let arr = text.split(" ");

    let blankWords = [];

    let k = Math.ceil(arr.length/10);//Difficulty Modifier

    for(let i = 0; i < k; i++){
        let n = Math.floor(Math.random()*arr.length);
        blankWords.push(arr[n]);
        arr.splice(n, 1);
    }

    let paragraph = document.createElement("p");
    paragraph.innerText = arr.join(" ");

    resultDiv.appendChild(paragraph);




    // arr.forEach(e =>{
    //     if(k != 0){

            
    //         k--;
    //     }
        
    // });


})