var path = require('path');
var express = require('express');
var session = require('express-session');
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
	logs("Database connected!");
});

const sessionMiddleware = session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
});

app.use(sessionMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/images')));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/login.html');
});

app.post('/auth', (req, res) => {
	let email = req.body.email;
	let password = req.body.password;

	if (email && password) {
		sql = "SELECT * FROM login WHERE email ='" + email + "'  AND password = '" + password + "'";
		con.query(sql, function (err, result) {
			if (err) throw err;
			if (result.length > 0) {
				req.session.loggedin = true;
				req.session.username = email;
				req.session.user_id = result[0].id;
				req.session.lvl = result[0].lvl;
				res.redirect('/home');
				logs(result[0].name + " has logged in.");
			} else {
				res.send('Nieprawidłowa nazwa użytkownika lub hasło.');
			}
			res.end();
		});
	} else {
		res.send('Wprowadź dane logowania.');
		res.end();
	}
});

app.get('/home', (req, res) => {
	if (req.session.loggedin) {
		if (req.session.lvl > 1) {
			res.redirect('/read');
		} else {
			res.sendFile(__dirname + '/home.html');
		}
	} else {
		res.redirect('/');
    }
});

app.get('/read', (req, res) => {
	if (req.session.loggedin) {
		if (req.session.lvl > 1) {
			res.sendFile(__dirname + '/read.html');
		} else {
			res.redirect('/home');
		}
	} else {
		res.redirect('/');
	}
});

app.get('/logout', (req, res) => {
	if (req.session) {
		req.session.destroy((err) => {
			if (err) {
				res.status(400).send('Błąd przy wylogowaniu');
			} else {
				//res.send('Logout successful');
				logs(req.session.username + 'has log out');
				res.redirect('/');
			}
		});
	} else {
		res.redirect('/');
	}
});

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));

io.use((socket, next) => {
	const session = socket.request.session;
	if (session && session.loggedin) {
		next();
	} else {
		next(new Error("unauthorized"));
	}
});

io.on('connection', (socket) => {
	const session = socket.request.session;
	//logs(session.id);
	//logs(session.username);
	socket.on('ticket', (imie, dzial, tresc, nrtel) => {
		var teraz = parseTime(new Date());
		var sql = "INSERT INTO tickets (imie, dzial, tresc, nrtel, data) VALUES ('" + imie + "', '" + dzial + "', '" + tresc + "', '" + nrtel + "','" + teraz + "')";
		con.query(sql, function (err, result) {
			if (err) throw err;
			logs("ticket inserted");
			//io.emit('ticketread', JSON.stringify(ticket(imie, dzial, tresc, nrtel, teraz)));
		});
		//io.emit('ticketread', JSON.stringify(cos), idnum + '.txt');
	});

	socket.on('test', () => {
		logs('test home');
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
			//fs.unlinkSync('archiwum/tickets/' + filename);
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
		D = "0" + D;
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
	var logTime = "[" + parseTime(new Date()) + "]\t" + string;
	console.log(logTime);
	var sql = "INSERT INTO logs (data, tresc) VALUES ('" + parseTime(new Date()) + "','" + string + "')";
	con.query(sql, function (err, result) {
		if (err) throw err;
	});
}

class ticket
{
	constructor(imie, dzial, tresc, czas, nrtel)
	{
		this.imie = imie;
		this.dzial = dzial;
		this.tresc = tresc;
		this.czas = czas;
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