//使用方法:将request对象传入，返回cookie的对象
function getCookie(req){
	var a=req.headers.cookie;
	if(a){
		arr=a.replace(/\s/g,"").split(";");
		var obj={};
		for(var i=0;i<arr.length;i++){
			var o=arr[i].split('=');
			obj[o[0]]=o[1];
		}
	}
	else{
		obj=null;
	}
	return obj;
}
function checkCookie(req){
	var cookie=getCookie(req);
	if (!cookie||cookie['username']!='liqingzhu') {//未找到
		return false;
	}
	else{
		return true;
	}
}
exports.getCookie=getCookie;
exports.checkCookie=checkCookie;