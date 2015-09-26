var jade=require('jade');
var message=require('./message');
var $get=message.$get;
var url=require('url');
var err=require('./err');
var send404=err.send404;
var send502=err.send502;
var querystring=require('querystring');
var Cookie=require('./Cookie');
var getCookie=Cookie.getCookie;
var checkCookie=Cookie.checkCookie;
var checkType=require('./type');
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
	"time":String,
	"date":String
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
function huancun(){
	articlesModel.find({},"_id title type time content", {sort: {'date':-1},limit:6},function(err,data){
		if(err){
			console.log("缓存ERROR:"+err);
		}else{
			DATA=data;
		}
	});
}
huancun();
/*end*/

/*博客全览*/
function index(req,res){
	var cookie=false;
	if(checkCookie(req)){
		cookie=true;
	}
	var page=$get(req)['page']||1;
articlesModel.count(function(err,count){
	if(err){console.log('数量查询出错！')}
	var articlesCount=parseInt(count/10)+1; 
	articlesCount<page?page=articlesCount:page=page;
	console.log("articlesCount:"+articlesCount);
	articlesModel.find({},"_id title type time content", {sort: {'date':-1},limit:page*10,skip:(page-1)*10},function(err,data){
			if(err){
				console.log(err);
				send502(res);
			}else{
				articlesData=data;
				res.writeHead(200,{"content-type":"text/html"});
				var html=jade.renderFile('../jade/index.jade',{'DATA':DATA,'data':articlesData,'count':articlesCount,'page':page,'cookie':cookie});
				console.log("数据库中的数据数量："+count);
				res.write(html);
				res.end();
			}
		});
	});

}
/*博客文章*/ 
function blog(req,res){
	var cookie=false;
	if(checkCookie(req)){
		cookie=true;
	}
	var id=$get(req)['_id'];
		articlesModel.findOne({_id:id},"_id title type time content",function(err,data){
			if(err){
				console.log(err);
				res.writeHead(502,{"content-type":"text/html"});
				res,write("502 服务器出错！");
				res.end();
			}else{
				console.log("数据库中查询了数据："+data);
				if(data)
				{	res.writeHead(200,{"content-type":"text/html"});
					var html=jade.renderFile('../jade/blog.jade',{'data':data,'DATA':DATA,'cookie':cookie});
					res.write(html);
					res.end();
				}
				else{
					send404(res);
				}
			}
		});
}
/*登陆*/

function admin(req,res){
	res.writeHead(200,{"content-type":"text/html"});
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
		if(post.username&&post.password){
			loginsModel.find(post,"-_id username password time",function(err,data){
				if(err){
					console.log('loginsModel find ERROR:'+err);
				}
				if(data.length==0){
					console.log("登陆失败！");
					res.write("<script>window.location='/admin'</script>");
				}
				else{
					console.log("登陆成功！");
					res.setHeader('Set-Cookie',"username="+data[0].username+";Max-Age=3600");
					res.write("<script>window.location='/index'</script>");
				}
			})
		}else{
			send404(res);
		}
	});

}
/**/
/*发博客*/
function xiugai(req,res){
	if(!checkCookie(req)){
		send404(res);
	}
	else{
	res.writeHead(200,{"content-type":"text/html"});
		var _id=$get(req)['_id'];
		articlesModel.findById(_id,function(err,data){
			var html=jade.renderFile('../jade/xiugai.jade',{'data':data});
			res.write(html);
			res.end();
		})
	}
}
function fabiao(req,res){
	if(!checkCookie(req)){
		send404(res);
	}
	else{
	res.writeHead(200,{"content-type":"text/html"});
	var html=jade.renderFile('../jade/fabiao.jade');
	res.write(html);
	res.end();
	}
}
function add(req,res){
	if(!checkCookie(req)){
		send404(res);
	}
	else{
	var post="";
	req.on('data',function(data){
		post+=data;
	});
	req.on('end',function(){
		post=querystring.parse(post);
		var d = new Date();
		post['time']=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
		post['date']=d.getTime();
		post['content']=post['content'].replace(/\r\n/g,'<br>');
		var fabiao=new articlesModel(post);
		fabiao.save(function(err){
			if(err){
				console.log("update ERROR:"+err);
				res.write("<script>alert('操作失败，请重试！');window.history.back(-1);</script>");
				res.end();
			}else{
				huancun();
				res.write("<script>alert('操作成功！');window.location='/index'</script>");
			}
		});

	});
	}
}
function update(req,res){
	if(!checkCookie(req)){
		send404(res);
	}
	else{
	var post="";
	var _id=$get(req)['_id'];
	req.on('data',function(data){
		post+=data;
	});
	req.on('end',function(){
		post=querystring.parse(post);
		var d = new Date();
		post['time']=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
		post['date']=d.getTime();
		post['content']=post['content'].replace(/\r\n/g,'<br>');
		var update={$set:post};
		articlesModel.update({'_id':_id},update,function(err){
			if(err){
				console.log("update ERROR:"+err);
				res.write("<script>alert('修改失败，请重试！');window.history.back(-1);</script>");
				res.end();
			}else{
				huancun();
				res.write("<script>alert('修改成功！');window.location='/index'</script>");
			}
		});
	});
	}
}
/**/
/*删除！*/
function remove(req,res){
	if(!checkCookie(req)){
		send404(res);
	}
	else{
	var _id=$get(req)['_id'];
	articlesModel.remove({'_id':_id},function(err){
		if(err){
			console.log("update ERROR:"+err);
			res.write("<script>alert('删除失败，请重试！');window.history.back(-1);</script>");
			res.end();
		}else{
			huancun();
			res.write("<script>alert('删除成功！');window.location='/index'</script>");
		}
	});
	}
}
/**/
/*分类*/
function type(req,res){
	var cookie=false;
	if(checkCookie(req)){
		cookie=true;
	}
	var get=$get(req);
	var type=get['type']||"学习日志";
	type=checkType(type);
	var page=get['page']||1;
articlesModel.count({'type':type},function(err,count){
	if(err){console.log('数量查询出错！')}
	var articlesCount=parseInt(count/10)+1; 
	articlesCount<page?page=articlesCount:page=page;
	console.log(count);
	articlesModel.find({'type':type},"_id title type time content", {sort: {'date':-1},limit:page*10,skip:(page-1)*10},function(err,data){
			if(err){
				console.log(err);
				send502(res);
			}else{
				articlesData=data;
				res.writeHead(200,{"content-type":"text/html"});
				var html=jade.renderFile('../jade/type.jade',{'DATA':DATA,'data':articlesData,'count':articlesCount,'page':page,'cookie':cookie,'type':type});
				console.log("数据库中的数据数量："+count);
				res.write(html);
				res.end();
			}
		});
	});
}
function unlogin(req,res){
	var cookie=getCookie(req);
	if(!cookie){
		send404(res);
	}else{
		res.setHeader('Set-Cookie',"username="+cookie.username+";Max-Age=0");
		res.write('<script>alert("已退出登录！");window.location="/index"</script>');
		res.end();
	}
}
exports.index=index;
exports.blog=blog;
exports.admin=admin;
exports.login=login;
exports.unlogin=unlogin;
exports.fabiao=fabiao;
exports.xiugai=xiugai;
exports.update=update;
exports.add=add;
exports.remove=remove;
exports.type=type;