var db = require("mongous").Mongous;


db('db.heros').find(function(r) {
	var data = r.documents;
	console.log(data[0]);
});
console.log("hello")