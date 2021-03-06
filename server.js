var express = require("express");
var exphbs = require("express-handlebars");
var mysql = require("mysql");

var app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// var connection = mysql.createConnection({
//   host: "localhost",
//   port: 3306,
//   user: "root",
//   password: "root",
//   database: "burgers_db"
// });

var connection = mysql.createConnection({
  host: "us-cdbr-iron-east-04.cleardb.net",
  port: 3306,
  user: "b3e6a3911ff2a2",
  password: "2a26d43f",
  database: "heroku_84651f237e48fe4"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

app.get("/", function(req, res) {
  connection.query("SELECT * FROM burgers;", function(err, data) {
    if (err) {
      return res.status(500).end();
    }
    // console.log(data);
    res.render("index", { burgers: data });
  });
});

// Retrieve all movies
app.get("/api/burgers", function(req, res) {
  connection.query("SELECT * FROM burgers;", function(err, data) {
    if (err) {
      return res.status(500).end();
    }

    res.json(data);
  });
});

app.post("/api/burgers", function(req, res) {
    connection.query("INSERT INTO burgers (burger_name) VALUES (?)", [req.body.burger], function(err, result) {
      if (err) {
        console.log(err);
        return res.status(500).end();
      }
      // res.redirect("/")
      // Send back the ID of the new movie
      res.json({ id: result.insertId });
      console.log({ id: result.insertId });
    });
  });

app.put("/api/burgers/:id", function(req, res) {
    connection.query("UPDATE burgers SET devoured = ? WHERE id = ?", [1, req.params.id], function(err, result) {
      if (err) {
        // If an error occurred, send a generic server failure
        return res.status(500).end();
      }
      else if (result.changedRows === 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      }
      res.status(200).end();
  
    });
  });

  app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
  });