// Pour se connecter au serveur
var http = require("http");
// Pour utiliser JQuery avec nodejs
var $ = require('jquery');

// Lancement du serveur
httpServer = http.createServer(function(req,res){});
// Sur 1337
httpServer.listen(1337);

// Pour utiliser imap
var inbox = require("inbox");

// On se connecte à la boite
// Les fonctions suivantes fonctionnent sous gmail 
var client = inbox.createConnection(false, "imap.gmail.com", {
	secureConnection: true,
	auth:{
		user: "pnom25446@gmail.com",
		pass: "kangourou17"
	}
});

// Pour utiliser les sockets
var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', function(socket){

	socket.on('ask', function(socket2){
		client.connect();
		list_mailboxes(socket);
	});
	
	socket.on('listMails', function(box){
		list_messages(box, socket);
	});
});

function list_mailboxes(socket) 
{

	client.on("connect", function() {
		client.listMailboxes(function(err, mailboxes) {
			socket.emit('newMailBox', mailboxes);	
			for (var i in mailboxes) {
				if (mailboxes[i].hasChildren) {
					mailboxes[i].listChildren(function(err, childs) {
						socket.emit('newMailBox', childs);	
					});
				}
			}
		});
	});
}

function list_messages(mailbox, socket) 
{
console.log(mailbox);
		client.openMailbox(mailbox, function(error, info){
			if(error) throw error;
			else{
				client.listMessages(0, function(err, messages){
					socket.emit('newMail', messages);	
				});
			}
	});
}
