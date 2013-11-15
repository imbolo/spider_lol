function SpAjax() {
}

/**
* param arg1=x&arg2=y
* */
SpAjax.prototype.getJSON = function(url, param, callback) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			try {
				var json = JSON.parse(xmlhttp.responseText);
				callback(json);
			} catch (err) {
				console.log(err);
			}		
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send(param);
}