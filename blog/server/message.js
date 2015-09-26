var url=require('url');
function $get(req){
	return url.parse(req.url,true).query;
}
exports.$get=$get;