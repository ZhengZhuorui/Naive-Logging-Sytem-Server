var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var MongoCLient = require('mongodb').MongoClient;

var indexCalcByAverage = require('../public/javascripts/indexCalc.js');
var url = 'mongodb://localhost:27017/dashilan';
router.post('/:collectionName/:type/:year/:month',function (req,res) {
    var type = req.params.type;
    var collectionName = req.params.collectionName;
    var year = parseInt(req.params.year);
    var month = parseInt(req.params.month);
    var indexStat = {
        collectionName : collectionName,
        type : type,
        year : year,
        month : month
    };
    var nowYear = new Date().getFullYear();
    var nowMonth = new Date().getMonth();
    ++nowMonth;
    console.log(nowYear,nowMonth);
    if (type == "year" && year >= nowYear){
        res.send({ret:"时间未到"});
        return;
    }
    else if (type == "quarter" && (month-1)/4 >= (nowMonth-1)/4){
        res.send({ret:"时间未到"});
        return;
    }
    else if (type == "month" && month >= nowMonth){
        res.send({ret:"时间未到"});
        return ;
    }
    console.log("index calc ",collectionName,type,year,month);
    MongoCLient.connect(url, (err,db) =>{
        db.collection('index_stat').find(indexStat).toArray( (err,data) =>{
            if (data.length == 0) {
                indexCalcByAverage.indexCalcByAverage(collectionName, type, year, month).then((tmp) => {
                    res.send({ret: "已计算完成"});
                    db.collection('index_stat').insertOne(indexStat, (err, data) => {
                        console.log("UPDATE SUCCESS");
                    });
                });
            }
            else{
                res.send({ret: "已经计算过", number: data.length});
            }
        })
    });

});

module.exports = router;
