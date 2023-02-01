var socket = io();
var tabstatus = []; //tabstatus[0] = 'Nowy'; tabstatus[1] = 'Potwierdzony'; tabstatus[2] = 'Wstrzymany'; tabstatus[3] = 'Rozwiązany';
var tabpriority = []; //tabpriority[0] = 'Niski'; tabpriority[1] = 'Normalny'; tabpriority[2] = 'Wysoki';
var tabdept = []; //tabdept[0] = 'HR'; tabdept[1] = 'IT'; tabdept[2] = 'Sprzedaż'; tabdept[3] = 'Produkcja';
var tablvl = [, 'Użytkownik', 'Administrator'];
var tab_sort = ['', 'ID', 'Temat', 'Data', 'Status', 'Priorytet'];
var current_ticket = 0;
var valid_email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
var asc = 1;

tabs('list_ticket_admin');

socket.on('clean_config', function () {
    tabstatus = [];
    tabpriority = [];
    tabdept = [];
});

socket.on('config_priority', function (id, value, length) {
    tabpriority[id] = value;
    if (arrayLength(tabpriority) == length) {
        $('#edit_priority').html('');
        $('#priority').html('');
        $('#config_priority').html("<tr class='header'><td colspan='4'>Ustawienia Priorytetów</td><tr><tr><td class='short_width'>ID</td><td class='full_width'>Wartość</td><td class='short_width'>Edytuj</td><td class='short_width'>Usuń</td></tr>");
        tabpriority.forEach(appendPriority);
    }
});

socket.on('config_status', function (id, value, length) {
    tabstatus[id] = value;
    if (arrayLength(tabstatus) == length) {
        $('#edit_status').html('');
        $('#config_status').html("<tr class='header'><td colspan='4'>Ustawienia Statusów</td><tr><tr><td class='short_width'>ID</td><td class='full_width'>Wartość</td><td class='short_width'>Edytuj</td><td class='short_width'>Usuń</td></tr>");
        tabstatus.forEach(appendStatus);
    }
});

socket.on('config_dept', function (id, value, length) {
    tabdept[id] = value;
    if (arrayLength(tabdept) == length) {
        $('#config_dept').html("<tr class='header'><td colspan='4'>Ustawienia Działów</td><tr><tr><td class='short_width'>ID</td><td class='full_width'>Wartość</td><td class='short_width'>Edytuj</td><td class='short_width'>Usuń</td></tr>");
        tabdept.forEach(appendDept);
    }
});

socket.on('list_ticket', function (id, topic, data, status, priority) {
    $('#ticket_list').append($("<tr onclick='view(" + id + ")'>").html("<th>" + id + "</th><th>" + topic + "</th><th>" + data + "</th><th>" + tabstatus[status] + "</th><th>" + tabpriority[priority] + "</th>"));
});

socket.on('list_ticket_admin', function (id, topic, data, status, priority) {
    $('#ticket_list_admin').append($("<tr onclick='view(" + id + ")'>").html("<th>" + id + "</th><th>" + topic + "</th><th>" + data + "</th><th>" + tabstatus[status] + "</th><th>" + tabpriority[priority] + "</th>"));
});

socket.on('ticket_data', function (id, topic, descr, data, status, priority, name, dept) {
    $('#view_ticket_table').html("<tr class='header'><td colspan='6'>Dane Zgłoszenia</td></tr><tr><td>ID</td><td>Data</td><td>Status</td><td>Priorytet</td><td>Pracownik</td><td>Dział</td></tr><tr><th>" + id + "</th><th>" + data + "</th><th>" + tabstatus[status] + "</th><th>" + tabpriority[priority] + "</th><th>" + name + "</th><th>" + tabdept[dept] + "</th></tr><tr><td>Temat</td><th colspan='5'>" + topic + "</th></tr><tr><td>Opis</td><th colspan='5'>" + descr + "</th></tr>");
    $('#view_ticket_com').html("<tr class='header'><td colspan='3'>Komentarze</td></tr><tr><td>Data dodania</td><td>Użytkownik</td><td>Komentarz</td></tr>");
    tabs('view_ticket');
});

