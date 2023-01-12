var socket = io();
var tabstatus = ['Nowy', 'Potwierdzony', 'Wstrzymany', 'Rozwiązany'];
var tabpriority = ['Niski', 'Normalny', 'Wysoki'];
var tabdept = ['HR', 'IT', 'Sprzedaż', 'Produkcja'];

tabs('add_ticket');

socket.on('list_ticket', function (id, topic, data, status, priority) {
    $('#ticket_list').append($("<tr onclick='view(" + id + ")'>").html("<th>" + id + "</th><th>" + topic + "</th><th>" + data + "</th><th>" + tabstatus[status] + "</th><th>" + tabpriority[priority] + "</th>"));
});

socket.on('ticket_data', function (id, topic, descr, data, status, priority, name, dept) {
    $('#view_ticket_table').html("<tr><th class='header'>ID</th><th class='header'>Data</th><th class='header'>Status</th><th class='header'>Priorytet</th><th class='header'>Pracownik</th><th class='header'>Dział</th></tr><tr><th>" + id + "</th><th>" + data + "</th><th>" + tabstatus[status] + "</th><th>" + tabpriority[priority] + "</th><th>" + name + "</th><th>" + tabdept[dept] + "</th></tr><tr><th class='header'>Temat</th><th colspan='5'>" + topic + "</th></tr><tr><th class='header'>Opis</th><th colspan='5'>" + descr + "</th></tr>");
    $('#view_ticket_com').html("<tr><td class='header'>Data dodania</td><td class='header'>Użytkownik</td><td class='header'>Komentarz</td></tr>");
    tabs('view_ticket');
});

socket.on('comment_data', function (com, name, data) {
    $('#view_ticket_com').append($('<tr>').html("<th>" + data + "</th><th>" + name + "</th><th>" + com + "</th>"));
});

function send() {
    socket.emit('ticket', $('#topic').val(), $('#desc').val(), $('#priority').val());
    $('#topic').val('');
    $('#desc').val('');
    $('#priority').val(0);
    tabs('list_ticket');
    next(0);
}

function send_com() {
    socket.emit('add_comment', $('#com').val());
    $('#com').val('');
}

function next(i) {
    $('#ticket_list').html("<tr><td> ID</td><td>Temat</td><td>Data</td><td>Status</td><td>Priorytet</td></tr>");
    socket.emit('next_page', i);
}

function view(id) {
    socket.emit('view_ticket', id);
}

function tabs(tab) {
    var tabcontent = document.getElementsByClassName('tabcontent');
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }
    document.getElementById(tab).style.display = 'block';
}