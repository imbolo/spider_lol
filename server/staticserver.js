var fs = require('fs')
,	path = require('path')
,	config = require('./config')
,	mime = require('./mime').types;

module.exports = function(filename, req, res) {
	filename = filename.replace(/\.\./g, "");
	fs.exists(filename, function(exists) {
		if (exists) {
			fs.readFile(filename, 'utf8', function(err, data) {
				if (err) {
					res.writeHead(500);
					res.write("Server Error");
					res.end();
				}
				else {
					
					fs.stat(filename, function (err, stat) {
					    var lastModified = stat.mtime.toUTCString();
						if (req.headers['if-modified-since'] && lastModified == req.headers['if-modified-since']) {
						    res.writeHead(304, "Not Modified");
						    res.end();
						}
						else {
						    res.setHeader("Last-Modified", lastModified);
							var expires = new Date();
							expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
							res.setHeader("Expires", expires.toUTCString());
							res.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);
							
							var ext = path.extname(filename);
							ext = ext ? ext.slice(1) : 'unknown';
							var contentType = mime[ext] || "text/plain";
							res.writeHead(200, {'Content-Type': contentType});
							
							res.write(data);
							res.end();
						}
					  
					});
					
				}
			});
		}
		else {
			res.writeHead(404);
			res.write("File not found");
			res.end();
		}
	});
	
}