$(document).ready(function(){
	var qr = $('#qr');
	qr.click(function(e){
		e.preventDefault();
		var modal = qr.modalize({
			title: $('<i/>', {
				'class': 'icon-mobile-phone',
				'html': ' My contact data'
			}),
			body: $('<img/>', {
				'src': qr.attr('href'),
				'alt': 'My contact info in QR format',
				'style': 'margin: 0 auto; width: 75%; height: 75%;'
			}),
			overflow: 'hidden'
		}).modal();
		modal.on('hidden', function(){
			$(this).remove();
		});
	});
});