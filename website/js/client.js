
var socket;
var res;

function connect(){
	socket = io.connect('localhost:8080');

socket.on('connected', function(result)
		{
			$('#loading').hide();
			var content = window.document.getElementById("content");
			res = result.content;
			for(var folder in res){
				content.innerHTML += '<h3>'+folder+' (' + res[folder].length+')</h3>';
				for(var i = 0; i< res[folder].length;i++){
					var header = res[folder][i];
					content.innerHTML += nl2br("Date : " + header.date+"<br />");
					content.innerHTML += nl2br("Sujet : "+ header.subject+"<br />");
					content.innerHTML += nl2br("De : "+header.from);
					content.innerHTML += nl2br("à : "+header.to);
					content.innerHTML +="<br /><br />";
				}
				content.innerHTML +="<hr />";
				$("#content").show();
			}
		});
}


function nl2br (str, is_xhtml) {
	var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
	return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}
