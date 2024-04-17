const csvtojson = require('csvtojson'); 
const mysql = require("mysql"); 
  
// Database credentials 
const hostname = "localhost", 
    username = "yecyec", 
    password = "", 
    databsename = "datastealth"
  
  
// Establish connection to the database 
let con = mysql.createConnection({ 
    host: hostname, 
    user: username, 
    password: password, 
    database: databsename, 
}); 
  
con.connect((err) => { 
    if (err) return console.error('error: ' + err.message); 
  
    con.query("DROP TABLE geolocation",  
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
    
            // Creating table "sample" 
            con.query(createStatament, (err, drop) => { 
                if (err) 
                    console.log("ERROR: ", err); 
            }); 
    }); 
}); 
  
// CSV file name 
const fileName = "geolocation_data.csv"; 
  
csvtojson().fromFile(fileName).then(source => { 
  
    // Fetching the data from each row and inserting to the table 
    let id, street, city, zip_code, county, country, latitude, longitude, time_zone;
    for (var i = 0; i < source.length; i++) { 
        id = i + 1,
        street = source[i]["street"], 
        city = source[i]["city"], 
        zip_code = source[i]["zip_code"], 
        county = source[i]["county"] 
        country = source[i]["country"], 
        latitude = source[i]["latitude"], 
        longitude = source[i]["longitude"], 
        time_zone = source[i]["time_zone"] 

  
        var insertStatement =  
        `INSERT INTO geolocation values(?, ?, ?, ?, ?, ?, ?, ?, ?)`; 
        var items = [id, street, city, zip_code, county, country, latitude, longitude, time_zone]; 
  
        // Inserting data of current row 
        // into database 
        con.query(insertStatement, items,  
            (err, results, fields) => { 
            if (err) { 
                console.log( "Unable to insert item at row ", i + 1); 
                return console.log(err); 
            } 
        }); 
    } 
    console.log( "All items stored into database successfully"); 
}); 