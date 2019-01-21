var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var fx = require('mkdir-recursive');
var MongoCLient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/dashilan'
router.post('/:colname',function (req,res) {
    var words = req.body;
    console.log(req.params.colname);
    console.log("form:",words);
    var collection_str = req.params.colname;
    MongoCLient.connect(url,function (err,db) {
        assert.equal(null, err);
        db.collection(collection_str).insertOne(words, function (err, res) {
            console.log("[REQUEST ERROR]"+err);
            assert.equal(null, err);
            db.close();
        });
    });
    res.send({ret_code: '0'});
});
module.exports = router;