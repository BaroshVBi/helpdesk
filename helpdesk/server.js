var path = require('path');
var express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var fs = require('fs');
var nodemailer = require('nodemailer');
var mysql = require('mysql');

var port = process.env.PORT || 8080;

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	database: "helpdesk"
});

con.connect(function (err) {
	if (err) throw err;
	logs("Connected!");
});

var logFile = 'log ' + parseTime(new Date()) + '.txt';
fs.writeFile("archiwum/logs/" + logFile, '', function(err) {
	logs(logFile + ' został utworzony');
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/read', (req, res) => {
	res.sendFile(__dirname + '/read.html');
});

io.on('connection', (socket) => {
	logs(socket.id);
	socket.on('ticket', (imie, dzial, tresc, nrtel) => {
		var sql = "INSERT INTO tickets (imie, dzial, tresc, nrtel, data) VALUES ('" + imie + "', '" + dzial + "', '" + tresc + "', '" + nrtel + "','" + parseTime(new Date()) + "')";
		logs(sql);
		con.query(sql, function (err, result) {
			if (err) throw err;
			logs(parseTime(new Date()));
			logs("1 ticket inserted");
		});
		
		//logs('Utworzono nowy ticket: ' + idnum);
		//io.emit('ticketread', JSON.stringify(cos), idnum + '.txt');
	});

	socket.on('login', () => {
		fs.readdir('archiwum/tickets', (err, files) => {
			files.forEach(file => {
				var text = fs.readFileSync("archiwum/tickets/" + file, 'utf-8');
				io.to(socket.id).emit('ticketread', text, file);
			});
		});
		
		fs.readdir('archiwum/current', (err, files) => {
			files.forEach(file => {
				var text = fs.readFileSync("archiwum/current/" + file, 'utf-8');
				io.to(socket.id).emit('archiwumread', text, file);
			});
		});
		
		fs.readdir('archiwum/previous', (err, files) => {
			files.forEach(file => {
				io.to(socket.id).emit('miesiacread', file);
			});
		});
	});
	
	socket.on('delete', function(filename) {
		fs.unlinkSync('archiwum/tickets/' + filename);
		socket.broadcast.emit('deleted', filename);
		logs('Usunięto ticket: ' + filename);
	});
	
	socket.on('deleteP', function(filename) {
		fs.unlinkSync('archiwum/przyklady/' + filename);
		socket.broadcast.emit('deletedP', filename);
		logs('Usunięto przykład: ' + filename);
	});
	
	socket.on('move', function(filename, comment) {
		
		if (comment == '')
			comment = 'Wykonano.';
		var text = fs.readFileSync("archiwum/tickets/" + filename, 'utf-8');
		text = JSON.parse(text);
		var archiv = new wpis(text.imie, text.oddzial, text.opis, text.time, text.nrtel, comment);
		fs.writeFile('archiwum/current/' + parseTime(archiv.newtime) + " " + filename, JSON.stringify(archiv), function(err) {
			if (err) throw err;
			logs('Ticket: ' + filename + ' zostal przeniesiony do archiwum');
			io.emit('archiwumread', JSON.stringify(archiv), archiv.newtime + '.txt');
//			fs.unlinkSync('archiwum/tickets/' + filename);
			socket.broadcast.emit('deleted', filename);
		});
	});
	
	socket.on('przyklad', function(nazwa, blad, rozwiazanie) {
		if (nazwa != '' && blad != '' && rozwiazanie != '')
		{
			var k = 0;
			fs.readdir('archiwum/przyklady', (err, files) => {
				files.forEach(file => {
					if(nazwa + '.txt' == file)
						k++;
				});
				if (k > 0)
				{
					io.to(socket.id).emit('przykladcheck', 0);
				}
				else
				{
					io.to(socket.id).emit('przykladcheck', 1);
					var text = new przyklad(nazwa, blad, rozwiazanie);
					logs('Utworzono nowy przykład: ' + nazwa);
					fs.writeFile('archiwum/przyklady/' + nazwa + '.txt', JSON.stringify(text), function(err) {
						if (err) throw err;
						io.emit('przykladyread', JSON.stringify(text), nazwa + '.txt');
					});
				}
			});
		}
	});
	
	socket.on('przykladedit', function(nazwa, blad, rozwiazanie, oldname) {
		var oldtext = fs.readFileSync("archiwum/przyklady/" + oldname + '.txt', 'utf-8');
		fs.unlink('archiwum/przyklady/' + oldname + '.txt', function(err) {
			if (err) 
			{
				console.log(err);
			}
			var k = 0;
			fs.readdir('archiwum/przyklady', (err, files) => {
				files.forEach(file => {
					if(nazwa + '.txt' == file)
						k++;
				});
				if (k > 0)
				{
					io.to(socket.id).emit('przykladcheck', 0);
					fs.writeFileSync("archiwum/przyklady/" + oldname + '.txt', oldtext);
				}
				else
				{
					io.emit('deletedP', oldname + '.txt');
					io.to(socket.id).emit('przykladcheck', 1);
					var text = new przyklad(nazwa, blad, rozwiazanie);
					logs('Edytowano przyklad: ' + nazwa);
					fs.writeFile('archiwum/przyklady/' + nazwa + '.txt', JSON.stringify(text), function(err) {
						if (err) throw err;
						io.emit('przykladyread', JSON.stringify(text), nazwa + '.txt');
					});
				}
			});
		});
	});
	
	socket.on('give', function() {
		fs.readdir('archiwum/przyklady', (err, files) => {
			files.forEach(file => {
				var text = fs.readFileSync("archiwum/przyklady/" + file, 'utf-8');
				io.to(socket.id).emit('przykladyread', text, file);
			});
		});
	});
	
	socket.on('giveM', function(name) {
		fs.readdir('archiwum/previous/' + name, (err, files) => {
			files.forEach(file => {
				var text = fs.readFileSync("archiwum/previous/" + name + "/" + file, 'utf-8');
				io.to(socket.id).emit('Mread', text, file, name);
			});
		});
	});
	
	socket.on('delcom', function(filename, com, folder) {
		if (folder == 'current')
			var path = 'archiwum/current/' + filename;
		else
			var path = 'archiwum/previous/' + folder + '/' + filename;
		var text = fs.readFileSync(path);
		text = JSON.parse(text);
		for(i = 0; i < text.comment.length; i++)
		{
			if (text.comment[i] == com)
			{
				text.comment.splice(i, 1);
				fs.writeFileSync(path, JSON.stringify(text));
				socket.broadcast.emit('comdeleted', filename, i);
				logs('Usunięto komentarz "' + com + '" z ' + filename);
				break;
			}
		}
	});
});

