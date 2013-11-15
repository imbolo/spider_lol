var 
http = require('http'),
qs = require('querystring'),
url = require('url'),
routes = require('./routes'),
staticserver = require('./staticserver');
	
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
		var fileName = __dirname+parsedUrl.pathname;
		console.log("read file:"+fileName);
		staticserver(fileName, req, res);		
	}

}