var http = require('http');
var url = require('url');
var pg = require("pg");

var conString = "pg://maryashton@localhost:5432/puppies";

var client = new pg.Client(conString);
client.connect();

http.createServer(function (req, res) {

  res.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'});
  var purl=url.parse(req.url,true);

  if(purl.pathname=='/test')
  	res.end('Test');
  else
	var query = client.query("SELECT * from pups ORDER BY id ASC");
	query.on("row", function (row, result) {
	    result.addRow(row);
	});
	query.on("end", function (result) {
	    console.log(JSON.stringify(result.rows, null, "    "));
	    res.end(JSON.stringify(result.rows));
	    // client.end();
	});
  
}).listen(3111);
console.log('Server running at http://127.0.0.1:3111/');

