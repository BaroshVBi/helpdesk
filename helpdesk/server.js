var path = require('path');
var express = require('express');
var session = require('express-session');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var config = require("./config.json");
var bcrypt = require('bcrypt');

var port = config.server.port;
var valid_email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

var con = mysql.createConnection({
	host: config.mysql.host,
	port: config.mysql.port,
	user: config.mysql.user,
	password: config.mysql.password,
	database: config.mysql.database
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
		sql = "SELECT * FROM login WHERE email ='" + email + "'";
		con.query(sql, function (err, result) {
			if (err) throw err;
			if (result.length > 0) {
				bcrypt.compare(password, result[0].password, function (err, result2) {
					if (result2) {
						req.session.loggedin = true;
						req.session.username = email;
						req.session.name = result[0].name;
						req.session.user_id = result[0].id;
						req.session.lvl = result[0].lvl;
						req.session.pg = 0;
						req.session.current_ticket = 0;
						res.redirect('/home');
						logs(result[0].name + " has logged in.");
					} else {
						res.send('Nieprawidłowa nazwa użytkownika lub hasło.');
					}
				});
			} else {
				res.send('Nieprawidłowa nazwa użytkownika lub hasło.');
			}
		});
	} else {
		res.send('Wprowadź dane logowania.');
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

	if (session.loggedin) {
		var configtab = ['config_priority', 'config_status', 'config_dept'];
		for (var i = 0; i < configtab.length; i++) {
			(function (i) {
				var sql = "SELECT * FROM " + configtab[i];
				con.query(sql, function (err, result) {
					if (err) throw err;
					for (var j = 0; j < result.length; j++) {
						io.to(socket.id).emit(configtab[i], result[j].id, result[j].value, result.length);
                    }
				});
			}(i));
		}
    }

	socket.on('ticket', (topic, desc, priority) => {
		if (session.loggedin) {
			if (topic && desc && priority) {
				var sql = "INSERT INTO tickets (login_id, topic, descr, data, priority) VALUES ('" + session.user_id + "', '" + topic + "', '" + desc + "', '" + parseTime(new Date()) + "', '" + priority + "')";
				con.query(sql, function (err, result) {
					if (err) throw err;
					logs("ticket inserted");
				});
			} else { io.to(socket.id).emit('server_response', 9); }
		}
	});

	socket.on('next_page', (pg, asc) => {
		if (session.loggedin) {
			switch (asc) {
				case 0:
					var sql = "SELECT * FROM tickets WHERE login_id = '" + session.user_id + "'";
					break;
				case 1:
					var sql = "SELECT * FROM tickets WHERE login_id = '" + session.user_id + "' ORDER BY tickets.id DESC";
					break;
				case -1:
					var sql = "SELECT * FROM tickets WHERE login_id = '" + session.user_id + "' ORDER BY tickets.id ASC";
					break;
				case 2:
					var sql = "SELECT * FROM tickets WHERE login_id = '" + session.user_id + "' ORDER BY tickets.topic DESC";
					break;
				case -2:
					var sql = "SELECT * FROM tickets WHERE login_id = '" + session.user_id + "' ORDER BY tickets.topic ASC";
					break;
				case 3:
					var sql = "SELECT * FROM tickets WHERE login_id = '" + session.user_id + "' ORDER BY tickets.data DESC";
					break;
				case -3:
					var sql = "SELECT * FROM tickets WHERE login_id = '" + session.user_id + "' ORDER BY tickets.data ASC";
					break;
				case 4:
					var sql = "SELECT * FROM tickets WHERE login_id = '" + session.user_id + "' ORDER BY tickets.status DESC";
					break;
				case -4:
					var sql = "SELECT * FROM tickets WHERE login_id = '" + session.user_id + "' ORDER BY tickets.status ASC";
					break;
				case 5:
					var sql = "SELECT * FROM tickets WHERE login_id = '" + session.user_id + "' ORDER BY tickets.priority DESC";
					break;
				case -5:
					var sql = "SELECT * FROM tickets WHERE login_id = '" + session.user_id + "' ORDER BY tickets.priority ASC";
					break;
				default:
					var sql = "SELECT * FROM tickets WHERE login_id = '" + session.user_id + "'";
			}
			session.current_ticket = 0;
			con.query(sql, function (err, result) {
				if (err) throw err;
				if (result.length > 0) {
					if (pg == 0) {
						session.pg = 0;
					}
					else {
						session.pg += pg;
						if (session.pg < 0) session.pg = 0;
						if (session.pg > ((result.length - 1) / 10)) session.pg = Math.floor((result.length - 1) / 10);
					}
					var x = 0;
					var top = result.length - 1 - (10 * session.pg);
					for (var i = top; i >= 0 && x < 10; i--) {
						io.to(socket.id).emit('list_ticket', result[i].id, result[i].topic, parseTime(result[i].data), result[i].status, result[i].priority);
						x += 1;
					}
				}
			});
		}
	});

	socket.on('next_page_admin', (pg, asc) => {
		if (session.loggedin && session.lvl == 2) {
			switch (asc) {
				case 0:
					var sql = "SELECT * FROM tickets";
					break;
				case 1:
					var sql = "SELECT * FROM tickets ORDER BY tickets.id DESC";
					break;
				case -1:
					var sql = "SELECT * FROM tickets ORDER BY tickets.id ASC";
					break;
				case 2:
					var sql = "SELECT * FROM tickets ORDER BY tickets.topic DESC";
					break;
				case -2:
					var sql = "SELECT * FROM tickets ORDER BY tickets.topic ASC";
					break;
				case 3:
					var sql = "SELECT * FROM tickets ORDER BY tickets.data DESC";
					break;
				case -3:
					var sql = "SELECT * FROM tickets ORDER BY tickets.data ASC";
					break;
				case 4:
					var sql = "SELECT * FROM tickets ORDER BY tickets.status DESC";
					break;
				case -4:
					var sql = "SELECT * FROM tickets ORDER BY tickets.status ASC";
					break;
				case 5:
					var sql = "SELECT * FROM tickets ORDER BY tickets.priority DESC";
					break;
				case -5:
					var sql = "SELECT * FROM tickets ORDER BY tickets.priority ASC";
					break;
				default:
					var sql = "SELECT * FROM tickets";
			}
			session.current_ticket = 0;
			con.query(sql, function (err, result) {
				if (err) throw err;
				if (result.length > 0) {
					if (pg == 0) {
						session.pg = 0;
					}
					else {
						session.pg += pg;
						if (session.pg < 0) session.pg = 0;
						if (session.pg > ((result.length - 1) / 10)) session.pg = Math.floor((result.length - 1) / 10);
					}
					var x = 0;
					var top = result.length - 1 - (10 * session.pg);
					for (var i = top; i >= 0 && x < 10; i--) {
						io.to(socket.id).emit('list_ticket_admin', result[i].id, result[i].topic, parseTime(result[i].data), result[i].status, result[i].priority);
						x += 1;
					}
				}
			});
		}
	});

	socket.on('view_ticket', (id) => {
		if (session.loggedin) {
			var sql = "SELECT * FROM `tickets` WHERE id = '" + id + "'";
			con.query(sql, function (err, result) {
				if (err) throw err;
				if (result.length > 0) {
					var sql = "SELECT name, dept FROM `login` WHERE id = '" + result[0].login_id + "'";
					con.query(sql, function (err, result2) {
						if (err) throw err;
						if (result2.length > 0) {
							io.to(socket.id).emit('ticket_data', result[0].id, result[0].topic, result[0].descr, parseTime(result[0].data), result[0].status, result[0].priority, result2[0].name, result2[0].dept);
							session.current_ticket = result[0].id;
							commentData(id);
						}
					});
				}
			});
		}
	});

	socket.on('delete_ticket', () => {
		if (session.loggedin && session.lvl == 2) {
			var sql = "DELETE FROM tickets WHERE tickets.id = " + session.current_ticket;
			con.query(sql, function (err, result) {
				if (err) throw err;
				logs("ticket deleted");
				io.to(socket.id).emit('server_response', 6);
			});
        }
	});

	socket.on('add_comment', (com) => {
		if (session.loggedin) {
			if (com) {
				var sql = "INSERT INTO comment (com, login_id, ticket_id, data) VALUES ('" + com + "', '" + session.user_id + "', '" + session.current_ticket + "', '" + parseTime(new Date()) + "')";
				con.query(sql, function (err, result) {
					if (err) throw err;
					logs("comment inserted");
					io.to(socket.id).emit('server_response', 5);
				});
			}
		}
	});

	socket.on('send_edit', (priority, status) => {
		if (session.loggedin && session.lvl == 2) {
			var sql = "UPDATE tickets SET status = '" + status + "', priority = '" + priority + "' WHERE tickets.id =" + session.current_ticket;
			con.query(sql, function (err, result) {
				if (err) throw err;
				logs("ticket edited");
			});
		}
	});

	socket.on('save_priority', (id, val) => {
		if (session.loggedin && session.lvl == 2) {
			if (val != '' && val != null) {
				var sql = "UPDATE config_priority SET value = '" + val + "' WHERE config_priority.id = " + id;
				con.query(sql, function (err, result) {
					if (err) throw err;
					logs("updated priority");
					updateConfig();
				});
			}
        }
	});

	socket.on('add_priority', (val) => {
		if (session.loggedin && session.lvl == 2) {
			if (val != '' && val != null) {
				var sql = "INSERT INTO config_priority (value) VALUES ('" + val + "')";
				con.query(sql, function (err, result) {
					if (err) throw err;
					logs("added priority");
					updateConfig();
				});
			}
		}
	});

	socket.on('delete_priority', (id) => {
		if (session.loggedin && session.lvl == 2) {
			var sql = "DELETE FROM config_priority WHERE config_priority.id =" + id;
			con.query(sql, function (err, result) {
				if (err) throw err;
				logs("deleted priority");
				updateConfig();
			});
		}
	});

	socket.on('save_status', (id, val) => {
		if (session.loggedin && session.lvl == 2) {
			if (val != '' && val != null) {
				var sql = "UPDATE config_status SET value = '" + val + "' WHERE config_status.id = " + id;
				con.query(sql, function (err, result) {
					if (err) throw err;
					logs("updated status");
					updateConfig();
				});
			}
		}
	});

	socket.on('add_status', (val) => {
		if (session.loggedin && session.lvl == 2) {
			if (val != '' && val != null) {
				var sql = "INSERT INTO config_status (value) VALUES ('" + val + "')";
				con.query(sql, function (err, result) {
					if (err) throw err;
					logs("added status");
					updateConfig();
				});
			}
		}
	});

	socket.on('delete_status', (id) => {
		if (session.loggedin && session.lvl == 2) {
			var sql = "DELETE FROM config_status WHERE config_status.id =" + id;
			con.query(sql, function (err, result) {
				if (err) throw err;
				logs("deleted status");
				updateConfig();
			});
		}
	});

	socket.on('save_dept', (id, val) => {
		if (session.loggedin && session.lvl == 2) {
			if (val != '' && val != null) {
				var sql = "UPDATE config_dept SET value = '" + val + "' WHERE config_dept.id = " + id;
				con.query(sql, function (err, result) {
					if (err) throw err;
					logs("updated dept");
					updateConfig();
				});
			}
		}
	});

	socket.on('add_dept', (val) => {
		if (session.loggedin && session.lvl == 2) {
			if (val != '' && val != null) {
				var sql = "INSERT INTO config_dept (value) VALUES ('" + val + "')";
				con.query(sql, function (err, result) {
					if (err) throw err;
					logs("added dept");
					updateConfig();
				});
			}
		}
	});

	socket.on('delete_dept', (id) => {
		if (session.loggedin && session.lvl == 2) {
			var sql = "DELETE FROM config_dept WHERE config_dept.id =" + id;
			con.query(sql, function (err, result) {
				if (err) throw err;
				logs("deleted dept");
				updateConfig();
			});
		}
	});

	socket.on('add_user', (user_name, user_email, user_pass, user_dept, user_lvl) => {
		if (session.loggedin && session.lvl == 2) {
			if (user_name && user_email.match(valid_email) && user_pass) {
				var sql = "SELECT email FROM login WHERE login.email = '" + user_email + "'";
				con.query(sql, function (err, result) {
					if (err) throw err;
					if (result.length > 0) {
						io.to(socket.id).emit('server_response', 7);
					}
					else {
						bcrypt.hash(user_pass, 10, function (err, hash) {
							var sql = "INSERT INTO login (name, email, password, lvl, dept) VALUES ('" + user_name + "', '" + user_email + "', '" + hash + "', '" + user_dept + "', '" + user_lvl + "')";
							con.query(sql, function (err, result2) {
								if (err) throw err;
								logs("added user");
								io.to(socket.id).emit('server_response', 0);
							});
						});
					}
				});
			}
			else {
				io.to(socket.id).emit('server_response', 1);
			}
		}
	});

	socket.on('fetch_user_list', () => {
		if (session.loggedin && session.lvl == 2) {
			var sql = "SELECT id, name, email, lvl, dept FROM login";
			con.query(sql, function (err, result) {
				if (err) throw err;
				for (var i = 0; i < result.length; i++) {
					io.to(socket.id).emit('user_list', result[i].id, result[i].name, result[i].email, result[i].lvl, result[i].dept);
                }
			});
		}
	});

	socket.on('view_user', (id) => {
		if (session.loggedin && session.lvl == 2) {
			var sql = "SELECT id, name, email, lvl, dept FROM login WHERE login.id = " + id;
			con.query(sql, function (err, result) {
				if (err) throw err;
				if (result.length > 0) {
					io.to(socket.id).emit('user_data', result[0].id, result[0].name, result[0].email, result[0].lvl, result[0].dept);
				}
			});
		}
	});

	socket.on('delete_user', (id) => {
		if (session.loggedin && session.lvl == 2) {
			var sql = "DELETE FROM login WHERE login.id = " + id;
			con.query(sql, function (err, result) {
				if (err) throw err;
				logs("deleted user");
				io.to(socket.id).emit('server_response', 2);
			});
		}
	});

	socket.on('edit_user', (id, name, email, dept, lvl) => {
		if (session.loggedin && session.lvl == 2) {
			if (name) {
				var sql = "UPDATE login SET name='" + name + "' WHERE login.id = " + id;
				con.query(sql, function (err, result) {
					if (err) throw err;
				});
			}
			if (email) {
				var sql = "UPDATE login SET email='" + email + "' WHERE login.id = " + id;
				con.query(sql, function (err, result) {
					if (err) throw err;
				});
			}
			if (dept) {
				var sql = "UPDATE login SET dept='" + dept + "' WHERE login.id = " + id;
				con.query(sql, function (err, result) {
					if (err) throw err;
				});
			}
			if (lvl) {
				var sql = "UPDATE login SET lvl='" + lvl + "' WHERE login.id = " + id;
				con.query(sql, function (err, result) {
					if (err) throw err;
				});
			}
			io.to(socket.id).emit('server_response', 3);
		}
	});

	socket.on('edit_user_password', (id, pass1, pass2) => {
		if (session.loggedin && session.lvl == 2) {
			if (pass1 && pass2) {
				if (pass1 == pass2) {
					bcrypt.hash(pass1, 10, function (err, hash) {
						var sql = "UPDATE login SET password='" + hash + "' WHERE login.id = " + id;
						con.query(sql, function (err, result) {
							if (err) throw err;
							logs('password changed');
							io.to(socket.id).emit('server_response', 4);
						});
					});
				} else { io.to(socket.id).emit('server_response', 8); }
			} else { io.to(socket.id).emit('server_response', 9); }
		}
	});

	socket.on('edit_password', (pass_old, pass1, pass2) => {
		if (session.loggedin) {
			if (pass_old && pass1 && pass2) {
				if (pass1 == pass2) {
					sql = "SELECT password FROM login WHERE login.id ='" + session.user_id + "'";
					con.query(sql, function (err, result) {
						if (err) throw err;
						if (result.length > 0) {
							bcrypt.compare(pass_old, result[0].password, function (err, result2) {
								if (err) { logs('wrong password'); }
								if (result2) {
									bcrypt.hash(pass1, 10, function (err, hash) {
										var sql = "UPDATE login SET password='" + hash + "' WHERE login.id = " + session.user_id;
										con.query(sql, function (err, result) {
											if (err) throw err;
											logs('password changed');
											io.to(socket.id).emit('server_response', 4);
										});
									});
								}
							});
						}
					});
				} else { io.to(socket.id).emit('server_response', 8); }
			} else { io.to(socket.id).emit('server_response', 9); }
		}
	});

	function commentData(id) {
		var sql = "SELECT * From comment WHERE ticket_id = '" + id + "'";
		con.query(sql, function (err, result) {
			if (err) throw err;
			if (result.length > 0) {
				for (var i = 0; i < result.length; i++) {
					(function (resi) {
						var sql = "SELECT name From login WHERE id = '" + result[resi].login_id + "'";
						con.query(sql, function (err, result2) {
							if (err) throw err;
							io.to(socket.id).emit('comment_data', result[resi].com, result2[0].name, parseTime(result[resi].data));
						});
					})(i);
				}
			}
		});
	}

	function updateConfig() {
		var configtab = ['config_priority', 'config_status', 'config_dept'];
		io.emit('clean_config');
		for (var i = 0; i < configtab.length; i++) {
			(function (i) {
				var sql = "SELECT * FROM " + configtab[i];
				con.query(sql, function (err, result) {
					if (err) throw err;
					for (var j = 0; j < result.length; j++) {
						io.emit(configtab[i], result[j].id, result[j].value, result.length);
					}
				});
			}(i));
		}
	}
});

http.listen(port, () => {
	
});

function parseTime(d) {
	var time = new Date(d);
	var M = time.getMonth() + 1;
	if (M < 10) M = "0" + M;
	var D = time.getDate();
	if (D < 10) D = "0" + D;
	var h = time.getHours();
	if (h < 10) h = "0" + h;
	var m = time.getMinutes();
	if (m < 10) m = "0" + m;
	var s = time.getSeconds();
	if (s < 10) s = "0" + s;
	return time.getFullYear() + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
}

function logs(string) {
	var logTime = "[" + parseTime(new Date()) + "]\t" + string;
	console.log(logTime);
	var sql = "INSERT INTO logs (data, tresc) VALUES ('" + parseTime(new Date()) + "','" + string + "')";
	con.query(sql, function (err, result) {
		if (err) throw err;
	});
}