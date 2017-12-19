var express=require('express');
var router=express.Router();
var request=require('request-promise');
var cheerio=require('cheerio');
var cheerio2=require('cheerio');
var cheerio3=require('cheerio');
var tbscrape=require('table-scraper');

router.post('/pages',function(req,res){
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

router.post('/read',function(req,res){
    var options={
        method:'GET',
        url:req.body.allurls
    }
    request(options).then(function(response){
        urls:Array();
        urls.length=0;
        var $=cheerio.load(response);
        var three=$('table[class=marketplace-search]').html();
        var $$=cheerio2.load(three);
        $$('a').each(function(i, elem){
        var ending=$$(this).attr('href');
        url3='http://theshownation.com'+ending;
        urls.push(url3);
        });
        res.send(urls);
    }).catch(function(err){
        console.log("error in getting player urls: "+err);
    });
});

router.post('/player', function(req,res){
    var options={
        method:'GET',
        url:req.body.urls
    }
    request(options).then(function(response){
        var $2=cheerio.load(response);
        var five=$2('h2').text();
        var six=five.split('\n');
        var name=six[3];
        var player={
                name:name,
                url:options.url
            };
        res.send(player);
    }).catch(function(err){
        console.log("error in getting player name: "+err);
    });
});

router.post('/prices', function(req,res){
    url3=req.body.url;
    tbscrape.get(url3).then(function(tableData) {
        var buy=tableData[1][0]['Buy Price'];
        var sell=tableData[2][0]['Sell Price'];
        buy=buy.replace(',','');
        sell=sell.replace(',','');
        var profit=parseInt(buy)-parseInt(sell);
        var player={
            name:req.body.name,
            url:req.body.url,
            buy:buy,
            sell:sell,
            profit:profit
        }
        res.send(player);
        }).catch(function(err){
            console.log("error in getting prices: "+err);
        });
});

module.exports=router;