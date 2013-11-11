var $ = require('jquery'),
	http = require('http'),
	fs = require('fs'),
	heroesAbilities = require('./data/heroesAbilities'),
	zb = require('./data/zbItems');
test();

function test() {
	$.get('http://www.baidu.com', function(data) {
		console.log(data);
	});
}