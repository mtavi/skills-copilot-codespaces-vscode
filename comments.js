//Create web server 

var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var comments = require('./comments');

var server = http.createServer(function(req, res) {
	var urlPath = url.parse(req.url).pathname;
	
	if(urlPath === '/'){
		urlPath = '/index.html';
	}
	//console.log(urlPath);
	
	var filePath = path.join(__dirname, urlPath);
	
	fs.exists(filePath, function(exists) {
		if(exists) {
			fs.createReadStream(filePath).pipe(res);
		} else {
			res.statusCode = 404;
			res.end('Not Found');
		}
	});
});

var io = require('socket.io')(server);

io.on('connection', function(socket) {
	socket.on('comment', function(comment) {
		comments.add(comment);
		io.emit('comments', comments.all());
	});
});

server.listen(3000);
console.log('Server is running on port 3000');