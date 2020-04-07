// == Imports and Require Statements ==//
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// == mySQL connection ==//
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.mySqlPassword,
  database: "employee_db",
});

connection.connect((err) => {
  if (err) {
    console.log(err);
    res.status(500);
    return res.send("There was an error connecting to the database.");
  }
  console.log("You're connected!");
});
