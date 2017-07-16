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
app.get('/puppies/:id', (req, res, next) => {
  const results = [];
  var pupID = parseInt(req.params.id);
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM pups WHERE id = $1', [pupID]);
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

// ADD NEW PUPPY
app.post('/puppies/add', (req, res, next) => {
  const results = [];
  console.log('what is my req', req.body)
  // Grab data from http request - if we have time we'll wire this up to an angular form 
  const data = {name: req.body.name, breed: req.body.breed, age: req.body.age, sex: req.body.sex, photo: req.body.photo};

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO pups(name, breed, age, sex, photo) values($1, $2, $3, $4, $5)',
    [data.name, data.breed, data.age, data.sex, data.photo]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM pups ORDER BY id ASC');
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

// UPDATE PUPPY
app.put('/puppies/update/:id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const pupID = req.params.id;
  // Grab data from http request
  const data = {name: req.body.name, breed: req.body.breed, age: req.body.age, sex: req.body.sex, photo: req.body.photo};

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Update Data
    client.query('UPDATE pups SET name=($1), breed=($2), age=($3), sex=($4), photo=($5) WHERE id=($6)',
    [data.name, data.breed, data.age, data.sex, data.photo, pupID]);
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM pups ORDER BY id ASC");
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});

// DELETE
app.delete('/puppies/delete/:id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const pupID = req.params.id;
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Delete Data
    client.query('DELETE FROM pups WHERE id=($1)', [pupID]);
    // SQL Query > Select Data
    var query = client.query('SELECT * FROM pups ORDER BY id ASC');
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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
