var type=['心情日志','学习日志','杂文'];
module.exports=function(str){
	for(i in type){
		if(str==type[i]){
			return str;
		}
	}
	return "学习日志";
}
