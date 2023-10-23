const mysql2 = require("mysql2");
// const dbConfig = require("../config/db.config.js");

// Create a connection to the database
const connection = mysql2.createConnection({
  host: "localhost",
  user:"root",
  password: "##mani$$1954",
  database: "spinner"
});

// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = connection;