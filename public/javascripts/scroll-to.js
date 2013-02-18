$('body').on('loaded', function(){
	var href = document.location && document.location.hash;
	if (href) {
		scrollToByHash(href);
	}
	else {
		activateFirstSection();
	}
});

$('.scroll-to a').click(function() {
	var href = $(this).attr('href');
	scrollToByHash(href);
	return false;
});


$(document).ready(function(){
	setInterval(function(){
		$(window).bind('scroll', activateFirstSection);
		setTimeout(function(){
			$(window).unbind('scroll', activateFirstSection);
		}, 2);
	}, 20);
});

function activateFirstSection(){
	$('section').each(function(index, section){
		if (isScrolledIntoView(section)) {
			var parents = $('[href="' + '#' + $(section).attr('id') + '"]')
						.parents('.nav li');
			parents.addClass('active');
			parents.siblings().removeClass('active');
			$(section).addClass('active');
			$(section).siblings().removeClass('active');
			$(window).unbind('scroll', activateFirstSection);
			return false;
		}
	});
};

function isScrolledIntoView(elem, complete){
	complete = complete || false;
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    if (complete) {
    	return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    } else {
    	return (elemTop >= docViewTop);
    }
};

function scrollToByHash(hash) {
	hash = hash || document.location.hash;
	var element = $(hash);

	var top = element.offset().top;
	var padding = parseInt($('#content').css('padding-top'), 10);

	if ($('body').scrollTop() === 0) {
		activateFirstSection();
	}

	$('body,html').animate({
		scrollTop: top - padding
	}, 800, function(){ window.location.hash = hash; });
};