var socket = io();
document.getElementById('add_ticket').style.display = 'block';

socket.on('list_ticket', function (id, topic, data, status, priority) {
    $('#ticket_list').append($('<li>').html("<div onClick='view(" + id + ")'>" + id + " | " + topic + " | " + data + " | " + status + " | " + priority + "</div><br>"));
});

socket.on('ticket_data', function (id, topic, descr, data, status, priority) {
    $('#view_ticket').html(id + " | " + topic + " | " + descr + " | " + data + " | " + status + " | " + priority);
    console.log('ticket_data');
});

function tabs(tab) {
    var tabcontent = document.getElementsByClassName('tabcontent');
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }

    document.getElementById(tab).style.display = 'block';
}

function send() {
    socket.emit('ticket', $('#topic').val(), $('#desc').val(), $('#priority').val());
    tabs('list_ticket');
    next(0);
}

function next(i) {
    $('#ticket_list').html("");
    socket.emit('next_page', i);
}

function view(id) {
    socket.emit('view_ticket', id);
    tabs('view_ticket');
}