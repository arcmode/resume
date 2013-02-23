var mapping = {
	'interests': 'icon-beaker',
	'skills': 'icon-wrench',
	'programming': 'icon-cogs',
	'education': 'icon-book',
	'databases': 'icon-key',
	'publications': 'icon-paper-clip',
	'experience': 'icon-briefcase',
	'languages': 'icon-comment',
	'form': 'icon-envelope',
	'data': 'icon-qrcode',
	'location': 'icon-map-marker',
	'bio': 'icon-user',
	'this': 'icon-desktop',
	'chat': 'icon-comments'
};

$('body').on('loaded', function() {
	var sections = $('section');
	sections.each(function(index){
		var section = $(this);
		var icon = $('<i/>', {
			'class': mapping[section.attr('id')]
			, 'style': 'font-size:' + section.height() + 'px'
		}).appendTo(section.find('.page-header'));
	});
});