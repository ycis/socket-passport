$(document).ready(function() {
  var socket = io.connect(window.location.origin);
	socket.on('connect', function() {
		$.get("/api/user_data").then(data => socket.emit('adduser', data.displayname));
	});
	socket.on('updatechat', function(username, data) {
		$('#conversation').append('<b>'+username + ':</b> ' + data + '<br>')
	});
	socket.on('updaterooms', function(rooms, current_room) {
		$('#rooms').empty();
		$.each(rooms, function(key, value) {
			if(value == current_room){
				$('#rooms').append('<div>' + value + '</div>');
			}
			else {
				$('#rooms').append('<div><a href="#" class="room">' + value + '</a></div>');
			}
		});
		$('.room').on('click', function () {
			switchRoom($(this).text())
		})
	});

	function switchRoom(room){
		socket.emit('switchRoom', room);
	}
	$(function(){
		$('#datasend').click( function() {
			var message = $('#data').val();
			$('#data').val('');
			socket.emit('sendchat', message);
		});
		$('#data').keypress(function(e) {
			if(e.which == 13) {
				$(this).blur();
				$('#datasend').focus().click();
			}
		});
	});
});