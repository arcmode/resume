$('body').on('loaded', function(){
	var toMe = $('#to-me'),
		me = $('#me');
	$(document).bind('keydown', 'alt+m', function(){
		me.add(toMe)
			.show()
			.addClass('in');
		$(document).unbind('keydown');
		scrollToByHash('#me');
	});
});