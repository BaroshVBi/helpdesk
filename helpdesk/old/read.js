var taba = [];
var tabz = [];
var tabp = [];
var tabm = [];
var z = 0;
var a = 0;
var p = 0;
var am = 0;
var socket = io();

$(function () {
	socket.emit('login');
	
	socket.on('ticketread', function(data, filename) {
		var ticket = JSON.parse(data);
		tabz[z] = new zgloszenie(ticket.imie, ticket.oddzial, ticket.time, ticket.opis, ticket.nrtel, filename);
		ticket.time = parseTime(ticket.time);
		$('#lista').append($('<li>').html("	<div id = 'ticket" + z + "' class = 'ticket'>\
												<div class = 'pasek' onClick = 'poka(" + z + ",1);'>\
													<div class = 'imie'>" + ticket.imie + "</div>\
													<div class = 'oddzial'>" + ticket.oddzial + "</div>\
													<div class = 'czas'>" + ticket.time + "</div>\
													<div class = 'guzik'><img title = 'Rozwiń' id = 'obrazekZ" + z + "' src = 'plus.png' alt = 'Rozwiń'></div>\
												</div>\
												<div id ='opisZ" + z + "' class = 'tresc' style = 'display: none;'>\
													<div class = 'text'>Opis zdarzenia:<div class = 'tab'>" + ticket.opis + "</div></div><br>\
													" + checkNR(ticket.nrtel) + "\
													<div class = 'navbuttons'>\
														<div class = 'delete'><img class = 'archbutton' title = 'Usuń' onClick = 'del(" + z + ", 1);' src = 'delete.png'></div>\
														<div class = 'delete'><img class = 'archbutton' title = 'Przenieś do archiwum' onClick = 'move(" + z + "," + '""' + ");' src = 'move.png' alt = 'move'></div>\
														<div class = 'delete'><img class = 'archbutton' title = 'Dodaj przykład na podstawie tego ticketa' onClick = 'add(" + z + ", 1);' src = 'add.png' alt = 'add'></div>\
													</div>\
												</div>\
											</div>"
										));
		z = z + 1;
	});
	
	socket.on('archiwumread', function(data, filename) {
		var ticket = JSON.parse(data);
		console.log(ticket);
		taba[a] = new wpis(ticket.imie, ticket.oddzial, ticket.time, ticket.opis, ticket.nrtel, ticket.newtime, ticket.comment, filename, 'current');
		console.log(taba[a]);
		ticket.time = parseTime(ticket.time);
		ticket.newtime = parseTime(ticket.newtime);
		$('#archiwum').append($('<li>').html("	<div id = 'wpis" + a + "'>\
													<div class = 'pasekA' onClick = 'poka(" + a + ",2);'>\
														<div class = 'imie'>" + ticket.imie + "</div>\
														<div class = 'oddzial'>" + ticket.oddzial + "</div>\
														<div class = 'czas'>" + ticket.newtime + "</div>\
														<div class = 'guzik'><img title = 'Rozwiń' id = 'obrazekA" + a + "' src = 'plus.png' alt = 'Rozwiń'></div>\
													</div>\
													<div id = 'opisA" + a + "' class = 'tresc' style = 'display: none;'>\
														<div class = 'text'>Opis zdarzenia:<div class = 'tab'>" + ticket.opis + "</div></div><br>\
														" + checkNR(ticket.nrtel) + "\
														" + checkCOMMENT(a) + "\
														<div class = 'navbuttons'>\
															<div class = 'delete'><img class = 'archbutton' title = 'Usuń' onClick = 'del(" + a + ", 2);' src = 'delete.png'></div>\
															<div class = 'delete'><img class = 'archbutton' title = 'Dodaj Komentarz' onClick = 'addcom(" + a + ")' src = 'com.png'></div>\
															<div class = 'delete'><img class = 'archbutton' title = 'Dodaj przykład na podstawie tego ticketa' onClick = 'add(" + a + ", 2);' src = 'add.png' alt = 'add'></div>\
														</div>\
													</div>\
												</div>"
											));
		a = a + 1;
	});
	
	socket.on('przykladyread', function(data, filename) {
		var div = document.getElementById('opisZ-3');
		if (div.style.display == 'block')
		{
			var text = JSON.parse(data);
			tabp[p] = new przyklad(text.nazwa, text.blad, text.rozwiazanie);
			$('#przyklady').append($('<li>').html("	<div id = 'przyklad" + p + "'>\
														<div class = 'pasekP' onClick = 'poka(" + p + ",3);'>\
															<div class = 'imie'>" + text.nazwa + "</div>\
															<div class = 'oddzial'></div>\
															<div class = 'czas'></div>\
															<div class = 'guzik'><img title = 'Rozwiń' id = 'obrazekP" + p+ "' src = 'plus.png' alt = 'Rozwiń'></div>\
														</div>\
														<div id = 'opisP" + p + "' class = 'tresc' style = 'display: none;'>\
															<div class = 'text'>Opis:<div class = 'tab'>" + text.blad + "</div></div><br>\
															<div class = 'text'>Rozwiązanie:<div class = 'tab'>" + text.rozwiazanie + "</div></div>\
															<div class = 'navbuttons'>\
																<div class = 'delete'><img class = 'archbutton' title = 'Usuń' onClick = 'delP(" + p + ");' src = 'delete.png'></div>\
																<div class = 'delete'><img class = 'archbutton' title = 'Edytuj' onClick = 'edit(" + p + ");' src = 'edit.png' alt = 'add'></div>\
															</div>\
														</div>\
													</div>"
												));
			p = p + 1;
		}
	});
	
	socket.on('miesiacread', function(name) {
		tabm[am] = name;												
		$('#miesiace').append($('<li>').html(	"<div class = 'pasekn' onClick = 'poka(" + am +",4); show(" + am + ");'>\
													<div class = 'imie'>" + name +"</div>\
													<div class = 'oddzialn'></div>\
													<div class = 'czasn'></div>\
													<div class = 'guzik'><img title = 'Zwiń' id = 'obrazekM" + am + "' src = 'plus.png' alt = 'Rozwiń'></div>\
												</div>\
												<div id = 'opisM" + am + "' class = 'container' style = 'display: none;'>\
													<ul class = 'nav3' id = '" + name + "'>\
														<li>\
															<div class = 'pasekn3'>\
																<div class = 'imien2'>Imię:</div>\
																<div class = 'oddzialn2'>Jednostka:</div>\
																<div class = 'czasn2'>Wykonano:</div>\
																<div class = 'guzik2'></div>\
															</div>\
														</li>\
													</ul>\
												</div>"	
											));
		am = am + 1;
	});
	
	socket.on('Mread', function(data, filename, name) {
		var ticket = JSON.parse(data);
		var div = document.getElementById(name);
		console.log(ticket);
		console.log(name);
		taba[a] = new wpis(ticket.imie, ticket.oddzial, ticket.time, ticket.opis, ticket.nrtel, ticket.newtime, ticket.comment, filename, name);
		ticket.time = parseTime(ticket.time);													
		ticket.newtime = parseTime(ticket.newtime);
		$('#' + name).append($('<li>').html("	<div id = 'wpis" + a + "'>\
													<div class = 'pasekA' onClick = 'poka(" + a + ",2);'>\
														<div class = 'imie'>" + ticket.imie + "</div>\
														<div class = 'oddzial'>" + ticket.oddzial + "</div>\
														<div class = 'czas'>" + ticket.newtime + "</div>\
														<div class = 'guzik'><img title = 'Rozwiń' id = 'obrazekA" + a + "' src = 'plus.png' alt = 'Rozwiń'></div>\
													</div>\
													<div id = 'opisA" + a + "' class = 'tresc' style = 'display: none;'>\
														<div class = 'text'>Opis zdarzenia:<div class = 'tab'>" + ticket.opis + "</div></div><br>\
														" + checkNR(ticket.nrtel) + "\
														" + checkCOMMENT(a) + "\
														<div class = 'navbuttons'>\
															<div class = 'delete'><img class = 'archbutton' title = 'Usuń' onClick = 'del(" + a + ", 2);' src = 'delete.png'></div>\
															<div class = 'delete'><img class = 'archbutton' title = 'Dodaj Komentarz' onClick = 'addcom(" + a + ")' src = 'com.png'></div>\
															<div class = 'delete'><img class = 'archbutton' title = 'Dodaj przykład na podstawie tego ticketa' onClick = 'add(" + a + ", 2);' src = 'add.png' alt = 'add'></div>\
														</div>\
													</div>\
												</div>"
											));
		a = a + 1;
	});
	
	socket.on('deleted', function(filename) {
		for (i = 0; i < tabz.length; i++)
		{
			if (filename == tabz[i].filename)
			{
				document.getElementById('ticket' + i).remove();
				break;
			}
		}
	});
	
	socket.on('deletedP', function(filename) {
		console.log(tabp.length);
		console.log(filename);
		var g = 0;
		do
		{
			if (filename == (tabp[g].nazwa + '.txt'))
			{
				console.log(g);
				try {document.getElementById('przyklad' + g).remove();} catch(err) {}
			}
			g = g + 1;
		}
		while (g <= tabp.length);
	});
	
	socket.on('przykladcheck', function(k) {
		if (k == 0)
		{
			alert('Podana nazwa została już użyta');
		}
		else
		{
			abort();
		}
	});
	
	socket.on('comdeleted', function(filename, comid) {
		for(i = 0; i < taba.lengtht; i++)
		{
			if (taba[i].filename == filename)
			{
				$('#' + i + 'com' + comid).remove();
				break;
			}
		}
	});
});

