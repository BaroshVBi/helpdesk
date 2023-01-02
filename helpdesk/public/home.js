var socket = io();
document.getElementById('add_ticket').style.display = 'block';

function tabs(tab) {
    var tabcontent = document.getElementsByClassName('tabcontent');
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }

    document.getElementById(tab).style.display = 'block';
}
function send() {
    //var topic = document.getElementById('topic').value;
    //var desc = document.getElementById('description').value;
    socket.emit('ticket', $('#topic').val(), $('#desc').val());
}