var $ = require('jquery'),
	fs = require('fs'),
	lnet = require('./util/lnet.js');
	
//获取英雄技能
function getHerosAbilities() {
	lnet.get("http://lolbox.duowan.com/js/heroesAbilities.js", function(pageData) {
		
		console.log("start write ./data/heroesAbilities.js");
		fs.writeFile("./data/heroesAbilities.js", pageData,function(err) {
			if (err)	throw err;
		});
		console.log("start append ./data/heroesAbilities.js");
		fs.appendFile("./data/heroesAbilities.js", "\nmodule.exports = heroesAbilities;", function(err) {
			if (err)	throw err;
		});
	});
}
//获取装备信息
function getZBItems() {
	lnet.get("http://lolbox.duowan.com/js/zbItems.js", function(pageData) {
		console.log("start write ./data/zbItems.js");
		fs.writeFile("./data/zbItems.js", pageData,function(err) {
			if (err)	throw err;
		});
		console.log("start append ./data/zbItems.js");
		fs.appendFile("./data/zbItems.js", "\nmodule.exports = ZBItems;", function(err) {
			if (err)	throw err;
		});
	});
}

// getHerosAbilities();
getZBItems();
// console.log(lnet['get']);