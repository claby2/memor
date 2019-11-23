let authorInput = document.getElementById("authorinput");
let subjectInput = document.getElementById("subjectinput");
let bodyInput = document.getElementById("bodyinput");
let tagsInput = document.getElementById("tagsinput");

let uploadButton = document.getElementById("uploadbutton");

let resultNotes = document.getElementById("resultnotes");

tagArr = [];

uploadButton.addEventListener("click", ()=>{
    tagArr = tagsInput.split(",");

    jsonString = JSON.stringify({ 
        author : authorInput.value,
        subject : subjectInput.value,
        body : bodyInput.value,
        tags : tagArr
    })
    
    fetch('localhost:3000/api/submit', {
        method: "POST",
        body: jsonString
    })
})

function getResponse(){
    return fetch('localhost:3000/api/top5?pid=' + pid)
    .then(res=>res.json())
    .then(info=>{
        let noteDiv = document.createElement('div');

        let subjectEl = document.createElement('h3');
        let authorEl = document.createElement('h2');
        let bodyEl = document.createElement('p');
        let tagEl = document.createElement('p');

        subjectEl.innerText = info.subject;
        authorEl.innerText = info.author;
        bodyEl.innerText = info.body;
        tagEl.innerText = info.tags;

        noteDiv.appendChild(subjectEl);
        noteDiv.appendChild(authorEl);
        noteDiv.appendChild(bodyEl);
        noteDiv.appendChild(tagEl);
    })
}