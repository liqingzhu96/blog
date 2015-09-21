var jade=require('jade');
var url=require('url');
/*打开数据库*/
var mongoose=require('mongoose');
var db=mongoose.createConnection('mongodb://127.0.0.1:27017/blog');
db.on('error',function(err){
	console.log("DB ERROR:"+err);
})
var articlesSchema=new mongoose.Schema({
	"title":String,
	"type":String,
	"content":String,
	"time":String
});
var articlesModel=db.model('articles',articlesSchema);
/*数据库打开结束*/

/*缓存*/
var DATA;
articlesModel.find({},"_id title type time content", {sort: {'_id':-1},limit:6},function(err,data){
			if(err){
				console.log("缓存ERROR:"+err);
			}else{
				DATA=data;
			}
		});
/*end*/
function index(req,res){
articlesModel.find({},"_id title type time content", {sort: {'_id':-1},limit:10},function(err,data){
			if(err){
				console.log(err);
				res.writeHead(502,{"content-type":"text/html"});
				res,write("502 服务器出错！");
				res.end();
			}else{
				res.writeHead(200,{"content-type":"text/html"});
				var html=jade.renderFile('../jade/index.jade',{'data':data});
				console.log("数据库中查询了数据："+data);
				res.write(html);
				res.end();
			}
		});
}
function blog(req,res){
	var id=url.parse(req.url,true).query['_id'];
		articlesModel.findOne({_id:id},"_id title type time content",function(err,data){
			if(err){
				console.log(err);
				res.writeHead(502,{"content-type":"text/html"});
				res,write("502 服务器出错！");
				res.end();
			}else{
				res.writeHead(200,{"content-type":"text/html"});
				var html=jade.renderFile('../jade/blog.jade',{'data':data,'DATA':DATA});
				console.log("数据库中查询了数据："+data);
				res.write(html);
				res.end();
			}
		});
}
exports.index=index;
exports.blog=blog;