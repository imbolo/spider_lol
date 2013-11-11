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
		// db('db.heros').save(hero);
		// saveHeroListToFile(hero);
		
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
				analysisHeroDetailPage(pageData);
			});
  
		});
	}
	
}
//解析英雄详细信息页面
function analysisHeroDetailPage(pageData) {
	var document = $(pageData);
	//推荐加点和出装，数组，数据项可能不止一个
	//tab标题
	var howto_titles = document.find("#tab1 ul.J_nav li[record]");
	//多玩上copy下来改写的,获取攻略数据
	var titles = [];
	
    howto_titles.each(function() {
        titles.push({
        	id: $(this).attr('record'),
			text: $(this).html()
        });
    });
	
    var url = "http://db.duowan.com/lolcz/api/zq.php?callback=fun";
    // var len = ids.length;
	//暂时设置为同步

	for (var i=0; i<len; i++) {
	    lnet.get(url+"&id="+titles[i].id,
			function(data) {
				console.log("-------")
				console.log( document.find('#hero-topic').find('.first-hd').find('h1').html() );
				data = data.replace("fun", "");
	        	data = eval(data);
				console.log(data.ch_name+" "+data.en_name);
				console.log(titles[i].text);
				// console.log( howto_titles.get(i).html() );
				console.log("加点次序:"+data.skill);
				
				//前期出装
				arr_pre_cz = data.pre_cz.split(',');
				var cz_names = [];
				for (var j=0; j<arr_pre_cz.length; j++) {
					cz_names.push( zb[ arr_pre_cz[j] ].name );
				}
				console.log("前期出装:"+cz_names.join(',') );
			}
	    );
	}
   
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