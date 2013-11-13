/**
 * 访问路径对应逻辑
 * */
var
db = require("mongous").Mongous;


var result = [];
db('db.heros').find({},{},{lim: 5}, function(r) {
    console.log(Object.prototype.toString.call(r.documents));
//    result = result.concat(r.documents);
	console.log(!r.more);
	console.log(r.documents);
    if (!r.more) {

//        result.sort(function(a, b) {
//            return b.id - a.id;
//        });

		console.log("strange");
    }
});