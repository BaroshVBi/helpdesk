var socket = io();
var tabstatus = ['nowy', 'potwierdzony', 'wstrzymany', 'rozwi¹zany'];
var tabpriority = ['niski', 'normalny', 'wysoki'];

tabs('add_ticket');

socket.on('list_ticket', function (id, topic, data, status, priority) {
    $('#ticket_list').append($('<tr>').html("<th>" + id + "</th><th>" + topic + "</th><th>" + data + "</th><th>" + tabstatus[status] + "</th><th>" + tabpriority[priority] + "</th>"));
});

socket.on('ticket_data', function (id, topic, descr, data, status, priority) {
    $('#view_ticket').html(id + " | " + topic + " | " + descr + " | " + data + " | " + status + " | " + priority);
    tabs('view_ticket');
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
    $('#ticket_list').html("<tr><td> ID</td><td>Temat</td><td>Data</td><td>Status</td><td>Priorytet</td></tr>");
    socket.emit('next_page', i);
}

function view(id) {
    socket.emit('view_ticket', id);
}