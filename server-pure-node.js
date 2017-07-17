var http = require('http');
var url = require('url');
var pg = require("pg");

var connectionString = "pg://maryashton@localhost:5432/puppies";

var client = new pg.Client(connectionString);
client.connect();

var query = client.query("SELECT * from pups ORDER BY id ASC");
query.on("row", function (row, result) {
    result.addRow(row);
});
query.on("end", function (result) {
    console.log(JSON.stringify(result.rows, null, "    "));
    client.end();
});


// UNCOMMENT BLOCK OUT BELOW
// THEN ADD ELSE CLAUSE THAT RETURNS THE ABOVE QUERY

// http.createServer(function (req, res) {

//   res.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'});
//   var purl=url.parse(req.url,true);

//   if(purl.pathname=='/test')
//   	res.end('Test');
  
// }).listen(3111);
// console.log('Server running at http://127.0.0.1:3111/');

