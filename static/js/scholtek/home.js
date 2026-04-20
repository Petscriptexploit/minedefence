$(document).ready(function(){
	//Setup blocks to be clickable links
	$(".preview").each(function(i,val){
		$(val).click(function(){
			window.location = "/" + val.id;
		});
	});
});
