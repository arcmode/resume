$('body').on('loaded', function(){
	var socket = io.connect("http://localhost:3000/chat");

	var chat = $('#chat'),
		messages = $('#messages');
		form = chat.find('form'),
		message = form.find('[type="text"]'),
		send = form.find('[type="submit"]'),
		join = $('#join');

	var name;

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

	function register(name){
		socket.emit('register', name);
	};

	function unregister(){
		socket.emit('unregister');
	};

	function initSocket(){
		socket.on('successful connection', function () {
			join
				.addClass('btn-info')
				.removeClass('btn-danger disabled')
				.html('Join');
			initChat();
		});
		socket.on('disconnect', function () {
			join
				.removeClass('btn-info')
				.addClass('btn-danger disabled')
				.html('Unavailable');
			endChat();
		});
		socket.on('message', function (data) {
			appendMessage(data.from + ': ' + data.message);
		});
		socket.on('rejected', function (data) {
			joinChat(null, data.message);
		});
		socket.on('accepted', function (data) {
			appendMessage(data.message + ' as ' + data.name);
			enableChat();
		});
		socket.on('unregistered', function(data) {
			appendMessage(data.name + ', ' + data.message);
			disableChat();
		});
		socket.on('restricted name', function(data) {
			appendMessage(data.message);
		});
	};

	function appendMessage(message) {
		var td = $('<td/>', { 'html': message }),
			tr = $('<tr/>', { 'html': td })
				.appendTo(messages.find('tbody'));
	};

	function endChat(){
		join.unbind('click');
		chat
			.find('input, button')
			.not('#join')
			.attr('disabled', 'disabled');
	};

	function initChat(){
		join
			.bind('click', joinChat)
			.unbind('click', leaveChat);
	};

	function enableChat(){
		chat
			.find('[disabled]')
			.removeAttr('disabled');
		join
			.removeClass('btn-info')
			.addClass('btn-danger')
			.html('Leave')
			.unbind('click', joinChat)
			.bind('click', leaveChat);
		send.bind('click', sendMessage);
	};

	function disableChat(){
		chat
			.find('input, button')
			.not('#join')
			.attr('disabled', 'disabled');
		join
			.removeClass('btn-danget')
			.addClass('btn-info')
			.html('Join')
			.unbind('click', leaveChat)
			.bind('click', joinChat);
		send.unbind('click', sendMessage);
	};

	function leaveChat(event){
		event.preventDefault();
		unregister();
	};

	function joinChat(event, text){
		if (event) {
			event.preventDefault();
		}
		name = prompt(text || 'What\'s your name?');
		if (name) {
			register(name);
		}
	};
});