var socket = io();

function test() {
	//socket.emit('test');
	document.getElementById('test1').innerHTML += 'halo';
	//alert('test');
	socket.emit('test');
}
