$('input[type="submit"]').mousedown(function(){
	$(this).css('background', '#2ecc71');
});
$('input[type="submit"]').mouseup(function(){
	$(this).css('background', '#1abc9c');
});

$('#loginform').click(function(){
	$('#registerInput').css("display", "none");

	$('.login').fadeToggle('slow');
	$(this).toggleClass('green');


	$('#registerform').removeClass('green');

});

$('#registerform').click(function()
{
	$(this).toggleClass('green');
	var container = $(".login");
	container.hide();

	$('#loginform').removeClass('green');
	$('#registerInput').css("display", "");	
});


$('#userSubmit').click(function()
{
	var email = $('#userEmail').val();
	var password = $('#userPassword').val();

});

$('#register').click(function()
{
	if ($('#newEmail').val().indexOf('@') == -1 || $('#newEmail').val().indexOf('@') == $('#newEmail').val().length - 1)
		return;

	if ($('#newEmail').val() == '' || $('#newPassword').val() == '')
	{
		$('body').prepend('<div id = "accountUnsuccessful" class="alert alert-danger" role="alert">Please enter both username and password.</div>');
		setTimeout(function()
		{
			$('#accountUnsuccessful').remove();
		}, 2000);

		
		return;
	}

	var name = $('#newName').val();
	var email = $('#newEmail').val();
	var password = $('#newPassword').val();
	var mobile = $('#newMobile').val();

	$.ajax({
		type: 'POST',
		url: 'https://still-forest-5409.herokuapp.com/',
		data: {
			'name': name,
			'email': email,
			'password': password,
			'mobile_number': mobile
		},
		success: function(msg)
		{
			$('body').prepend('<div id = "accountSuccessful" class="alert alert-success" role="alert">Your Account has been created!</div>');

			setTimeout(function()
			{
				$('#accountSuccessful').remove();
				$('#registerInput').css("display", "none");
				$('#well').css('display', '');
			}, 2000);
		}
	})	
});


$(document).mouseup(function (e)
{
	var container = $(".login");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
    	container.hide();

    }
});