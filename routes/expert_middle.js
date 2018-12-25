var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var fx = require('mkdir-recursive');

var MongoCLient = require('mongodb').MongoClient, assert = require('assert');

var url = 'mongodb://localhost:27017/dashilan'

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log("Home Page");
    res.render('index', {title: 'Express'});
});

router.post('/words', function (req, res, next) {
    var words = req.body;
    var xingming = req.body.xingming;
    var gongzuodanwei = req.body.gongzuodanwei;
    var organization = req.body.organization;
    var neirong = req.body.neirong;  
    var xuqiu = req.body.xuqiu;  
    var liucheng= req.body.liucheng;  
    var guocheng = req.body.guocheng;  
    var xiaoguo = req.body.xiaoguo;  
    var fugailv = req.body.fugailv; 
    var fengong = req.body.fengong;
    var tuanjie = req.body.tuanjie;
    var zijin = req.body.zijin;  
    var caiwu = req.body.caiwu;  
    var zizuzhi= req.body.zizuzhi;  
    var xiangmusheji = req.body.xiangmusheji;  
    var zijinshiyong = req.body.zijinshiyong;  
    var time = req.body.time; 
    var nickname = req.body.nickname;

    console.log("[REQUEST] "+req);

    //在mongodb中插入一条新记录
    MongoCLient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection("expert_middle").insertOne(words, function (err, res) {
            console.log("[REQUEST ERROR]"+err);
            assert.equal(null, err);
            db.close();
        });
    });

    res.send({ret_code: '0'});
});

module.exports = router;