$(document).ready(function(){
	var contactForm = $('#contactForm');
	contactForm
		.find('[type="submit"]')
		.click(function(e) {
			e.preventDefault();
			var email = contactForm.find('#email').val()
			var subject = contactForm.find('#subject').val()
			var message = contactForm.find('#message').val()

			window.location.href = 'mailto:' +
									'drojascamaggi@gmail.com' +
									'?cc=' + email +
									'&subject=' + subject +
									'&body=' + message;
		});
});