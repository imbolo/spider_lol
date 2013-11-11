function Hero() {
	
}

module.exports = Hero;

Hero.prototype.save = function(hero, callback) {
	//打开
	mongodb.open(function(err, db) {
		if (err)
			return callback(err);
	});
	//读取
	mongodb.collection('heros', function(err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		//添加索引
		collection.ensureIndex('heroId', {unique: true});
		//插入文档
		collection.insert(hero, {safe: true}, function(err, hero) {
			mongodb.close();
			callback(err, hero);
		});
	});
}; 

