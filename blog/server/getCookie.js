//使用方法:将request对象传入，返回cookie的对象
function getCookie(req){
	var a=req.headers.cookie;
	arr=a.replace(/\s/g,"").split(";");
	var obj={};
	for(var i=0;i<arr.length;i++){
		var o=arr[i].split('=');
		obj[o[0]]=o[1];
	}
	return obj;
}
module.exports=getCookie;