http.listen(port, () => {
	
});

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
	var D = time.getDate();
	if (D < 10)
		D = "0" + d;
	var s = time.getSeconds();
	if (s < 10)
		s = "0" + s;
	return time.getFullYear() + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
}

function organizeMIESIAC()
{
	fs.readdir('archiwum/current', (err, files) => {
		files.forEach(file => {
			var text = fs.readFileSync("archiwum/current/" + file, 'utf-8');
			var parsedText = JSON.parse(text);
			var g = new Date(parsedText.newtime);
			var m = g.getMonth() + 1;
			if (m < 10)
				var name = '0' + m + '-' + g.getFullYear();
			else
				var name = m + '-' + g.getFullYear();
			if (!fs.existsSync('archiwum/previous/' + name))
			{
				fs.mkdirSync('archiwum/previous/' + name);
			}
			fs.renameSync('archiwum/current/' + file, 'archiwum/previous/' + name + '/' + file);
		});
	});
}

function logs(string)
{
	var logTime = "[" + parseTime(new Date()) + "]\t" + string + ".";
	console.log(logTime);
}

class ticket
{
	constructor(imie, oddzial, opis, nrtel)
	{
		this.imie = imie;
		this.oddzial = oddzial;
		this.opis = opis;
		this.time = new Date();
		this.nrtel = nrtel;
	}
}

class wpis
{
	constructor(imie, oddzial, opis, time, nrtel, comment)
	{
		this.imie = imie;
		this.oddzial = oddzial;
		this.opis = opis;
		this.time = time;
		this.nrtel = nrtel;
		this.newtime = new Date();
		this.comment = [comment];
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