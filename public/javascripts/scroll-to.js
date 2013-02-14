$(document).ready(function(){
	$('.scroll-to a').click(function () {
		var href = $(this).attr('href');
		scrollToByHash(href);
		return false;
	});
});

$('#loading').on('end', function(){
	var href = document.location && document.location.hash;
	if (href) {
		scrollToByHash(href);
	}
});

function scrollToByHash(hash) {
	var parents = $('[href="' + hash + '"]')
						.parents('.nav li');
	var top = $(hash).offset().top;
	var padding = parseInt($('#content').css('padding-top'), 10);
	
	parents.addClass('active');
	parents.siblings().removeClass('active');
	$('body,html').animate({
		scrollTop: top - padding
	}, 800, function() {
		if (document.location.hash !== hash) document.location.hash = hash;
	});
};