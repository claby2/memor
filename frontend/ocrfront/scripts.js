let picInput = document.getElementById('pic-input');
let submit = document.getElementById('submit');
let output = document.getElementById('output');

let getBase64 = file => new Promise((res, rej) => {
    let reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => res(btoa(reader.result));
    reader.onerror = err => rej(err);
});

submit.addEventListener('click', () => {
    let file = picInput.files[0];
    getBase64(file).then(pld => {
        fetch('http://localhost:3000/api/ocr/', { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pld: pld })})
        .then(res => res.json()).then(data => {
            console.log(data);
            output.value = data[0].description;
        });
    });
});
