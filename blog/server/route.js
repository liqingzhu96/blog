var action=require('./action');
function route(pathname,req,res){
	var path=pathname.match(/\/(\w+)\//);
		var urlPath=pathname.replace(/\//,"").replace(/\//g,"_");
		if(urlPath===""){
			action['index'](req,res);
		}
		else{
			if(typeof action[urlPath]==="function"){
				action[urlPath](req,res);
			}
			else{
				res.writeHead(404,{"content-type":"text/html"});
				res.end('<h1>404 not found</h1>');
			}
		}
}
module.exports=route;