document.addEventListener('mousemove', function() {
	empty('archiwum');
});

function poka(id, which)
{
	if (which == 1)
	{
		var opis = document.getElementById('opisZ' + id);
		var img = document.getElementById('obrazekZ' + id);
	}
	else if (which == 2)
	{
		var opis = document.getElementById('opisA' + id);
		var img = document.getElementById('obrazekA' + id);
	}
	else if (which == 3)
	{
		var opis = document.getElementById('opisP' + id);
		var img = document.getElementById('obrazekP' + id);
	}
	else if (which == 4)
	{
		var opis = document.getElementById('opisM' + id);
		var img = document.getElementById('obrazekM' + id);
	}
	
	if (opis.style.display == 'none')
	{
		opis.style.display = 'block';
		img.src = 'minus.png';
		img.alt = 'Zwiń';
		img.title = 'Zwiń';
	}
	else
	{
		opis.style.display = 'none';
		img.src = 'plus.png';
		img.alt = 'Rozwiń';
		img.title = 'Rozwiń';
	}
}

function show(a) 
{
	if (a == -1)
	{
		var div = document.getElementById('opisZ-3');
		if (div.style.display == 'block')
		{
			socket.emit('give');
		}
		else
		{
			document.getElementById('przyklady').textContent = '';
		}
	}
	else
	{
		var div = document.getElementById('opisM' + a);
		if (div.style.display == 'block')
		{
			socket.emit('giveM', tabm[a]);
		}
		else
		{
			document.getElementById(tabm[a]).textContent = '';
			$('#' + tabm[a]).append($('<li>').html("	<div class = 'pasekn3'>\
														<div class = 'imien2'>Imię:</div>\
														<div class = 'oddzialn2'>Jednostka:</div>\
														<div class = 'czasn2'>Wykonano:</div>\
														<div class = 'guzik2'></div>\
													</div>"));
		}
	}
}

