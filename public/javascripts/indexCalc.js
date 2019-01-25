var MongoCLient = require('mongodb').MongoClient;
var util = require('./util.js');
var assert = require('assert');
var fs = require('fs');
var url = 'mongodb://localhost:27017/dashilan';
var cnt = 0;

function calcOther(item,db,collectionName) {
    return new Promise( (resolve, reject) => {
        var query = {};
        if (item <= '2019-01-18') query = {time: {$regex: "^" + item}};
        else query = {loadtime: {$regex: "^" + item}};
        //console.log("query:",query);
        var ans = {};
        var ret = {};
        var key_lt = [];
        if (collectionName == 'expert_begin')key_lt = [" ", " ", " ", " ", " "];
        else if (collectionName == 'expert_middle') key_lt = ["neirong","xuqiu","liucheng","guocheng","xiaoguo","fugailv","fengong","tuanjie","zijin","caiwu",];
        else if (collectionName == 'expert_end') key_lt = ["q1","q2","q3","q4","q5","q6","q7","q8","q9","q10"];
        else if (collectionName == 'self_evaluation') key_lt = ["q1","q2","q3","q4","q5","q6","q7","q8"];
        else if (collectionName == 'serviceobject') key_lt = ['q1','q2','q3'];
        return new Promise((resolve1,reject1) => {db.collection(collectionName).find(query).toArray((err,res) => {resolve1(res);})})
            .then((res) =>{
                for (var i = 0; i < res.length; ++i) {
                    if (item <= "2019-01-18") {
                        ans = util.calcOtherOneBefore(res[i], key_lt, ans);
                    }
                    else {
                        ans = util.calcOtherOne(res[i], ans);
                    }
                }
                //console.log("query:",query);
                //console.log("ans:",ans);
                resolve(ans);
            });
    });
}
function calcMutualComment(item, db, collectionName){
    return new Promise( (resolve, reject) => {
        var query = {};
        if (item <= '2019-01-18') query = {time: {$regex: "^" + item}};
        else query = {loadtime: {$regex: "^" + item}};
        //query = item;
        //console.log("query:",query);
        var ans = {};
        var ret = {};
        var key_lt = [];
        if (collectionName == 'mutualcomment_begin')key_lt = ["fengong", "chongdie", "fuwu", "canyudu", "yusuan"];
        else if (collectionName == 'mutualcomment_middle') key_lt = ["neirong","liucheng","xiaoguo","fengong","zijin"];
        else  key_lt = ["q1","q2","q3","q4","q5"];
        return new Promise((resolve1,reject1) => {db.collection(collectionName).find(query).toArray((err,res) => {resolve1(res);})})
            .then((res) =>{
            for (var i = 0; i < res.length; ++i) {
                if (item <= "2019-01-18") {
                    ans = util.calcMutualCommentOneBefore(res[i], key_lt, ans);
                }
                else {
                    ans = util.calcMutualCommentOne(res[i], ans);
                }
            }
            //console.log("calc_ans:",ans);
            for (var org in ans) {
                var s = 0;
                var cnt = 0;
                for (var yorg in ans[org]) {
                    ++cnt;
                    var s1 = 0;
                    for (var i = 0; i < ans[org][yorg].length; ++i) s1 += ans[org][yorg][i];
                    s += s1 / ans[org][yorg].length;
                }
                ret[org] = s / cnt;
            }
            //console.log("calc_ret:",ret);
            resolve(ret);
        });
    });
}
function calcActivity(item, db, collectionName) {
    return new Promise( (resolve, reject) => {
        var query = {};
        //if (item <= '2019-01-18') query = {date: {$regex: "^" + item}};
        //else query = {loadtime: {$regex: "^" + item}};
        query = item;
        console.log("query:",query);
        var ans = {};
        var ret = {};
        return new Promise((resolve1,reject1) => {db.collection(collectionName).find(query).toArray((err,res) => {resolve1(res);})})
            .then((res) =>{
                for (var i = 0; i < res.length; ++i) {
                    if (!(res[i]['organization'] in ans)){
                        ans[res[i]['organization']] = 0;
                    }
                    ++ans[res[i]['organization']];
                }
                for (var it in ans){
                    if (ans[it] == 0) ret[it] = 0;
                    else if (ans [it] == 1) ret[it] = 1;
                    else if (ans[it] == 2) ret[it] = 2;
                    else if (ans[it] == 3) ret[it] = 3;
                    else if (ans[it] <= 5) ret[it] = 4;
                    else ret[it] = 5;
                }
                //console.log("calc_ret:",ret);
                resolve(ret);
            });
    });
}
function calcTypeByAverage(item,db,collectionName) {
    return new Promise( (resolve,reject) => {
        if (collectionName.indexOf("mutualcomment") != -1) {
            calcMutualComment(item, db, collectionName).then((ans) => {
                resolve(ans);
            })
        }
        else if (collectionName.indexOf('residence') != -1){
            calcActivity(item, db, 'residence').then((ans) =>{
                resolve(ans);
            })
        }
        else{
            calcOther(item, db, collectionName).then((ans) => {
                resolve(ans);
            })
        }
    });
}
var indexCalcByAverage = function (collectionName,type,year,month) {
    var timeStr = new Date().toLocaleString();
    console.log("TIME",timeStr);
    console.log("MODULE indexCalcByAverage BEGIN.");

    var time_lt = [];
    if (collectionName.indexOf('residence')!= -1) time_lt = util.getActivityQuery(type,year,month);
    else time_lt = util.getTypeItem(type,year,month);
    var ret = {};
    return new Promise((resolve,reject) => {MongoCLient.connect(url, (err, db) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(db);
        })})
        .then((db) => {
            return new Promise((resolve, reject) => {
                Promise.all(time_lt.map((i) => calcTypeByAverage(i, db, collectionName)))
                    .then((res) => {
                        console.log("all:", res);
                        var ans = {};
                        for (var i = 0; i < res.length; ++i) {
                            console.log("res:",res[i]);
                            for (var j in res[i]) {
                                if (!(j in ans)) ans[j] = [];
                                ans[j].push(res[i][j]);
                            }
                        }
                        var ret = {};
                        for (var org in ans) {

                            var s = 0;
                            for (var i = 0; i < ans[org].length; ++i) {
                                console.log(ans[org][i],typeof(ans[org][i]));
                                s += parseFloat(ans[org][i]);
                            }
                            console.log("s:",s);
                            ret[org] = {
                                score : s / ans[org].length,
                                count : ans[org].length
                            }
                        }
                        resolve([db, ret]);
                    });
            });
        })
        .then((R) => {
            return new Promise((resolve, reject) => {
                var db = R[0];
                var res = R[1];
                var ret = [];
                for (var i in res)
                    ret.push({
                        organization: i,
                        score: res[i]['score'],
                        count: res[i]['count'],
                        type: type,
                        year: year,
                        month: month,
                        mode: 'average'
                    });
                console.log(ret);
                if (ret.length > 0)
                    db.collection(collectionName + "_index").insertMany(ret, (err, data) => {
                        if (err) console.log(err);
                        resolve(0);
                    });
                else resolve(0);
                console.log("MODULE indexCalcByAverage END.");
            });
        });
};
module.exports={
    indexCalcByAverage : indexCalcByAverage
};