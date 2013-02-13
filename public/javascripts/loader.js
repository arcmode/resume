var referrer = document.referrer.split('/')[2];
var domain = document.URL.split('/')[2];
var wrapper = $('#wrapper');
var loading = $('#loading');

loading.on('end', function(){
	loading.remove();
	resizeMain();
});

if (referrer !== domain) {

	loading.position({
	    my: "center",
	    at: "center",
	    of: $(document),
	    collision: "flipfit"
	});
	loading.fadeIn(300);

	$(document).ready(function(){
		loading.fadeOut(300, function(){
			wrapper.fadeIn(600, function(){
				$('#loading').trigger('end');
				loading.trigger('end');
			});
		});
	});
} else {

	wrapper.show();
	loading.trigger('end');
}

function resizeMain(){
	var main = $('#main'),
		h = $(document).height(),
		o = main.offset().top,
		f = $('footer').height();
	main.height(h-o-f);
};