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
			res.redirect('/admin');
		} else {
			res.sendFile(__dirname + '/home.html');
		}
	} else {
		res.redirect('/');
    }
});

app.get('/admin', (req, res) => {
	if (req.session.loggedin) {
		if (req.session.lvl > 1) {
			res.sendFile(__dirname + '/admin.html');
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
				res.redirect('/');
			}
		});
	} else {
		res.redirect('/');
	}
});

io.on('connection', (socket) => {
	const session = socket.request.session;
	//logs(session.username);

	socket.on('ticket', (imie, dzial, tresc, nrtel) => {
		var teraz = parseTime(new Date());
		var sql = "INSERT INTO tickets (imie, dzial, tresc, nrtel, data) VALUES ('" + imie + "', '" + dzial + "', '" + tresc + "', '" + nrtel + "','" + teraz + "')";
		con.query(sql, function (err, result) {
			if (err) throw err;
			logs("ticket inserted");
			//io.emit('ticketread', JSON.stringify(ticket(imie, dzial, tresc, nrtel, teraz)));
		});
	});

	socket.on('test', () => {
		logs('test home');
	});
});

http.listen(port, () => {
	
});

function parseTime(d)
{
	var time = new Date(d);
	var M = time.getMonth() + 1;
	if (M < 10)
		M = "0" + M;
	var D = time.getDate();
	if (D < 10)
		D = "0" + D;
	var h = time.getHours();
	if (h < 10)
		h = "0" + h;
	var m = time.getMinutes();
	if (m < 10)
		m = "0" + m;
	var s = time.getSeconds();
	if (s < 10)
		s = "0" + s;
	return time.getFullYear() + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
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