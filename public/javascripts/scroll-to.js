$(document).ready(function(){
	$('.scroll-to a').click(function (e) {
		e.preventDefault();
		var href = $(this).attr('href');
		scrollToByHash(href);
	});
});

$('#loading').on('end', function(){
	var href = document.location && document.location.hash;
	if (href) {
		scrollToByHash(href);
	}
});

$(document).ready(function(){
	var href = document.location && document.location.hash;
	if (href) {
		scrollToByHash(href);
	}
});

function scrollToByHash(hash) {
	hash = hash || document.location.hash;
	var element = $(hash);
	var parents = $('[href="' + hash + '"]')
						.parents('.nav li');
	
	element.addClass('active');
	element.siblings().removeClass('active');
	parents.addClass('active');
	parents.siblings().removeClass('active');

	var top = element.offset().top;
	var padding = parseInt($('#content').css('padding-top'), 10);

	$('body,html').animate({
		scrollTop: top - padding
	}, 800, function() {
		if (document.location.hash !== hash) document.location.hash = hash;
	});
};