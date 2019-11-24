let express = require('express');
let bodyParser = require('body-parser');
let fs = require('fs');
let app = express();
let uuid = require('uuid/v4');
let logic = require('./logic.js');

app.use(express.json({ limit: "50mb" }));

let db = JSON.parse(fs.readFileSync('./database.json'));

//// exit handlers
//let handleExit = () => fs.writeFile('./database.json', JSON.stringify(db), (err, out) => process.exit());
//
//process.on('exit', handleExit);
//// C-c
//process.on('SIGINT', handleExit);


app.use(express.static('./../frontend'));

app.post('/api/submit', (req, res) => {
    let pid = uuid();
    let sim = req.body;
    logic.tokenize(sim.body).then(data => {
        sim.tokens = data;
        db[pid] = sim;
        res.send(pid.toString());
    }).catch(err => res.status(500).send(JSON.stringify({ error: err })));
});

app.get('/api/getTop5', (req, res) => {
    let { pid }  = req.query;
    console.log(req.query);
    console.log(pid, db[pid]);
    let result = Object.entries(db).filter(x => x[1].author != db[pid].author);
    result.sort((a, b) => logic.tokenCompare(db[pid].tokens, a[1].tokens) - logic.tokenCompare(db[pid].tokens, a[1].tokens));
    res.send(JSON.stringify(result.filter(x => logic.tokenCompare(db[pid].tokens, x[1].tokens) >= 10).slice(0,5)));
});

app.post('/api/ocr', (req, res) => {
    let encoded = req.body.pld;
    logic.ocr(encoded).then(data => res.send(JSON.stringify(data))).catch(err => res.status(500).send(JSON.stringify({ error: err })));
});

app.listen(3000);

