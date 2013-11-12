var db = require("mongous").Mongous;


db('db.heros').find(160,function(r) {
        var heros = r.documents;
        heros.forEach(function(hero) {
                db('db.gonglves').find({hero_id:hero.id}, function(r){
                        if (r.documents.length == 0) {
                                console.log(hero.id + " " + hero.name);
                        }
                });
        });
});
console.log("hello")