var okno = document.getElementById('okno');
var blad = document.getElementById('blad');
var roz = document.getElementById('rozwiazanie');
var nazwa = document.getElementById('nazwa');
var submitbtn = document.getElementById('submit');
var oldname = '';

function edit(id)
{
	okno.style.display = 'flex';
	blad.value = tabp[id].blad;
	nazwa.value = tabp[id].nazwa;
	oldname = tabp[id].nazwa;
	roz.value = tabp[id].rozwiazanie;
	submitbtn.onclick = editin;
}

function editin()
{
	if (nazwa.value == '' || blad.value == '' || roz.value == '')
	{
		alert('Wprowadź dane');
	}
	else
	{
		socket.emit('przykladedit', nazwa.value, blad.value, roz.value, oldname);
	}
}

function addin()
{
	if (nazwa.value == '' || blad.value == '' || roz.value == '')
	{
		alert('Wprowadź dane');
	}
	else
	{
		socket.emit('przyklad', nazwa.value, blad.value, roz.value);
	}
}

function add(id, a)
{
	okno.style.display = 'flex';
	if (a == 1)
		blad.value = tabz[id].opis;
	else if (a == 2)
		blad.value = taba[id].opis;
}

function abort()
{
	okno.style.display = 'none';
	blad.value = '';
	roz.value = '';
	nazwa.value = '';
	submitbtn.onclick = addin;
	oldname = '';
}

