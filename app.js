var express = require('express')
var app = express()
var path = require("path");
var bodyParser=require('body-parser');
var request=require('request-promise');
var cheerio=require('cheerio');
var cheerio2=require('cheerio');
var tbscrape=require('table-scraper');

app.use(bodyParser.json());

app.get('/', function(req,res){
res.send("hello sucka world");
});

app.post('/pages',function(req,res){
    counter:Int32Array=0;
    var options={
        method:'GET',
        url:'http://theshownation.com/marketplace/search?&main_filter=MLB+Cards&min_price='+req.body.buy+'&max_price='+req.body.sell+'&series_id='+req.body.series
    }
    request(options).then(function(response){
        urls=Array();
        urls.length=0;
        var $=cheerio.load(response);
        //first scraping, count number of pages of results
        var two=$('div[class=moreLinks]').html();
        var $$=cheerio2.load(two);
        counter= $$('a').eq(-2).text();
        for(var i=1;i<=counter;i++){
            //customize url with i value
            url2='http://theshownation.com/marketplace/search?page='+i+'&main_filter=MLB+Cards&min_price='+req.body.buy+'&max_price='+req.body.sell+'&series_id='+req.body.series;
            urls.push(url2);
        }            
        res.send(urls);
    }).catch(function(err){
        console.log("error in getting pages: "+err);
    });
});


app.listen(3000,'localhost');
console.log("listening on port 3000");