var mapping = {
	'interests': 'icon-beaker',
	'skills': 'icon-wrench',
	'programming': 'icon-cogs',
	'education': 'icon-book',
	'databases': 'icon-key',
	'publications': 'icon-paper-clip',
	'experience': 'icon-briefcase',
	'languages': 'icon-comment',
	'contact': 'icon-envelope'
};

$(document).ready(function() {
	var sections = $('section');
	sections.each(function(index){
		var section = $(this);
		var icon = $('<i/>', {
			'class': mapping[section.attr('id')]
		}).appendTo(section.find('.page-header'));
	});
});