socket.on('comment_data', function (com, name, data) {
    $('#view_ticket_com').append($('<tr>').html("<th>" + data + "</th><th>" + name + "</th><th>" + com + "</th>"));
});

socket.on('user_list', function (id, name, email, lvl, dept) {
    $('#user_list').append($("<tr onclick='viewUser(" + id + ")'>").html("<th>" + id + "</th><th>" + name + "</th><th>" + email + "</th><th>" + tabdept[dept] + "</th><th>" + tablvl[lvl] + "</th>"));
});

socket.on('user_data', function (id, name, email, lvl, dept) {
    $('#edit_user').html("<tr class='header'><td colspan='3'>Edytuj Dane Użytkownika</td></tr><tr><td>ID</td><th>" + id + "</th><td>Nowe Wartości</td></tr><tr><td>Imię i Nazwisko</td><th>" + name + "</th><th><input id='new_user_name' class='full_cell'/></th></tr><tr><td>E-mail</td><th>" + email + "</th><th><input id='new_user_email' class='full_cell'/></th></tr><tr><td>Dział</td><th>" + tabdept[dept] + "</th><th><select id='new_user_dept' class='full_cell'>" + returnOption(tabdept) + "</select></th></tr><tr><td>Uprawnienia</td><th>" + tablvl[lvl] + "</th><th><select id='new_user_lvl' class='full_cell'>" + returnOption(tablvl) + "</select></th></tr>");
    $('#new_user_dept').val(dept);
    $('#new_user_lvl').val(lvl);
    $('#edit_user_controls').html("<tr class='header'><td style='width:50%'><button onclick='editUser(" + id + ")'>Edytuj</button></td><td><button onclick='deleteUser(" + id + ")'>Usuń</button></td></tr>");
    $('#pass_button').html("<button onclick='editUserPassword(" + id + ")'>Zmień hasło</button>");
    tabs('edit_user_tab');
});

