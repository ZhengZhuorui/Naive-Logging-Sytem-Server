var getYearItem = function (year) {
    var lt = [];
    for (var i = 1;i <= 12;++i){
        for (var j = 1;j <= 31; ++j){
            var m = "";
            if (i < 10) m = "0";
            m += i.toString();
            var d = "";
            if (j < 10) d = "0";
            d += j.toString();
            var s = year.toString() + '-' + m + '-' + d;
            lt.push(s);
        }
    }
    //console.log(lt);
    return lt;
};
var getQuaterItem = function (year , quarter) {
    var lt = [];
    for (var i = (quarter - 1) * 4;i <= quarter * 4;++i){
        for (var j = 1;j <= 31; ++j){
            var m = "";
            if (i < 10) m = "0";
            m += i.toString();
            var d = "";
            if (j < 10) d = "0";
            d += j.toString();
            var s = year.toString() + '-' + m + '-' + d;
            lt.push(s);
        }
    }
    //console.log(lt);
    return lt;
};
var getMonthItem = function (year, month) {
    var lt = [];
    var m = "";
    if (month < 10) m = "0";
    m += month.toString();
    for (var j = 1;j <= 31; ++j){
        var d = "";
        if (j < 10) d = "0";
        d += j.toString();
        var s = year.toString() + '-' + m + '-' + d;
        lt.push(s);

    }
    //console.log(lt);
    return lt;
};

var getTypeItem = function (type,year,month) {
    if (type == "year") return getYearItem(year);
    else if (type == "quarter") return getQuaterItem(year,(month-1)/4+1);
    else return getMonthItem(year,month);
}

var getActivityQuery = function(type,year,month){
    var time_lt = getTypeItem(type,year,month);
    var ret = [];
    var p = [];
    for (var i = 0;i < time_lt.length; ++i) {
        p = [];
        for (var j = 0;j < 12; ++j) p.push({time:{$regex:"^"+((j<10)?' ':'')+j.toString()}});
        ret.push({date:time_lt[i],$or:p});

        p = [];
        for (var j = 12;j < 18; ++j) p.push({time:{$regex:"^"+((j<10)?' ':'')+j.toString()}});
        ret.push({date:time_lt[i],$or:p});

        p = [];
        for (var j = 18;j < 24; ++j) p.push({time:{$regex:"^"+((j<10)?' ':'')+j.toString()}});
        ret.push({date:time_lt[i],$or:p});
    }
    return ret;
};
//兼容以前
var calcMutualCommentOneBefore = function(res,key_lt,ans_dt){
    var org = res['organization'];
    var yorg = res['yourorganization'];
    var ans = 0;
    var cnt = 0;
    for (var i = 0;i < key_lt.length; ++i){
        if (key_lt[i] in res) {
            ans += res[key_lt[i]];
            ++cnt;
        }
    }
    if (cnt > 0) {
        ans /= cnt;
        if ((org in ans_dt) == false) ans_dt[org] = {};
        if ((yorg in ans_dt[org]) == false) ans_dt[org][yorg] = [];
        ans_dt[org][yorg].push(ans);
    }
    return ans_dt;
};

//当前版本
var calcMutualCommentOne = function(res, ans_dt){
    var org = res['organization'];
    var yorg = res['yourorganization'];
    var score = res['score'];
    if (score.length > 0) {
        var ans = 0;
        for (var i = 0; i < score.length; ++i) {
            ans += score[i];
        }
        ans /= score.length;
        if ((org in ans_dt) == false) ans_dt[org] = {};
        if ((yorg in ans_dt[org]) == false) ans_dt[org][yorg] = [];
        ans_dt[org][yorg].push(ans);
    }
    return ans_dt;
};

var calcOtherOneBefore = function(res,key_lt,ans_dt){
    var org = res['organization'];
    var ans = 0;
    var cnt = 0;
    for (var i = 0;i < key_lt.length; ++i){
        if (key_lt[i] in res) {
            //console.log(res[key_lt[i]]);
            ans += res[key_lt[i]];
            ++cnt;
        }
    }
    //console.log(ans,cnt);
    if (cnt > 0) {
        if (!(org in ans_dt)) ans_dt[org] = [];
        //console.log(cnt,ans);
        ans /= cnt;
        ans_dt[org].push(ans);
    }
    return ans_dt;
};
var calcOtherOne = function(res, ans_dt){
    var org = res['organization'];
    var score = res['score'];
    if (score.length > 0) {
        var ans = 0;
        for (var i = 0; i < score.length; ++i) {
            ans += score[i];
        }
        if (!(org in ans_dt)) ans_dt[org] = [];
        ans /= score.length;
        ans_dt[org].push(ans);
    }
    return ans_dt;
};

//getActivityQuery("month",2019,1);

module.exports={
    getYearItem : getYearItem,
    getQuarterItem : getQuaterItem,
    getMonthItem : getMonthItem,
    getTypeItem : getTypeItem,
    getActivityQuery : getActivityQuery,
    calcMutualCommentOneBefore : calcMutualCommentOneBefore,
    calcMutualCommentOne : calcMutualCommentOne,
    calcOtherOneBefore : calcOtherOneBefore,
    calcOtherOne : calcOtherOne

};