var action=require('./action');
var openFile=require('./openFile');
function route(pathname,req,res){
	var path=pathname.match(/\/(\w+)\//);
	if(path&&(path[1]=="css"||path[1]=="js"||path[1]=="image"||path[1]=="fonts")){
			openFile(pathname,res);
		}
	else
	{
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
}
module.exports=route;