const express = require('express')
const app = express()

const pg = require("pg");
const connectionString = "pg://maryashton@localhost:5432/puppies";

var bodyParser = require('body-parser');

app.use(bodyParser());

app.get('/', function (req, res) {
  res.send('Hello World!')
})

// GET ALL PUPPIES
app.get('/puppies', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM pups ORDER BY id ASC;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

// GET SPECIFIC PUPPY

// ADD NEW PUPPY

// UPDATE PUPPY

// DELETE

