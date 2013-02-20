function createModal(options){

	options = options || {};

	var title = options && options.title;
	var body = options && options.body;
	var overflow = options && options.overflow;
	var action = options && options.action;
	var autodestroy = options && options.autodestroy;

	var modal = $('<div/>', {
		'class': 'modal hide fade'
	});

	if (title) {
		var modalHeader = $('<div/>', {
			'class': 'modal-header'
		}).appendTo(modal);

		var closeButtonHeader = $('<button/>', {
			'type': 'button',
			'class': 'close',
			'data-dismiss': 'modal',
			'aria-hidden': 'true',
			'html': '&times;'
		}).appendTo(modalHeader);

		var headerTitle = $('<h3/>', {
			'html': title
		}).appendTo(modalHeader);
	}

	if (body) {
		var modalBody = $('<div/>', {
			'class': 'modal-body'
		}).appendTo(modal);

		var bodyContent = $('<p/>', {
			'html': body
		}).appendTo(modalBody);

		if (overflow) {
			modalBody.css('overflow', overflow);
		}
	}

	var modalFooter = $('<div/>', {
		'class': 'modal-footer'
	}).appendTo(modal);

	var closeButtonFooter = $('<a/>', {
		'href': '#',
		'class': 'btn',
		'data-dismiss': 'modal',
		'html': 'Close'
	}).appendTo(modalFooter);

	if (action) {
		var actionButtonFooter = $('<a/>', {
			'href': '#',
			'class': 'btn btn-info',
			'html': action
		}).appendTo(modalFooter);
	}

	if (autodestroy) {
		modal.on('hidden', function(){
			modal.remove();
		});
	}

	return modal;
};