require('dotenv').config()
const csvtojson = require('csvtojson');
const mysql = require('mysql');

// CSV file name 
const FILE_NAME = '../geolocation_data.csv';

// Establish connection to the database 
let con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


con.connect((err) => {
  if (err) return console.error('error: ' + err.message);

  // Drop geolocation Table if exists
  con.query('DROP TABLE geolocation',
    (err, drop) => {

      // Query to create table
      var createStatament =
        `CREATE TABLE geolocation (
      id INT AUTO_INCREMENT PRIMARY KEY,
      street VARCHAR(32),
      city VARCHAR(32),
      zip_code VARCHAR(20),
      county VARCHAR(32),
      country VARCHAR(64),
      latitude DECIMAL(6, 3),
      longitude DECIMAL(6, 3),
      time_zone VARCHAR(32)
    )`

      // Creating table 'geolocation'
      con.query(createStatament, (err, drop) => {
        if (err) console.log('ERROR: ', err);
      });
    });
});

// Database migration from CSV file
csvtojson().fromFile(FILE_NAME).then(source => {
  let id, street, city, zip_code, county, country, latitude, longitude, time_zone;
  let insertStatement, items;

  // Fetching the data from each row and inserting to the table 
  for (let i = 0; i < source.length; i++) {
    id = i + 1;
    street = source[i]['street'];
    city = source[i]['city'];
    zip_code = source[i]['zip_code'];
    county = source[i]['county'];
    country = source[i]['country'];
    latitude = source[i]['latitude'];
    longitude = source[i]['longitude'];
    time_zone = source[i]['time_zone'];

    insertStatement = `INSERT INTO geolocation values(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    items = [id, street, city, zip_code, county, country, latitude, longitude, time_zone];

    // Inserting data of current row into database 
    con.query(insertStatement, items,
      (err, results, fields) => {
        if (err) {
          console.log('Unable to insert item at row ', i + 1);
          return console.log(err);
        }
      });
  }
  console.log('All items stored into database successfully');
}).catch((err) => {
  // Handle any errors that occur during CSV parsing
  console.error(err);
});