socket.on('server_response', function (i) {
    switch (i) {
        case 0:
            $('#user_name').val('');
            $('#user_email').val('');
            $('#user_pass').val('');
            text = "Utworzono nowego użytkownika";
            break;
        case 1:
            text = "Niepoprawne dane użytkownika";
            break;
        case 2:
            text = "Konto zostało usunięte";
            tabs('settings3');
            break
        case 3:
            text = "Zapisano zmiany";
            tabs('settings3');
            break;
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

function sendEdit() {
    socket.emit('send_edit', $('#edit_priority').val(), $('#edit_status').val());
    view(current_ticket);
}

function addUser() {
    if ($('#user_name').val() != '' && $('#user_email').val() != '' && $('#user_pass').val() != '') {
        if ($('#user_email').val().match(valid_email)) {
            socket.emit('add_user', $('#user_name').val(), $('#user_email').val(), $('#user_pass').val(), $('#user_dept').val(), $('#user_lvl').val());
        }
        else {
            popup('Niepoprawny Adres e-mail!');
        }
    }
    else {
        popup('Wypełnij wszystkie pola!');
    }
}

function viewUser(id) {
    socket.emit('view_user', id);
}

function deleteUser(id) {
    if (confirm("Czy napewno chcesz usunąć wybrane konto?") == true) {
        socket.emit('delete_user', id);
    }
}

function editUser(id) {
    socket.emit('edit_user', id, $('#new_user_name').val(), $('#new_user_email').val(), $('#new_user_dept').val(), $('#new_user_lvl').val());
}

function editUserPassword(id) {
    if ($('#edit_user_pass1').val() != '' && $('#edit_user_pass2').val() != '' && $('#edit_user_pass1').val() == $('#edit_user_pass2').val()) {
        socket.emit('edit_user_password', id, $('#edit_user_pass1').val(), $('#edit_user_pass2').val());
        $('#edit_user_pass1').val('');
        $('#edit_user_pass2').val('');
    }
    else {
        popup('Wypełnij wszystkie pola!');
    }
}

function next(pg) {
    $('#ticket_list').html("<tr><td onclick='sortList(1)'>" + returnSort(1) + "</td><td onclick='sortList(2)'>" + returnSort(2) + "</td><td onclick='sortList(3)'>" + returnSort(3) + "</td><td onclick='sortList(4)'>" + returnSort(4) + "</td><td onclick='sortList(5)'>" + returnSort(5) + "</td></tr>");
    socket.emit('next_page', pg, asc);
}

function nextAdmin(pg) {
    $('#ticket_list_admin').html("<tr><td onclick='sortListAdmin(1)'>" + returnSort(1) + "</td><td onclick='sortListAdmin(2)'>" + returnSort(2) + "</td><td onclick='sortListAdmin(3)'>" + returnSort(3) + "</td><td onclick='sortListAdmin(4)'>" + returnSort(4) + "</td><td onclick='sortListAdmin(5)'>" + returnSort(5) + "</td></tr>");
    socket.emit('next_page_admin', pg, asc);
}

function sortListAdmin(sort) {
    if (asc == sort) asc = 0 - sort; else asc = sort;
    nextAdmin(0);
}

function sortList(sort) {
    if (asc == sort) asc = 0 - sort; else asc = sort;
    next(0);
}

function view(id) {
    socket.emit('view_ticket', id);
    current_ticket = id;
}

function editPriority(i, element) {
    $("#edit_priority_" + i).html("<input id='edit_priority_input_" + i + "' class='full_cell' value='" + tabpriority[i] + "' required/>");
    $(element).removeAttr('onclick');
    $(element).attr('onClick', "savePriority(" + i + ", this);");
    element.src = 'move.png';
    element.parentElement.classList.replace('bg_yellow', 'bg_green');
}

function savePriority(i, element) {
    var val = $("#edit_priority_input_" + i).val();
    if (val != '' && val != null) {
        socket.emit('save_priority', i, val);
        $(element).removeAttr('onclick');
        $(element).attr('onClick', "editPriority(" + i + ", this);");
        element.src = 'edit.png';
        element.parentElement.classList.replace('bg_green', 'bg_yellow');
    }
    else {
        popup('Wypełnij pole!');
    }
}

function addPriority() {
    var val = $("#add_priority_input").val();
    if (val != '' && val != null) {
        socket.emit('add_priority', val);
        $("#add_priority_input").val('');
    }
    else {
        popup('Wypełnij pole!');
    }
}

function deletePriority(i) {
    if (confirm("Czy napewno chcesz usunąć wybraną pozycję?") == true) {
        socket.emit('delete_priority', i);
    }
}

function editStatus(i, element) {
    $("#edit_status_" + i).html("<input id='edit_status_input_" + i + "' class='full_cell' value='" + tabstatus[i] + "' required/>");
    $(element).removeAttr('onclick');
    $(element).attr('onClick', "saveStatus(" + i + ", this);");
    element.src = 'move.png';
    element.parentElement.classList.replace('bg_yellow', 'bg_green');
}

function saveStatus(i, element) {
    var val = $("#edit_status_input_" + i).val();
    if (val != '' && val != null) {
        socket.emit('save_status', i, val);
        $(element).removeAttr('onclick');
        $(element).attr('onClick', "editStatus(" + i + ", this);");
        element.src = 'edit.png';
        element.parentElement.classList.replace('bg_green', 'bg_yellow');
    }
    else {
        popup('Wypełnij pole!');
    }
}

function addStatus() {
    var val = $("#add_status_input").val();
    if (val != '' && val != null) {
        socket.emit('add_status', val);
        $("#add_status_input").val('');
    }
    else {
        popup('Wypełnij pole!');
    }
}

function deleteStatus(i) {
    if (confirm("Czy napewno chcesz usunąć wybraną pozycję?") == true) {
        socket.emit('delete_status', i);
    }
}

function editDept(i, element) {
    $("#edit_dept_" + i).html("<input id='edit_dept_input_" + i + "' class='full_cell' value='" + tabdept[i] + "' required/>");
    $(element).removeAttr('onclick');
    $(element).attr('onClick', "saveDept(" + i + ", this);");
    element.src = 'move.png';
    element.parentElement.classList.replace('bg_yellow', 'bg_green');
}

function saveDept(i, element) {
    var val = $("#edit_dept_input_" + i).val();
    if (val != '' && val != null) {
        socket.emit('save_dept', i, val);
        $(element).removeAttr('onclick');
        $(element).attr('onClick', "editDept(" + i + ", this);");
        element.src = 'edit.png';
        element.parentElement.classList.replace('bg_green', 'bg_yellow');
    }
    else {
        popup('Wypełnij pole!');
    }
}

function addDept() {
    var val = $("#add_dept_input").val();
    if (val != '' && val != null) {
        socket.emit('add_dept', val);
        $("#add_dept_input").val('');
    }
    else {
        popup('Wypełnij pole!');
    }
}

function deleteDept(i) {
    if (confirm("Czy napewno chcesz usunąć wybraną pozycję?") == true) {
        socket.emit('delete_dept', i);
    }
}

function tabs(tab) {
    var tabcontent = document.getElementsByClassName('tabcontent');
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }

    if (tab == 'list_ticket_admin') {
        asc = 0;
        nextAdmin(0);
    }

    if (tab == 'list_ticket') {
        asc = 0;
        next(0);
    }

    if (tab == 'settings3') {
        socket.emit('fetch_user_list');
        $('#user_list').html("<tr class='header'><td colspan='5'>Lista Użytkowników</td></tr><tr><td>ID</td><td>Imię i Nazwisko</td><td>E-mail</td><td>Dział</td><td>Uprawnienia</td></tr>");
    }

    document.getElementById(tab).style.display = 'block';
}

function appendPriority(item, index) {
    $('#edit_priority').append($("<option value='" + index + "'>").html(item));
    $('#priority').append($("<option value='" + index + "'>").html(item));
    $('#config_priority').append($("<tr>").html("<th class='short_width'>" + index + "</th><th class='full_width' id='edit_priority_" + index + "'>" + item + "</th><th class='short_width bg_yellow'><input class='imgbutton' type='image' src='edit.png' onClick='editPriority(" + index + ", this);'/></th><th class='short_width bg_red'><input class='imgbutton' type='image' src='delete.png' onClick='deletePriority(" + index + ")'/></th>"));
}

function appendStatus(item, index) {
    $('#edit_status').append($("<option value='" + index + "'>").html(item));
    $('#config_status').append($("<tr>").html("<th class='short_width'>" + index + "</th><th class='full_width' id='edit_status_" + index + "'>" + item + "</th><th class='short_width bg_yellow'><input class='imgbutton' type='image' src='edit.png' onClick='editStatus(" + index + ", this);'/></th><th class='short_width bg_red'><input class='imgbutton' type='image' src='delete.png' onClick='deleteStatus(" + index + ")'/></th>"));
}

function appendDept(item, index) {
    $('#config_dept').append($("<tr>").html("<th class='short_width'>" + index + "</th><th class='full_width' id='edit_dept_" + index + "'>" + item + "</th><th class='short_width bg_yellow'><input class='imgbutton' type='image' src='edit.png' onClick='editDept(" + index + ", this);'/></th><th class='short_width bg_red'><input class='imgbutton' type='image' src='delete.png' onClick='deleteDept(" + index + ")'/></th>"));
    $('#user_dept').append($("<option value='" + index + "'>").html(item));
}

function returnOption(array) {
    var text = '';
    array.forEach(function (item, index) {
        text += "<option value = '" + index + "'>" + item + "</option>";
    });
    return text;
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