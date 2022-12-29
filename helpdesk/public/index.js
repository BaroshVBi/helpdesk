$(function () {
	
	var socket = io();

	$('form').submit(function(e)
	{
		e.preventDefault();
		socket.emit('ticket', $('#imie').val(), $('#oddzial').val(), $('#zdarzenie').val(), $('#nrtel').val());
		$('#imie').val('');
		$('#zdarzenie').val('');
		alert('ticket zostal wyslany');
		return false;
	});
});