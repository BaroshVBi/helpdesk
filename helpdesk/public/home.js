var socket = io();
var tabstatus = []; //tabstatus[0] = 'Nowy'; tabstatus[1] = 'Potwierdzony'; tabstatus[2] = 'Wstrzymany'; tabstatus[3] = 'Rozwiązany';
var tabpriority = []; //tabpriority[0] = 'Niski'; tabpriority[1] = 'Normalny'; tabpriority[2] = 'Wysoki';
var tabdept = []; //tabdept[0] = 'HR'; tabdept[1] = 'IT'; tabdept[2] = 'Sprzedaż'; tabdept[3] = 'Produkcja';
var tablvl = [, 'Użytkownik', 'Administrator'];
var tab_sort = ['', 'ID', 'Temat', 'Data', 'Status', 'Priorytet'];
var current_ticket = 0;
asc = 1;

tabs('add_ticket');

socket.on('clean_config', function () {
    tabstatus = [];
    tabpriority = [];
    tabdept = [];
});

socket.on('config_priority', function (id, value, length) {
    tabpriority[id] = value;
    if (arrayLength(tabpriority) == length) {
        $('#priority').html('');
        tabpriority.forEach(appendPriority);
    }
});

socket.on('config_status', function (id, value, length) {
    tabstatus[id] = value;
});

socket.on('config_dept', function (id, value, length) {
    tabdept[id] = value;
});

socket.on('list_ticket', function (id, topic, data, status, priority) {
    $('#ticket_list').append($("<tr onclick='view(" + id + ")'>").html("<th>" + id + "</th><th>" + topic + "</th><th>" + data + "</th><th>" + tabstatus[status] + "</th><th>" + tabpriority[priority] + "</th>"));
});

socket.on('ticket_data', function (id, topic, descr, data, status, priority, name, dept) {
    $('#view_ticket_table').html("<tr class='header'><td colspan='6'>Dane Zgłoszenia</td></tr><tr><td>ID</td><td>Data</td><td>Status</td><td>Priorytet</td><td>Pracownik</td><td>Dział</td></tr><tr><th>" + id + "</th><th>" + data + "</th><th>" + tabstatus[status] + "</th><th>" + tabpriority[priority] + "</th><th>" + name + "</th><th>" + tabdept[dept] + "</th></tr><tr><td>Temat</td><th colspan='5'>" + topic + "</th></tr><tr><td>Opis</td><th colspan='5'>" + descr + "</th></tr>");
    $('#view_ticket_com').html("<tr class='header'><td colspan='3'>Komentarze</td></tr><tr><td>Data dodania</td><td>Użytkownik</td><td>Komentarz</td></tr>");
    tabs('view_ticket');
});

socket.on('comment_data', function (com, name, data) {
    $('#view_ticket_com').append($('<tr>').html("<th>" + data + "</th><th>" + name + "</th><th>" + com + "</th>"));
});

socket.on('server_response', function (i) {
    switch (i) {
        case 4:
            text = "Hasło zostało zmienione";
            break;
        case 5:
            text = "Dodano Komentarz";
            break;
        default:
            text = "Wystąpił Błąd";
    }
    popup(text);
});

function send() {
    if ($('#topic').val() != '' && $('#desc').val() != '') {
        socket.emit('ticket', $('#topic').val(), $('#desc').val(), $('#priority').val());
        $('#topic').val('');
        $('#desc').val('');
        tabs('list_ticket');
    }
    else {
        popup('Wypełnij wszystkie pola');
    }
}

function sendCom() {
    if ($('#com').val() != '' && $('#com').val() != null) {
        socket.emit('add_comment', $('#com').val());
        $('#com').val('');
        view(current_ticket);
    }
    else {
        popup('Wypełnij pole aby napisać komentarz');
    }
}

function editPassword() {
    if ($('#edit_user_pass1').val() && $('#edit_user_pass2').val() && $('#edit_user_pass_old').val() && $('#edit_user_pass1').val() == $('#edit_user_pass2').val()) {
        socket.emit('edit_password', $('#edit_user_pass_old').val(), $('#edit_user_pass1').val(), $('#edit_user_pass2').val());
        $('#edit_user_pass_old').val('');
        $('#edit_user_pass1').val('');
        $('#edit_user_pass2').val('');
        console.log('test');
    }
    else {
        popup('Wypełnij wszystkie pola!');
    }
}

function next(pg) {
    $('#ticket_list').html("<tr><td onclick='sortList(1)'>" + returnSort(1) + "</td><td onclick='sortList(2)'>" + returnSort(2) + "</td><td onclick='sortList(3)'>" + returnSort(3) + "</td><td onclick='sortList(4)'>" + returnSort(4) + "</td><td onclick='sortList(5)'>" + returnSort(5) + "</td></tr>");
    socket.emit('next_page', pg, asc);
}

function sortList(sort) {
    if (asc == sort) asc = 0 - sort; else asc = sort;
    next(0);
}

function view(id) {
    socket.emit('view_ticket', id);
    current_ticket = id;
}

function tabs(tab) {
    var tabcontent = document.getElementsByClassName('tabcontent');
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }

    if (tab == 'list_ticket') {
        asc = 0;
        next(0);
    }

    document.getElementById(tab).style.display = 'block';
}

function appendPriority(item, index) {
    $('#priority').append($("<option value='" + index + "'>").html(item));
}

function popup(text) {
    el = document.getElementById('popup');
    el.classList.remove('popup_animation');
    $('#popup_text').html(text);
    el.offsetWidth;
    el.classList.add('popup_animation');
}

function returnSort(i) {
    var text = "";
    if (i == Math.abs(asc)) {
        if (asc > 0)
            text = "&#8659; " + tab_sort[i];
        if (asc < 0)
            text = "&#8657; " + tab_sort[i];
    }
    else {
        text = tab_sort[i];
    }
    return text
}

//https://stackoverflow.com/a/48022161
function arrayLength(arr) {
    var count = 0;
    arr.forEach(function () {
        count++
    });
    return count
}