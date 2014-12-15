var express = require("express");
var path = require("path");
 
var app = express();
app.use(express.static(path.join(__dirname)));
app.listen(8000);

var message = {};

function messageIsEmpty () {
	for (var key in message) {
		return false;
	}

	return true;
}

function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain).get("/submit", function (req, res) {
	
	message = {
		website: req.query.website,
		channel: req.query.channel,
		url: req.query.url,
		detail: req.query.detail
	}

	console.log(message);

	res.send({
		code: 200
	})
});

app.use(allowCrossDomain).get("/message", function (req, res) {

	if (!messageIsEmpty()) {
		res.send(message);
		message = {};
	} else {
		res.send({});
	}
})