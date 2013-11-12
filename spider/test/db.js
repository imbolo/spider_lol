var db = require("mongous").Mongous;


db('db.heros').find(200,function(r) {
    var s = r.documents.length;
	console.log(JSON.stringify(s));
});
console.log("hello")