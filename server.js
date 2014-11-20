var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, {log:true});

console.log('Server ready');

var folders = {};
var mails = {};

var mail = function mail(dt,sb,fr,t){
	this.date = dt;
	this.subject = sb;
	this.from = fr;
	this.to = t
}

var socket;

var getted;

io.sockets.on('connection', function (so) {

	socket = so;

	if(getted){
		socket.emit('connected', { content : folders  });
	}
});

var Imap = require('imap'),
	inspect = require('util').inspect;

var imap = new Imap({
	user: 'pnom25446@gmail.com',
	password: 'kangourou17',
	host: 'imap.gmail.com',
	port: 993,
	tls: true
});

imap.once('end', function(){
	getted = true;
	if(socket != undefined){
		socket.emit('connected', { content : folders  });
	}
});

imap.once('ready', function (){
	imap.getBoxes(function more(err, boxes, path) {
		if (!path)path = '';
		for (var key in boxes){
			folders[key] = new Array();
			if (boxes[key].children) {
				more(undefined, 
					boxes[key].children, 
					path + key + boxes[key].delimiter);
			} else {
				imap.openBox(path + key, true, function (err, box){
	
					var f = imap.seq.fetch(box.messages.total + '*', {  
						bodies:'HEADER.FIELDS (FROM TO SUBJECT DATE)'
					});

					f.on('message', function (msg, seqno){
						msg.on('body', function (stream, info){
							var buffer = '';
							stream.on('data', function(chunk) {
								buffer += chunk.toString('utf8');
							});
							stream.once('end', function() {
								//var header = inspect(Imap.parseHeader(buffer));
								var header = Imap.parseHeader(buffer);
								folders[key].push(new mail(header.date, header.subject, header.from, header.to));

							});

						});
						msg.once('end', function (){
							getted = true;
							//							console.log(seqno + 'Finished');
						});
					});
					f.once('error', function (err){
						//	console.log("Fetch error[" + key + "]: " + err);
					});
					f.once('end', function (){
						//						console.log('Done fetching all messages!');
					
						imap.end();
					});
				});
			}
		}
	});
});

imap.connect();
server.listen(8080);

