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
* /heros
* */
route['/heros'] = function (req, res) {
	res.write(JSON.stringify(req.params));
	res.write("hello");
	res.end();
}