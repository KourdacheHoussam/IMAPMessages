

$(document).ready(function() { 
// On se connecte au serveur
var socket = io.connect('http://localhost:1337');

	// On demande le nom des boites
	// Il faudrait peut etre d'abord faire un formulaire pour se connecter à la boite mail que l'on souhaite
	// Plutot que d'écrire le mdp et l'adresse directement dans le server
	socket.emit('ask');

	// Un evenement newMailBox nous envoie un tableau d'objets Mailbox
	socket.on('newMailBox',function(vari){
		// On liste les mailboxes dans le div #boites
		for (var key in vari){
			if(vari[key].disabled != true){
				$("#boites").append("<div id=\"" + vari[key].path + "\">" + vari[key].name+"</div><br />");
			}
		}
	});

	// Un evenement newMAil nous envoie un tableau d'objets Messages
	socket.on('newMail',function(vari){
		console.log(vari);
		// On vide le div messages
		$("#messages").empty();
		// On liste les messages
		for (var key in vari){
			$("#messages").append(vari[key].title+"<br />");
		}
	});

	// Lorsque l'on clique sur un div correspondant a une boite, on envoie un evenement qui demande de lister les messages de la dite boite.
	$("#boites").on('click',"div", function(){
		socket.emit('listMails',this.id);
	});

});
