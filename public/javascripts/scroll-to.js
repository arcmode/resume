$(document).ready(function(){
	$('.scroll-to a').click(function (e) {
		e.preventDefault();
		var href = $(this).attr('href');
		scrollToByHash(href);
	});
});

$('body').on('loaded', function(){
	var href = document.location && document.location.hash;
	if (href) {
		scrollToByHash(href);
	}
	else {
		activateFirstSection();
	}
});


setInterval(function(){
	$(window).bind('scroll', activateFirstSection);
}, 100);

function activateFirstSection(){
	$('section').each(function(index){
		if (isScrolledIntoView(this)) {
			$(this).addClass('active');
			$(this).siblings().removeClass('active');
			$(window).unbind('scroll', activateFirstSection);
			return false;
		}
	});
};

function isScrolledIntoView(elem){
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
};

function scrollToByHash(hash) {
	hash = hash || document.location.hash;
	var element = $(hash);
	var parents = $('[href="' + hash + '"]')
						.parents('.nav li');
	
	parents.addClass('active');
	parents.siblings().removeClass('active');

	var top = element.offset().top;
	var padding = parseInt($('#content').css('padding-top'), 10);

	$('body,html').animate({
		scrollTop: top - padding
	}, 800);
};