var http = require('http');
	
//获取英雄技能
exports.get = function(url, callback) {
	http.get(url, function(res) {
		// console.log("Got response: " + res.statusCode);
		var pageData = "";
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			pageData += chunk;
		});
		//获取完毕，解析
		res.on('end', function() {
			callback(pageData);
		});
	});
};

