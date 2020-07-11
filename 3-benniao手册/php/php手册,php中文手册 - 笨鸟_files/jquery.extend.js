(function($){
	
	$.fn.extend({
		/**
		 * Add notice effect for input element
		 */
		addNotice: function(color){
			return this.each(function(){
				var notice = $(this).attr('notice');
				if (notice == '') return;

				var orgColor = $(this).attr('color');
				if (typeof(orgColor) !== 'string') orgColor = '';
	
				$(this)
					.focus(function(){
						if ($(this).val() == notice) {
							$(this).val('');
							$(this).css('color', orgColor);
						}
					})
					.keyup(function(){
						if ($(this).val() == '' || $(this).val() == notice) {
							//$(this).val(notice);
							//$(this).css('color', color);
							window.parent.left.location.href="left.html";
						}
					});
			});
		},
		
		cleanNoticeText: function(){
			return this.each(function(){
				if ($(this).val() == $(this).attr('notice'))
					$(this).val('');
			});
		},
		
		search: function(htmlid){
			this.each(function(){
				$("#"+htmlid).cleanNoticeText();
				value = $.trim($("#"+htmlid).val());
				if(value.length > 1){
					$.ajax({
						url: "../"+$("#"+htmlid).attr("info")+".php",
						type: "post",
						dataType: "json",
						cache :true,
						data:"value="+value, 
						success: function(response) {
							  
							 if(response == ""){
							 	html = "sorry,don`t find";
							 }else{
								 img="<img src='../loadingL.gif'>";
								 $("#"+$("#"+htmlid).attr("info")).html(img);
								 html = "";
								for(i in response){
									if($("#"+htmlid).attr("info") == "smarty"){
										
										html += "<dt><a href="+response[i]+">"+i+"</a></dt>";
									}else{
										if($("#"+htmlid).attr("info") == "jquery"){
											html += '<div class="dTreeNode"><img alt="" src="img/join.gif"><img alt="" src="img/page.gif" ><a href="'+response[i]+'" target="body" class="node" >'+i+'</a></div>';
										}else{
											html += "<li><a href="+response[i]+">"+i+"</a></li>";
										}
										
									}
								}							 	
					 
							 }
							 
							$("#"+$("#"+htmlid).attr("info")).html(html);
						}
					});				
				}else{
					alert("至少二个字符");
				}
			});
		}
	});
})(jQuery);


function textsearch(){

	this.init = function(){
		$('#search').keyup(function(event){
			if(event.keyCode == 13){
			 	$(this).next().search("search");
			}
		});
	}
}	

$(document).ready(function() {
	new textsearch().init();
});
