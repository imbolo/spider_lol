var $ = require('jquery'),
	http = require('http'),
	fs = require('fs'),
	lnet = require('./util/lnet.js'),
	db = require("mongous").Mongous,
	zb = require('./data/zbItems');

// getHerosAbilities();
getHeroList();	

//获取英雄列表页面
function getHeroList() {
	http.get("http://lol.duowan.com/hero/", function(res) {
		// console.log("Got response: " + res.statusCode);
		var pageData = "";
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			pageData += chunk;
		});
		//获取完毕，解析
		res.on('end', function(){
			//解析
			analysisHeroListPage(pageData);
		});
  	  	
	});
}
//解析英雄列表页面数据
function analysisHeroListPage(pageData) {
	var document = $(pageData);
	var champion_list = document.find("#champion_list li");
	var champion_tips = document.find('.champion_tooltip');
	for (var i=0, l=champion_list.length; i<l; i++) {
		var heroItem = $(champion_list[i]);
		var hero_name = heroItem.find(".champion_name").html().replace(" ", '');
		var hero = {
			id: l-i,
			name: hero_name,
			title: $(champion_tips).find('.champion_name:contains("'+hero_name+'")').next().html().replace(" ", ''),
			detail_url:  heroItem.find("a").attr('href').replace(" ", ''),
			icon: heroItem.find(".champion_icon").attr('src').replace(" ", '')
		};
		console.log("save hero --- "+ hero.name);
		db('db.heros').save(hero);
		// saveHeroListToFile(hero);
		(function(hero) {
			http.get(hero.detail_url, function(res) {
				// console.log("Got response: " + res.statusCode);
				var pageData = "";
				res.setEncoding('utf8');
				res.on('data', function (chunk) {
					pageData += chunk;
				});
				//获取完毕，解析
				res.on('end', function(){
					//解析
					// fs.writeFile('./tmp/'+hero.name+'.html', pageData);
					analysisHeroDetailPage(pageData, hero);
				});
  
			});
		})(hero);
		
	}
	
}
//解析英雄详细信息页面
function analysisHeroDetailPage(pageData, hero) {
	var document = $(pageData);
	//推荐加点和出装，数组，数据项可能不止一个
	//tab标题
	var howto_titles = document.find("#tab1 ul.J_nav li[record]");
	//多玩上copy下来改写的,获取攻略数据
	var titles = [];
	var player_skills = [];
	document.find('.summoner:contains("召唤师技能")').each(function() {
		var ps = [];
		$(this).find('h4').each(function() {
			ps.push($(this).html());
		});
		player_skills.push(ps);
	});
    howto_titles.each(function() {
        titles.push({
        	id: $(this).attr('record'),
			text: $(this).html(),
        });
    });
	
    var url = "http://db.duowan.com/lolcz/api/zq.php?callback=fun";
    var len = titles.length;
	//暂时设置为同步
	var gonglves = {
		hero_id: hero.id,
		hero_title: hero.title,
		hero_chName: null,
		hero_enName: null,
		contents : []
	};
	for (var i=0; i<len; i++) {
	    (function(i){
			lnet.get(url+"&id="+titles[i].id,
					function(data) {
						
						data = data.replace("fun", "");
			        	data = eval(data);
						
						var gonglve = {
							type_name: titles[i].text,
							skill: data.skill,
							player_skill: player_skills[i].join(","),
							pre_cz: null,
							mid_cz: null,
							end_cz: null,
							nf_cz: null
						};
						
						//存在前期出装，即有出装加点攻略数据
						if (!!data.pre_cz == true) {
							//前期出装
							var arr_cz = data.pre_cz.split(',');
							var cz_names = [];
							for (var j=0; j<arr_cz.length; j++) {
								cz_names.push( zb[ arr_cz[j] ].name );
							}
							gonglve.pre_cz = cz_names.join(',');
							//中期
							arr_cz = data.mid_cz.split(',');
							cz_names = [];
							for (var j=0; j<arr_cz.length; j++) {
								cz_names.push( zb[ arr_cz[j] ].name );
							}
							gonglve.mid_cz = cz_names.join(',');
							//顺丰后期
							arr_cz = data.end_cz.split(',');
							cz_names = [];
							for (var j=0; j<arr_cz.length; j++) {
								cz_names.push( zb[ arr_cz[j] ].name );
							}
							gonglve.end_cz = cz_names.join(',');
							//逆风后期
							arr_cz = data.nf_cz.split(',');
							cz_names = [];
							for (var j=0; j<arr_cz.length; j++) {
								cz_names.push( zb[ arr_cz[j] ].name );
							}
							gonglve.nf_cz = cz_names.join(',');
						}	
						
					
						
						console.log("-------")
						gonglves.contents.push(gonglve);
						if(i == len-1) {
							gonglves.hero_chName = data.ch_name;
							gonglves.hero_enName = data.en_name;
							console.log(gonglves);
							
							db('db.gonglves').save(gonglves);
						}
						// console.log(hero_title);
						// console.log( document.find('#hero-topic').find('.first-hd').find('h1').html() );
					}
			    );
	     })(i);
	}
   
	// console.log(gonglves);
}

function parseJSONStyle_Object(data) {
	// return eval()
}

//保存英雄列表数据到文件
function saveHeroListToFile(hero) {
	var data_line = 
		hero.id + " " +
		hero.title + " " +
		hero.name + " " +
		hero.detail_url + " " +
		hero.icon + "\n";
	
	fs.appendFile("hero_list.data", data_line, function (err) {
	  	if (err) throw err;
	});
}