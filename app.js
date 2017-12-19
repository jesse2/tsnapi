var express = require('express')
var app = express()
var path = require("path");
var bodyParser=require('body-parser');

var port=3000;
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());

var tsn=require('./scraper/scrape');
app.use('/tsn',tsn);

app.get('/', (req,res)=>{
    res.send('Hello world');
});

app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname,'public/index.html'));
});


app.listen(port, ()=>{
    console.log('server started on port '+  port);
});