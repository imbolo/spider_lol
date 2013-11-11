var $ = require('jquery'),
	http = require('http'),
	fs = require('fs'),
	db = require("mongous").Mongous;

// getHerosAbilities();
getHeroList();	


//获取英雄列表页面
function getHeroList() {
	http.get("http://lol.duowan.com/hero/", function(res) {
		console.log("Got response: " + res.statusCode);
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
			console.log("Got response: " + res.statusCode);
			var pageData = "";
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				pageData += chunk;
			});
			//获取完毕，解析
			res.on('end', function(){
				//解析
				fs.writeFile('./tmp/'+hero.name+'.html', pageData);
				// analysisHeroDetailPage(pageData);
			});
  
		});
	}
	
}
//解析英雄详细信息页面
function analysisHeroDetailPage(pageData) {
	var document = $(pageData);
	//推荐加点和出装，数组，数据项可能不止一个
	//tab标题
	var howto_titles = document.find('.J_nav li');
	//detai部分，tab分页的内容
	var howto_detail = document.find('.mod-tab-content');
	var howto_skills = howto_detail.find('.skills');
		console.log( 
			document.find('dl').length
		);
		
	//指南数组
	var howto = {};
	//tab 分页标题
	for (var i=0, l=howto_titles.length; i<l; i++) {
		
		var detail = $(howto_detail[i]);
		
		var skill_use = $(howto_skills[i]).find('dl');
		// console.log(skill_use.length);
		var skill_group = {};
		//技能部分
		for (var j=0, jl=skill_use.length; j<jl; i++) {

			var skill_to_use = $(skill_use[j]);
			
			skill_group[j] = {};
			skill_group[j].title = skill_to_use.find('dt').html();
			
			skill_group[j].order = [];
			
			var skills_img = skill_to_use.find('dd img');
			for (var k=0, kl=skills_img.length; k<kl; j++) {
				skill_group[j].order.push(
					$(skills_img[k]).attr('skill')
				);
			}
			
			
		}
		// howto[i] = {
// 			title: skill_group[j].title,
// 			order: skill_group[j].order
// 		};
	}
	
	// console.log("-------");
	// console.log( document.find('#hero-topic').find('.first-hd').find('h1').html() );
	// console.log(howto);
	// console.log("-------");
	//英雄详细信息
	// var heroDetail = {
// 		intro: document.find('.hero-intro').find('.txt').find('p').html()
// 	}
	
	
	
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