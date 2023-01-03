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
    socket.emit('ticket', $('#topic').val(), $('#desc').val(), $('#priority').val());
    tabs('view_ticket');
}

socket.on('view_ticket', function (id, topic, descr, data, status, priority) {
    $('#ticket_list').append($('<li>').html(id + " | " + topic + " | " + descr + " | " + data + " | " + status + " | " + priority + "<br>"));
});

function next(i) {
        io.emit('next_page', i);
}