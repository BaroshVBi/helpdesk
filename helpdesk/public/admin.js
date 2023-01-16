var socket = io();
var tabstatus = []; //tabstatus[0] = 'Nowy'; tabstatus[1] = 'Potwierdzony'; tabstatus[2] = 'Wstrzymany'; tabstatus[3] = 'Rozwiązany';
var tabpriority = []; //tabpriority[0] = 'Niski'; tabpriority[1] = 'Normalny'; tabpriority[2] = 'Wysoki';
var tabdept = []; //tabdept[0] = 'HR'; tabdept[1] = 'IT'; tabdept[2] = 'Sprzedaż'; tabdept[3] = 'Produkcja';
var current_ticket = 0;

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
        $('#config_priority').html("<tr class='header'><td class='short_width'>ID</td><td class='full_width'>Wartość</td><td class='short_width'>Edytuj</td><td class='short_width'>Usuń</td></tr>");
        tabpriority.forEach(appendPriority);
    }
});

socket.on('config_status', function (id, value, length) {
    tabstatus[id] = value;
    if (arrayLength(tabstatus) == length) {
        $('#edit_status').html('');
        $('#config_status').html("<tr class='header'><td class='short_width'>ID</td><td class='full_width'>Wartość</td><td class='short_width'>Edytuj</td><td class='short_width'>Usuń</td></tr>");
        tabstatus.forEach(appendStatus);
    }
});

socket.on('config_dept', function (id, value, length) {
    tabdept[id] = value;
    if (arrayLength(tabdept) == length) {
        $('#config_dept').html("<tr class='header'><td class='short_width'>ID</td><td class='full_width'>Wartość</td><td class='short_width'>Edytuj</td><td class='short_width'>Usuń</td></tr>");
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
}

function send_com() {
    socket.emit('add_comment', $('#com').val());
    $('#com').val('');
    view(current_ticket);
}

function next(i) {
    $('#ticket_list').html("<tr><td> ID</td><td>Temat</td><td>Data</td><td>Status</td><td>Priorytet</td></tr>");
    socket.emit('next_page', i);
}

function next_admin(i) {
    $('#ticket_list_admin').html("<tr><td> ID</td><td>Temat</td><td>Data</td><td>Status</td><td>Priorytet</td></tr>");
    socket.emit('next_page_admin', i);
}

function view(id) {
    socket.emit('view_ticket', id);
    current_ticket = id;
}

function sendEdit() {
    socket.emit('send_edit', $('#edit_priority').val(), $('#edit_status').val());
    view(current_ticket);
}

function editPriority(i, element) {
    $("#edit_priority_" + i).html("<input id='edit_priority_input_" + i + "' class='full_cell' value='" + tabpriority[i] + "' required/>");
    $(element).removeAttr('onclick');
    $(element).attr('onClick', "savePriority(" + i + ", this);");
    element.src = 'move.png';
}

function savePriority(i, element) {
    var val = $("#edit_priority_input_" + i).val();
    if (val != '' && val != null) {
        socket.emit('save_priority', i, val);
        $(element).removeAttr('onclick');
        $(element).attr('onClick', "editPriority(" + i + ", this);");
        element.src = 'edit.png';
    }
    else {
        alert('Wypełnij pole!');
    }
}

function addPriority() {
    var val = $("#add_priority_input").val();
    if (val != '' && val != null) {
        socket.emit('add_priority', val);
        $("#add_priority_input").val('');
    }
    else {
        alert('Wypełnij pole!');
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
}

function saveStatus(i, element) {
    var val = $("#edit_status_input_" + i).val();
    if (val != '' && val != null) {
        socket.emit('save_status', i, val);
        $(element).removeAttr('onclick');
        $(element).attr('onClick', "editStatus(" + i + ", this);");
        element.src = 'edit.png';
    }
    else {
        alert('Wypełnij pole!');
    }
}

function addStatus() {
    var val = $("#add_status_input").val();
    if (val != '' && val != null) {
        socket.emit('add_status', val);
        $("#add_status_input").val('');
    }
    else {
        alert('Wypełnij pole!');
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
}

function saveDept(i, element) {
    var val = $("#edit_dept_input_" + i).val();
    if (val != '' && val != null) {
        socket.emit('save_dept', i, val);
        $(element).removeAttr('onclick');
        $(element).attr('onClick', "editDept(" + i + ", this);");
        element.src = 'edit.png';
    }
    else {
        alert('Wypełnij pole!');
    }
}

function addDept() {
    var val = $("#add_dept_input").val();
    if (val != '' && val != null) {
        socket.emit('add_dept', val);
        $("#add_dept_input").val('');
    }
    else {
        alert('Wypełnij pole!');
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

    if (tab == 'list_ticket_admin') next_admin(0);

    if (tab == 'list_ticket') next(0);

    document.getElementById(tab).style.display = 'block';
}

function appendPriority(item, index) {
    $('#edit_priority').append($("<option value='" + index + "'>").html(item));
    $('#priority').append($("<option value='" + index + "'>").html(item));
    $('#config_priority').append($("<tr>").html("<th class='short_width'>" + index + "</th><th class='full_width' id='edit_priority_" + index + "'>" + item + "</th><th class='short_width'><input class='imgbutton' type='image' src='edit.png' onClick='editPriority(" + index + ", this);'/></th><th class='short_width'><input class='imgbutton' type='image' src='delete.png' onClick='deletePriority(" + index + ")'/></th>"));
}

function appendStatus(item, index) {
    $('#edit_status').append($("<option value='" + index + "'>").html(item));
    $('#config_status').append($("<tr>").html("<th class='short_width'>" + index + "</th><th class='full_width' id='edit_status_" + index + "'>" + item + "</th><th class='short_width'><input class='imgbutton' type='image' src='edit.png' onClick='editStatus(" + index + ", this);'/></th><th class='short_width'><input class='imgbutton' type='image' src='delete.png' onClick='deleteStatus(" + index + ")'/></th>"));
}

function appendDept(item, index) {
    $('#config_dept').append($("<tr>").html("<th class='short_width'>" + index + "</th><th class='full_width' id='edit_dept_" + index + "'>" + item + "</th><th class='short_width'><input class='imgbutton' type='image' src='edit.png' onClick='editDept(" + index + ", this);'/></th><th class='short_width'><input class='imgbutton' type='image' src='delete.png' onClick='deleteDept(" + index + ")'/></th>"));
}

//https://stackoverflow.com/a/48022161
function arrayLength(arr) {
    var count = 0;
    arr.forEach(function () {
        count++
    });
    return count
}