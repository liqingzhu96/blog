function get(){
	var getStr= window.location.href.replace(/(.+)\?/,"").split('&');
	var obj={};
	for(var i=0;i<getStr.length;i++){
		getStr[i]=getStr[i].split('=');
		if (getStr[i][0]!=""&&getStr[i][1]!="") {
			obj[getStr[i][0]]=getStr[i][1];
		};
	}
	return obj;
}