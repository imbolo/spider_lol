var db = require("mongous").Mongous;


db('db.heros').find(120,function(r) {
	var data = r.documents;
	console.log( data.length );
});
console.log("hello")