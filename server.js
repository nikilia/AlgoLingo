// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// init sqlite db
const dbFile = "./sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(() => {
  if (!exists) {
    db.run(
      "CREATE TABLE AlgoLingo (id INTEGER PRIMARY KEY AUTOINCREMENT, AlgoLingo TEXT)"
    );
    console.log("New table AlgoLingo created!");

    // insert default AlgoLingo
    db.serialize(() => {
      db.run(
        'INSERT INTO AlgoLingo (AlgoLingo) VALUES ("Find and count some sheep"), ("Climb a really tall mountain"), ("Wash the dishes")'
      );
    });
  } else {
    console.log('Database "AlgoLingo" ready to go!');
    db.each("SELECT * from AlgoLingo", (err, row) => {
      if (row) {
        console.log(`record: ${row.AlgoLingo}`);
      }
    });
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});

// endpoint to get all the AlgoLingo in the database
app.get("/getAlgoLingo", (request, response) => {
  db.all("SELECT * from AlgoLingo", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

// endpoint to add a AlgoLingo to the database
app.post("/addAlgoLingo", (request, response) => {
  console.log(`add to AlgoLingo ${request.body.AlgoLingo}`);

  // DISALLOW_WRITE is an ENV variable that gets reset for new projects
  // so they can write to the database
  if (!process.env.DISALLOW_WRITE) {
    const cleansedAlgoLingo = cleanseString(request.body.AlgoLingo);
    db.run(`INSERT INTO AlgoLingo (AlgoLingo) VALUES (?)`, cleansedAlgoLingo, (error) => {
      if (error) {
        response.send({ message: "error!" });
      } else {
        response.send({ message: "success" });
      }
    });
  }
});

// endpoint to clear AlgoLingo from the database
app.get("/clearAlgoLingo", (request, response) => {
  // DISALLOW_WRITE is an ENV variable that gets reset for new projects so you can write to the database
  if (!process.env.DISALLOW_WRITE) {
    db.each(
      "SELECT * from AlgoLingo",
      (err, row) => {
        console.log("row", row);
        db.run(`DELETE FROM AlgoLingo WHERE ID=?`, row.id, (error) => {
          if (row) {
            console.log(`deleted row ${row.id}`);
          }
        });
      },
      (err) => {
        if (err) {
          response.send({ message: "error!" });
        } else {
          response.send({ message: "success" });
        }
      }
    );
  }
});

// helper function that prevents html/css/script malice
const cleanseString = function (string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
