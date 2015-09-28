var get=get();
$(function(){
	console.log(111);
	var type=$('#wenzhang_type');
	var title=$('#wenzhang_title');
	var content=$('#wenzhang_content');
	var time=$('#wenzhang_time');

	$.post("/node/blog?_id="+get['_id'],{},function(data){
		var data=JSON.stringify(data);
		type.html(data.type);
		title.html(data.title);
		content.html(data.content);
		time.html(data.time);
	});
});