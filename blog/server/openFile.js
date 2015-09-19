var fs=require('fs');
function openFile(pathname,res){
	fs.readFile('../jade'+pathname,function(err,data){
		if(err){
			res.writeHead(404,{"content-type":"text/html"});
			res.end("<h1>404 Not Found</h1>");
			console.log("openFile ERROR:"+err);
		}
		else{
			res.writeHead(200);
			res.write(data);
			res.end();
		}
	});
}
module.exports=openFile;