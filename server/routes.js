/**
* 访问路径对应逻辑
* */
var url = require('url')
,	db = require("mongous").Mongous
,	zbItems = require('./data/zbItems')
,	heroSkills = require('./data/heroesAbilities');

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
    var result = [];
	db('db.heros').find({id: {$gt: 0}},{_id: 0, detail_url: 0}, function(r) {

        result = result.concat(r.documents);

        if (!r.more) {

            res.writeHeader(200, {'Content-Type':'text/javascript;charset=UTF-8'});
		    res.write(JSON.stringify(result));
            res.end();
        }
	});
}

/**
* /hero攻略
* 根据hero_title,hero_chName,hero_enName,hero_id查询
* */
route['/hero'] = function (req, res) {
	db('db.gonglves').find(req.params, {_id: 0},function(r) {
		var data = r.documents;
		
		res.writeHeader(200, {'Content-Type':'text/javascript;charset=UTF-8'});
		res.write(JSON.stringify(data));
		res.end();
	});
}

/**
* 
* 追加技能图标
* Q,E,W,E,E...
* @param strSkill
* */
function appendSkillIcon(hero_enName) {
	var skills = ["Q", "W", "E", "R"];
	var result = {};
	var skillName = "";
	for (var n in skills) {
		skillName = hero_enName+"_"+skills[n];
		result[ hero_enName+"_"+skills[n] ] = heroSkills[skillName];
	}
	return result;
}