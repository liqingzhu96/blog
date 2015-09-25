var mongoose=require('mongoose');
var db=mongoose.createConnection('mongodb://127.0.0.1:27017/blog');
db.on('error',function(err){
	console.log("DB ERROR:"+err);
})
var articlesSchema=new mongoose.Schema({
	title:String,
	type:String,
	content:String,
	time:String
});
 var articlesModel=db.model('articles',articlesSchema);
	var articlesEntity=new articlesModel({
		"_id":"55fe8cf6ece7f6400ba04aac",
		"title":"xixixixiixixixi",
		"type":"心情笔记",
		"content":"FuckFuckFuckFuckFuckFuckFuckFuckFuckFuckFuckFuckFuckFuck",
		"time":"2015/9/26"
	});
	articlesEntity.save(function(err){
		if(err){
			console.log(err);

		}
		db.close();
	});

