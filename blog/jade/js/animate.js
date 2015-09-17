$(function(){
	$('.wenzhang_type').bind('mouseover',function(){
		$(this).parent('.wenzhang_box_in').stop();
		$(this).parent('.wenzhang_box_in').animate({'left':'0'},300);

	})
	$('.wenzhang_type').bind('mouseout',function(){
		$(this).parent('.wenzhang_box_in').stop();
		$(this).parent('.wenzhang_box_in').animate({'left':'-240px'},300);
	})
});