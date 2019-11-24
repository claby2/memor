let authorInput = document.getElementById("authorinput");
let subjectInput = document.getElementById("subjectinput");
let bodyInput = document.getElementById("bodyinput");
let tagsInput = document.getElementById("tagsinput");

let uploadButton = document.getElementById("uploadbutton");

let resultNotes = document.getElementById("resultnotes");

tagArr = [];

uploadButton.addEventListener("click", ()=>{
    tagArr = tagsInput.value.split(",");

    jsonString = JSON.stringify({ 
        author : authorInput.value,
        subject : subjectInput.value,
        body : console.log(bodyInput.value) || bodyInput.value,
        tags : tagArr
    })
    console.log(jsonString);
    
    fetch('http://localhost:3000/api/submit', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonString
    }).then(res => res.text()).then(p => !p.startsWith('{') ? getResponse(p) : console.log(p)).catch(p => console.log(p));
})

function getResponse(pid){
    return fetch('http://localhost:3000/api/getTop5?pid=' + pid)
    .then(res=>res.json())
    .then(data => data.forEach(x => {
        let info = x[1];
        let noteDiv = document.createElement('div');
        noteDiv.className = 'note';

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

        resultNotes.appendChild(noteDiv);

    })
    );
}
