var 
http = require('http'),
qs = require('querystring'),
url = require('url'),
routes = require('./routes');
	
http.createServer(handleRequest).listen(3000);

function handleRequest(req, res) {
	var parsedUrl = url.parse(req.url);
	console.log(req.method);
	console.log(parsedUrl.pathname);
	var handle = routes[parsedUrl.pathname];
	if (!!handle == true) {
		var params = qs.parse(parsedUrl.query);
		console.log(params);
		req.params = params;
		handle(req, res);
	}
	else {
		res.writeHead(500);
		res.write("unvaliable path name");
		res.end();
	}

}