function del(id, a)
{
	var conf = confirm('Czy napewno chcesz usunąć ticketa?');
	if (conf == true)
	{
		if (a == 1)
		{
			socket.emit('delete', tabz[id].filename);
			document.getElementById('ticket' + id).remove();
		}
		else if ( a == 2)
		{
			socket.emit('deleteA', taba[id].filename);
			document.getElementById('wpis' + id).remove();
		}
	}
}

function delP(id)
{
	var conf = confirm('Czy napewno chcesz usunąć przykład?');
	if (conf == true)
	{
		socket.emit('deleteP', tabp[id].nazwa + '.txt');
		document.getElementById('przyklad' + id).remove();
	}
}

function move(id, com)
{
	var comment = com;
	socket.emit('move', tabz[id].filename, comment);
	document.getElementById('ticket' + id).remove();
}

function parseTime(d)
{
	var time = new Date(d);
	var m = time.getMinutes();
	if (m < 10)
		m = "0" + m;
	var h = time.getHours();
	if (h < 10)
		h = "0" + h;
	var M = time.getMonth() + 1;
	if (M < 10)
		M = "0" + M;
	var d = time.getDate();
	if (d < 10)
		d = "0" + d;
	var s = time.getSeconds();
	if (s < 10)
		s = "0" + s;
	return  d + "." + M + "." + time.getFullYear() + " " + h + "-" + m + "-" + s;
}

function empty(id)
{
	var ulist = document.getElementById(id);
	var lista = ulist.getElementsByTagName("li");
	if (lista.length < 2)
	{
		$('#' + id).append($("<li class = 'empty'>").html("	<div class = 'pasekn3'>\
																<div class = 'imien2'></div>\
																<div class = 'oddzialn2'>Brak ostatnio rozwiązanych ticketów</div>\
																<div class = 'czasn2'></div>\
																<div class = 'guzik2'></div>\
															</div>"));
	}
	else if (lista.length > 2 && $('#' + id).children('.empty').length > 0)
	{
		$('#' + id).children('.empty')[0].remove();
	}
}

function checkNR(string)
{
	if (string != '')
		string = "<div class = 'nrtel'>Nr. telefonu: " + string + "</div><br>";
	return string;
}

function checkCOMMENT(k)
{
	var com = '';
	if (taba[k].comment.length > 0)
	{
		com = 'Komentarze:';
		console.log(taba[k].comment);
		console.log(taba[k].comment.length);
			for (i = 0; i < taba[k].comment.length; i++)
				com = com + "<div id = '" + k + "com" + i + "' class = 'tab'>" + (i + 1) + ". " + taba[k].comment[i] + " <img class = 'delcom' src = 'delete.png' onClick = 'delcom(" + i + "," + k + ")'></div>";
	}
	return com;
}

function delcom(k, id)
{
	socket.emit('delcom', taba[id].filename, taba[id].comment[k], taba[id].folder);
	
	$('#' + id + 'com' + k).remove();
}

class zgloszenie
{
	constructor(imie, oddzial, czas, opis, nrtel, filename)
	{
		this.imie = imie;
		this.oddzial = oddzial;
		this.czas = czas;
		this.opis = opis;
		this.nrtel = nrtel;
		this.filename = filename;
	}
}

class wpis
{
	constructor(imie, oddzial, time, opis, nrtel, newtime, comment, filename, folder)
	{
		this.imie = imie;
		this.oddzial = oddzial;
		this.opis = opis;
		this.time = time;
		this.nrtel = nrtel;
		this.newtime = newtime;
		this.comment = comment;
		this.filename = filename;
		this.folder = folder;
	}
}

class przyklad 
{
	constructor(nazwa, blad, rozwiazanie)
	{
		this.nazwa = nazwa;
		this.blad = blad;
		this.rozwiazanie = rozwiazanie;
	}
}