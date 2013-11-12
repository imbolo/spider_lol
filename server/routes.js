/**
* 访问路径对应逻辑
* */
var url = require('url')
,	db = require("mongous").Mongous;
var route = {};

module.exports = route;

/**
* /test
* */
route['/test'] = function (req, res) {
	res.write(JSON.stringify(req.params));
	res.write("hello");
	res.end();
}

/**
* /hero列表
* */
route['/hero/list'] = function (req, res) {
	db('db.heros').find(120,function(r) {
		var data = r.documents;
		res.writeHeader(200, {'Content-Type':'text/javascript;charset=UTF-8'});
		res.write(JSON.stringify(data));
		res.end();
	});
}

/**
* /hero攻略
* 根据hero_title,hero_chName,hero_enName,hero_id查询
* */
route['/hero'] = function (req, res) {
	db('db.gonglves').find(req.params,function(r) {
		var data = r.documents;
		res.writeHeader(200, {'Content-Type':'text/javascript;charset=UTF-8'});
		res.write(JSON.stringify(data));
		res.end();
	});
}