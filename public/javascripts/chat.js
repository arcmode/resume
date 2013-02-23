$('body').on('loaded', function(){
	var socket = io.connect("http://localhost:3000/chat");

	var chat = $('#chat'),
		messages = $('#messages');
		form = chat.find('form'),
		message = form.find('[type="text"]'),
		send = form.find('[type="submit"]'),
		join = $('#join');

	var name = undefined;

	initSocket();

	function sendMessage(event){
		event.preventDefault();
		var data = {};
		if (message.val().indexOf('@') === 0) {
			var indexOfMessage = message.val().indexOf(' ') + 1;
			data.to = message.val().split(' ')[0].split('@')[1];
			data.message = message.val().slice(indexOfMessage);
		} else {
			data.message = message.val();
		}
		socket.emit('message', data);
		message.val('');
	};

	function initSocket(){
		$(document).bind('keydown', 'ctrl+i', function(){
			join
				.removeClass('btn-danger disabled')
				.addClass('btn-info')
				.html('Join')
				.unbind('click')
				.bind('click', function(){
					name = prompt('What\'s your name?');
					if (name) {
						socket.emit('register', name);
					}
				});
		});
		socket.on('successful connection', function () {
			$('#server-status')
				.removeClass('off')
				.addClass('on');
		});
		socket.on('disconnect', function () {
			$('#server-status').add($('#admin-status'))
				.removeClass('on')
				.addClass('off');
			join
				.addClass('disabled btn-danger')
				.removeClass('btn-info')
				.html('Unavailable')
				.unbind('click');
			message.add(send)
				.attr('disabled', 'disabled');
			send
				.unbind('click');
			name = undefined;
		});
		socket.on('message', function (data) {
			appendMessage(data.message, data.from);
		});
		socket.on('rejected', function (data) {
			name = prompt(data.message);
			if (name) {
				socket.emit('register', name);
			}
		});
		socket.on('registered', function (data) {
			if (data.adminIsConnected || data.isAdmin) {
				$('#admin-status')
					.removeClass('off')
					.addClass('on');
				appendMessage(data.message + ' as ' + data.name);
				join
					.removeClass('btn-info disabled')
					.addClass('btn-danger')
					.unbind('click')
					.html('Leave')
					.bind('click', function(){
						socket.emit('unregister');
					});
				message
					.add(send)
					.removeAttr('disabled');
				send
					.unbind('click')
					.bind('click', sendMessage);
			} else {
				appendMessage(data.message);
			}
		});
		socket.on('unregistered', function(data) {
			appendMessage(data.name + ', ' + data.message);
			join
				.addClass('btn-info')
				.removeClass('btn-danger')
				.unbind('click')
				.html('Join')
				.unbind('click')
				.bind('click', function(){
					name = prompt('What\'s your name?');
					if (name) {
						socket.emit('register', name);
					}
				});
			message.add(send)
				.attr('disabled', 'disabled');
			send
				.unbind('click');
			name = undefined;
		});
		socket.on('restricted name', function(data) {
			appendMessage(data.message);
		});
		socket.on('admin leaved', function () {
			$('#admin-status')
				.removeClass('on')
				.addClass('off');
			join
				.addClass('disabled btn-danger')
				.removeClass('btn-info')
				.html('Unavailable')
				.unbind('click');
			message.add(send)
				.attr('disabled', 'disabled');
			send
				.unbind('click');
		});
		socket.on('admin is joined', function () {
			$('#admin-status')
				.removeClass('off')
				.addClass('on');
			join
				.addClass('btn-info')
				.removeClass('disabled btn-danger')
				.html('Join')
				.unbind('click')
				.bind('click', function(){
					name = prompt('What\'s your name?');
					if (name) {
						socket.emit('register', name);
					}
				});
		});
		socket.on('admin just joined', function () {
			$('#admin-status')
				.removeClass('off')
				.addClass('on');
			if (name) {
				join
					.removeClass('disabled')
					.html('Leave')
					.unbind('click')
					.bind('click', function(){
						socket.emit('unregister');
					});
				message.add(send)
					.removeAttr('disabled');
				send
					.unbind('click')
					.bind('click', sendMessage);
			} else {
				join
					.addClass('btn-info')
					.removeClass('disabled btn-danger')
					.html('Join')
					.unbind('click')
					.bind('click', function(){
						name = prompt('What\'s your name?');
						if (name) {
							socket.emit('register', name);
						}
					});
			}
		});
	};

	function appendMessage(message, from) {
		var td = $('<td/>', { 
					'class': 'message',
					'html': message
					}),
			tr = $('<tr/>', { 'html': td })
					.appendTo(messages.find('tbody'));
		if (from) {
			from = $('<td/>', { 
					'class': 'from',
					'html': from
					 })
					.prependTo(tr);
		} else {
			var fake = $('<td/>', { 
					'class': 'from'
					 })
					.prependTo(tr);
		}
	};
});