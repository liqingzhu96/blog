var jade=require('jade');
var url=require('url');
var querystring=require('querystring');
var getCookie=require('./getCookie');
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
var loginsSchema=new mongoose.Schema({
	"username":String,
	"password":String,
	"time":String
});
var articlesModel=db.model('articles',articlesSchema);
var loginsModel=db.model('login',loginsSchema);
console.log("数据调用1次！");
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

/*博客全览*/
function index(req,res){
var page=url.parse(req.url,true).query['page']||1;
articlesModel.count(function(err,count){
	if(err){console.log('数量查询出错！')}
	var articlesCount=parseInt(count/10)+1; 
	articlesCount<page?page=articlesCount:page=page;
	console.log("articlesCount:"+articlesCount);
	articlesModel.find({},"_id title type time content", {sort: {'_id':-1},limit:page*10,skip:(page-1)*10},function(err,data){
			if(err){
				console.log(err);
				res.writeHead(502,{"content-type":"text/html"});
				res,write("502 服务器出错！");
				res.end();
			}else{
				articlesData=data;
				res.writeHead(200,{"content-type":"text/html"});
				var html=jade.renderFile('../jade/index.jade',{'DATA':DATA,'data':articlesData,'count':articlesCount,'page':page});
				console.log("数据库中的数据数量："+count);
				res.write(html);
				res.end();
			}
		});
	});

}
/*博客文章*/ 
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
/*登陆*/

function admin(req,res){
	var html=jade.renderFile('../jade/admin.jade');
	res.write(html);
	res.end();
}

function login(req,res){
	var post="";
	req.on('data',function(data){
		post+=data;
	});
	req.on('end',function(){
		post=querystring.parse(post);
		loginsModel.find(post,"-_id username password time",function(err,data){
			if(err){
				console.log('loginsModel find ERROR:'+err);
			}
			if(data.length==0){
				console.log("登陆失败！");
				admin(req,res)
			}
			else{
				console.log("登陆成功！");
				res.setHeader('Set-Cookie',"username=liqingzhu;Max-Age=3600");
				index(req,res);
			}
		})
	});

}

exports.index=index;
exports.blog=blog;
exports.admin=admin;
exports.login=login;